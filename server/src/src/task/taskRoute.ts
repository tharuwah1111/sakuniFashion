import { Router, Request, Response } from 'express';
import { db, Task } from '../database/db.js';

export const taskRouter = Router();

// GET /api/tasks - List all tasks with enriched details
taskRouter.get('/', (req: Request, res: Response) => {
  const { employee_id, is_completed, order_id } = req.query;
  const data = db.getData();

  let tasks = data.Task.filter(t => t.is_deleted === 0);

  if (employee_id) {
    tasks = tasks.filter(t => t.Employee_id === employee_id);
  }
  if (is_completed !== undefined && is_completed !== '') {
    tasks = tasks.filter(t => String(t.is_completed) === String(is_completed));
  }
  if (order_id) {
    tasks = tasks.filter(t => t.Order_id === order_id);
  }

  const enriched = tasks.map(t => {
    const employee = data.Employees.find(e => e.Employee_id === t.Employee_id);
    const order = data.Orders.find(o => o.Order_id === t.Order_id);
    const customer = order ? data.Customers.find(c => c.Customer_id === order.Customer_id) : null;
    const orderItems = data.Order_items.filter(oi => oi.Order_id === t.Order_id && oi.is_deleted === 0);

    return {
      ...t,
      employee_name: employee ? employee.full_name : 'Unassigned',
      employee,
      order,
      customer_name: customer ? customer.full_name : 'Unknown Customer',
      order_deadline: order?.deadline,
      orderItems,
    };
  });

  // Sort by complete_at date
  enriched.sort((a, b) => new Date(a.complete_at).getTime() - new Date(b.complete_at).getTime());

  res.json(enriched);
});

// POST /api/tasks - Create manual task
taskRouter.post('/', (req: Request, res: Response) => {
  const { Order_id, Employee_id = '', complete_at, fee = 0 } = req.body;
  if (!Order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const data = db.getData();
  const nextNum = data.Task.length + 1;
  const Task_id = `TSK${String(nextNum).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  const newTask: Task = {
    Task_id,
    Order_id,
    Employee_id: Employee_id || '',
    created_at: today,
    complete_at: complete_at || today,
    fee: Number(fee) || 0,
    is_completed: 0,
    is_deleted: 0,
  };

  data.Task.push(newTask);
  db.save();

  const employee = data.Employees.find(e => e.Employee_id === newTask.Employee_id);
  res.status(201).json({
    ...newTask,
    employee_name: employee ? employee.full_name : 'Unassigned',
  });
});

// PUT /api/tasks/:id - Update task (assignment, complete date, fee, completion status)
taskRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { Employee_id, complete_at, fee, is_completed } = req.body;
  const data = db.getData();

  const task = data.Task.find(t => t.Task_id === id && t.is_deleted === 0);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (Employee_id !== undefined) task.Employee_id = Employee_id;
  if (complete_at !== undefined) task.complete_at = complete_at;
  if (fee !== undefined) task.fee = Number(fee);
  if (is_completed !== undefined) task.is_completed = Number(is_completed);

  db.save();

  const employee = data.Employees.find(e => e.Employee_id === task.Employee_id);
  res.json({
    ...task,
    employee_name: employee ? employee.full_name : 'Unassigned',
  });
});

// PATCH /api/tasks/:id/complete - Toggle or set complete status
taskRouter.patch('/:id/complete', (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_completed } = req.body;
  const data = db.getData();

  const task = data.Task.find(t => t.Task_id === id && t.is_deleted === 0);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.is_completed = is_completed !== undefined ? Number(is_completed) : (task.is_completed === 1 ? 0 : 1);
  if (task.is_completed === 1 && !task.complete_at) {
    task.complete_at = new Date().toISOString().split('T')[0];
  }

  db.save();

  res.json({
    ...task,
    message: task.is_completed === 1 ? 'Task completed' : 'Task marked in progress',
  });
});

// DELETE /api/tasks/:id - Soft delete task
taskRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();

  const task = data.Task.find(t => t.Task_id === id && t.is_deleted === 0);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.is_deleted = 1;
  db.save();

  res.json({ success: true, message: 'Task deleted successfully' });
});
