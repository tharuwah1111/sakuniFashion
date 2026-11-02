import { Router, Request, Response } from 'express';
import { db, Order, OrderItem, Bill } from '../database/db.js';
import { handleOrderTaskSync, createTasksForOrderItems } from './orderTask.js';

export const orderRouter = Router();

// GET /api/orders - List all orders with customer, items, bill, and tasks
orderRouter.get('/', (req: Request, res: Response) => {
  const { status, customer_id, urgent } = req.query;
  const data = db.getData();

  let orders = data.Orders.filter(o => o.is_deleted === 0);

  if (status !== undefined && status !== '') {
    orders = orders.filter(o => String(o.is_completed) === String(status));
  }
  if (customer_id) {
    orders = orders.filter(o => o.Customer_id === customer_id);
  }

  const enriched = orders.map(o => {
    const customer = data.Customers.find(c => c.Customer_id === o.Customer_id);
    const items = data.Order_items.filter(oi => oi.Order_id === o.Order_id && oi.is_deleted === 0).map(oi => {
      const design = data.Designs.find(d => d.Design_id === oi.Design_id);
      return {
        ...oi,
        design_name: design?.Design_name || 'Custom Garment',
        design_category: design?.catogory || 'General',
      };
    });
    const bill = data.Bills.find(b => b.Order_id === o.Order_id && b.is_deleted === 0);
    const tasks = data.Task.filter(t => t.Order_id === o.Order_id && t.is_deleted === 0).map(t => {
      const emp = data.Employees.find(e => e.Employee_id === t.Employee_id);
      return {
        ...t,
        employee_name: emp ? emp.full_name : 'Unassigned',
      };
    });

    // Check if due tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const isDueTomorrow = o.deadline === tomorrow;
    const isDueToday = o.deadline === today;
    const isOverdue = o.is_completed === 0 && o.deadline < today;

    return {
      ...o,
      customer_name: customer ? customer.full_name : 'Unknown Customer',
      customer,
      items,
      bill,
      tasks,
      isDueTomorrow,
      isDueToday,
      isOverdue,
    };
  });

  // Sort by deadline ascending
  enriched.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  if (urgent === 'true') {
    return res.json(enriched.filter(o => o.isDueTomorrow || o.isDueToday || o.isOverdue));
  }

  res.json(enriched);
});

// GET /api/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();

  const o = data.Orders.find(ord => ord.Order_id === id && ord.is_deleted === 0);
  if (!o) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const customer = data.Customers.find(c => c.Customer_id === o.Customer_id);
  const size = customer ? data.Customer_size.find(s => s.Customer_id === customer.Customer_id) : null;
  const items = data.Order_items.filter(oi => oi.Order_id === o.Order_id && oi.is_deleted === 0).map(oi => {
    const design = data.Designs.find(d => d.Design_id === oi.Design_id);
    return {
      ...oi,
      design_name: design?.Design_name || 'Custom Garment',
      design_category: design?.catogory || 'General',
    };
  });
  const bill = data.Bills.find(b => b.Order_id === o.Order_id && b.is_deleted === 0);
  const tasks = data.Task.filter(t => t.Order_id === o.Order_id && t.is_deleted === 0).map(t => {
    const emp = data.Employees.find(e => e.Employee_id === t.Employee_id);
    return {
      ...t,
      employee_name: emp ? emp.full_name : 'Unassigned',
    };
  });

  res.json({
    ...o,
    customer,
    size,
    items,
    bill,
    tasks,
  });
});

// POST /api/orders - Create new order with items, tasks, and initial bill
orderRouter.post('/', (req: Request, res: Response) => {
  const {
    Customer_id,
    deadline,
    items = [],
    advance_payment = 0,
    assigned_employee_id,
  } = req.body;

  if (!Customer_id || !deadline || !items.length) {
    return res.status(400).json({ error: 'Customer, deadline, and at least one order item are required' });
  }

  const data = db.getData();
  const nextNum = data.Orders.length + 1;
  const Order_id = `ORD${String(nextNum).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newOrder: Order = {
    Order_id,
    Customer_id,
    deadline,
    create_at: today,
    time: nowTime,
    is_completed: 0,
    is_deleted: 0,
  };

  data.Orders.push(newOrder);

  // Insert Order_items & compute total
  let totalAmount = 0;
  const createdItems: OrderItem[] = [];

  items.forEach((item: any, idx: number) => {
    const design = data.Designs.find(d => d.Design_id === item.Design_id);
    const unitPrice = item.price !== undefined ? Number(item.price) : (design?.price || 0);
    const qty = Number(item.qty) || 1;
    totalAmount += unitPrice * qty;

    const itemId = `ORI${String(data.Order_items.length + 1 + idx).padStart(3, '0')}`;
    const orderItem: OrderItem = {
      Order_item_id: itemId,
      Order_id,
      Design_id: item.Design_id,
      color: item.color || 'Standard',
      qty,
      price: unitPrice,
      notes: item.notes || '',
      is_deleted: 0,
    };
    createdItems.push(orderItem);
  });

  data.Order_items.push(...createdItems);

  // Automatically create manufacturing tasks for employees
  createTasksForOrderItems(Order_id, items, assigned_employee_id, deadline);

  // Create initial Bill
  const adv = Number(advance_payment) || 0;
  const remains = Math.max(0, totalAmount - adv);
  const billId = `BIL${String(data.Bills.length + 1).padStart(3, '0')}`;
  const newBill: Bill = {
    Bill_id: billId,
    Order_id,
    total: totalAmount,
    advance_payment: adv,
    remains,
    created_at: nowTime,
    is_deleted: 0,
  };
  data.Bills.push(newBill);

  db.save();

  res.status(201).json({
    ...newOrder,
    items: createdItems,
    bill: newBill,
    tasks: data.Task.filter(t => t.Order_id === Order_id && t.is_deleted === 0),
  });
});

// PUT /api/orders/:id - Update order deadline or status
orderRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { deadline, is_completed } = req.body;
  const data = db.getData();

  const order = data.Orders.find(o => o.Order_id === id && o.is_deleted === 0);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (deadline) {
    order.deadline = deadline;
    // Update task deadlines as well
    data.Task.filter(t => t.Order_id === id && t.is_deleted === 0).forEach(t => {
      t.complete_at = deadline;
    });
  }

  if (is_completed !== undefined) {
    order.is_completed = Number(is_completed);
    handleOrderTaskSync(id, order.is_completed);
  }

  db.save();

  res.json({
    ...order,
    tasks: data.Task.filter(t => t.Order_id === id && t.is_deleted === 0),
  });
});

// PATCH /api/orders/:id/status - Update status specifically (0 = in progress, 1 = completed, 2 = cancelled)
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = db.getData();

  const order = data.Orders.find(o => o.Order_id === id && o.is_deleted === 0);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const numericStatus = Number(status);
  order.is_completed = numericStatus;

  // IMPORTANT: When order cancels or completes, task should update!
  handleOrderTaskSync(id, numericStatus);

  db.save();

  res.json({
    ...order,
    message: numericStatus === 2 ? 'Order cancelled and tasks updated' : 'Order status updated',
    tasks: data.Task.filter(t => t.Order_id === id && t.is_deleted === 0),
  });
});

// DELETE /api/orders/:id - Soft delete order
orderRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();

  const order = data.Orders.find(o => o.Order_id === id && o.is_deleted === 0);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.is_deleted = 1;
  data.Order_items.forEach(oi => {
    if (oi.Order_id === id) oi.is_deleted = 1;
  });
  data.Task.forEach(t => {
    if (t.Order_id === id) t.is_deleted = 1;
  });
  data.Bills.forEach(b => {
    if (b.Order_id === id) b.is_deleted = 1;
  });

  db.save();

  res.json({ success: true, message: 'Order and associated tasks/items deleted' });
});
