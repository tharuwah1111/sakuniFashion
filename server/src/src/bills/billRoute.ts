import { Router, Request, Response } from 'express';
import { db, Bill } from '../database/db.js';

export const billRouter = Router();

// GET /api/bills - List all bills with customer and order summary
billRouter.get('/', (_req: Request, res: Response) => {
  const data = db.getData();
  const bills = data.Bills.filter(b => b.is_deleted === 0).map(b => {
    const order = data.Orders.find(o => o.Order_id === b.Order_id);
    const customer = order ? data.Customers.find(c => c.Customer_id === order.Customer_id) : null;
    const items = data.Order_items.filter(oi => oi.Order_id === b.Order_id && oi.is_deleted === 0);

    return {
      ...b,
      order,
      customer_name: customer ? customer.full_name : 'Unknown Customer',
      customer,
      itemsCount: items.length,
      isFullyPaid: b.remains <= 0,
    };
  });

  bills.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json(bills);
});

// GET /api/bills/:id - Single bill with full invoice details
billRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();

  const bill = data.Bills.find(b => b.Bill_id === id && b.is_deleted === 0);
  if (!bill) {
    return res.status(404).json({ error: 'Bill not found' });
  }

  const order = data.Orders.find(o => o.Order_id === bill.Order_id);
  const customer = order ? data.Customers.find(c => c.Customer_id === order.Customer_id) : null;
  const phones = customer ? data.Customer_phone.filter(p => p.Customer_id === customer.Customer_id && p.is_deleted === 0) : [];
  const items = data.Order_items.filter(oi => oi.Order_id === bill.Order_id && oi.is_deleted === 0).map(oi => {
    const design = data.Designs.find(d => d.Design_id === oi.Design_id);
    return {
      ...oi,
      design_name: design?.Design_name || 'Garment Item',
      subtotal: oi.qty * oi.price,
    };
  });

  res.json({
    ...bill,
    order,
    customer,
    phones,
    items,
  });
});

// POST /api/bills - Create new bill for an order
billRouter.post('/', (req: Request, res: Response) => {
  const { Order_id, total, advance_payment = 0 } = req.body;
  if (!Order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const data = db.getData();
  const nextNum = data.Bills.length + 1;
  const Bill_id = `BIL${String(nextNum).padStart(3, '0')}`;
  const totalNum = Number(total) || 0;
  const advNum = Number(advance_payment) || 0;
  const remains = Math.max(0, totalNum - advNum);
  const created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newBill: Bill = {
    Bill_id,
    Order_id,
    total: totalNum,
    advance_payment: advNum,
    remains,
    created_at,
    is_deleted: 0,
  };

  data.Bills.push(newBill);
  db.save();

  res.status(201).json(newBill);
});

// PATCH /api/bills/:id/payment - Add payment / update advance payment
billRouter.patch('/:id/payment', (req: Request, res: Response) => {
  const { id } = req.params;
  const { payment_amount } = req.body;
  const data = db.getData();

  const bill = data.Bills.find(b => b.Bill_id === id && b.is_deleted === 0);
  if (!bill) {
    return res.status(404).json({ error: 'Bill not found' });
  }

  const payment = Number(payment_amount) || 0;
  bill.advance_payment += payment;
  bill.remains = Math.max(0, bill.total - bill.advance_payment);

  db.save();

  res.json({
    ...bill,
    message: 'Payment recorded successfully',
  });
});

// DELETE /api/bills/:id - Soft delete bill
billRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();

  const bill = data.Bills.find(b => b.Bill_id === id && b.is_deleted === 0);
  if (!bill) {
    return res.status(404).json({ error: 'Bill not found' });
  }

  bill.is_deleted = 1;
  db.save();

  res.json({ success: true, message: 'Bill deleted successfully' });
});
