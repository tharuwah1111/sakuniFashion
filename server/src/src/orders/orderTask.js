import { db } from '../database/db.js';

/**
 * Helper to update tasks when an order status changes (e.g. cancelled or completed)
 */
export function handleOrderTaskSync(orderId, orderStatus) {
  const data = db.getData();
  const tasks = data.Task.filter(t => t.Order_id === orderId && t.is_deleted === 0);

  if (orderStatus === 2) {
    // If order is cancelled, cancel all active tasks for this order
    tasks.forEach(t => {
      if (t.is_completed === 0) {
        t.is_deleted = 1;
      }
    });
  } else if (orderStatus === 1) {
    // If order is marked completed, mark all tasks as completed
    tasks.forEach(t => {
      t.is_completed = 1;
      if (!t.complete_at) {
        t.complete_at = new Date().toISOString().split('T')[0];
      }
    });
  }
}

/**
 * Automatically creates task(s) for newly added order items based on design fees
 */
export function createTasksForOrderItems(orderId, items, employeeId, deadline) {
  const data = db.getData();
  const createdTasks = [];
  const today = new Date().toISOString().split('T')[0];

  items.forEach(item => {
    const design = data.Designs.find(d => d.Design_id === item.Design_id);
    const fee = design ? design.fee_for_task * (item.qty || 1) : 1000;

    const taskId = `TSK${String(data.Task.length + 1 + createdTasks.length).padStart(3, '0')}`;
    const newTask = {
      Task_id: taskId,
      Order_id: orderId,
      Employee_id: employeeId || '',
      created_at: today,
      complete_at: deadline || today,
      fee,
      is_completed: 0,
      is_deleted: 0,
    };
    createdTasks.push(newTask);
  });

  data.Task.push(...createdTasks);
  return createdTasks;
}
