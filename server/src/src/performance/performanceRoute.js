import { Router } from 'express';
import { db } from '../database/db.js';

export const performanceRouter = Router();

// GET /api/performance
performanceRouter.get('/', (_req, res) => {
  const data = db.getData();

  const activeEmployees = data.Employees.filter(e => e.is_deleted === 0);
  const allTasks = data.Task.filter(t => t.is_deleted === 0);
  const allOrders = data.Orders.filter(o => o.is_deleted === 0);
  const allBills = data.Bills.filter(b => b.is_deleted === 0);

  const employeePerformance = activeEmployees.map(emp => {
    const empTasks = allTasks.filter(t => t.Employee_id === emp.Employee_id);
    const completedTasks = empTasks.filter(t => t.is_completed === 1);
    const pendingTasks = empTasks.filter(t => t.is_completed === 0);

    const totalEarned = completedTasks.reduce((acc, t) => acc + (t.fee || 0), 0);
    const pendingEarned = pendingTasks.reduce((acc, t) => acc + (t.fee || 0), 0);
    const totalSalaries = data.Salary.filter(s => s.Employee_id === emp.Employee_id).reduce((acc, s) => acc + s.salary, 0);

    const lastTask = empTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null;

    return {
      employee_id: emp.Employee_id,
      name: emp.full_name,
      NIC: emp.NIC,
      totalAssignedTasks: empTasks.length,
      completedTasksCount: completedTasks.length,
      pendingTasksCount: pendingTasks.length,
      completionRate: empTasks.length > 0 ? Math.round((completedTasks.length / empTasks.length) * 100) : 0,
      totalEarned,
      pendingEarned,
      totalSalariesPaid: totalSalaries,
      lastAssignedTask: lastTask,
    };
  });

  const totalRevenue = allBills.reduce((acc, b) => acc + (b.total || 0), 0);
  const totalAdvanceCollected = allBills.reduce((acc, b) => acc + (b.advance_payment || 0), 0);
  const totalRemains = allBills.reduce((acc, b) => acc + (b.remains || 0), 0);

  const completedOrders = allOrders.filter(o => o.is_completed === 1).length;
  const inProgressOrders = allOrders.filter(o => o.is_completed === 0).length;
  const cancelledOrders = allOrders.filter(o => o.is_completed === 2).length;

  res.json({
    metrics: {
      totalOrders: allOrders.length,
      completedOrders,
      inProgressOrders,
      cancelledOrders,
      totalRevenue,
      totalAdvanceCollected,
      totalRemains,
      activeEmployeesCount: activeEmployees.length,
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.is_completed === 1).length,
      pendingTasks: allTasks.filter(t => t.is_completed === 0).length,
    },
    employeePerformance,
  });
});
