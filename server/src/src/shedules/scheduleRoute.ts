import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const scheduleRouter = Router();

// GET /api/shedules - Scheduled upcoming orders with categorization and urgency highlights
scheduleRouter.get('/', (req: Request, res: Response) => {
  const data = db.getData();
  const today = new Date().toISOString().split('T')[0];
  
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = tomorrowObj.toISOString().split('T')[0];

  const in7DaysObj = new Date();
  in7DaysObj.setDate(in7DaysObj.getDate() + 7);
  const in7Days = in7DaysObj.toISOString().split('T')[0];

  // Active orders only
  const activeOrders = data.Orders.filter(o => o.is_deleted === 0 && o.is_completed === 0);

  const enriched = activeOrders.map(o => {
    const customer = data.Customers.find(c => c.Customer_id === o.Customer_id);
    const phones = customer ? data.Customer_phone.filter(p => p.Customer_id === customer.Customer_id && p.is_deleted === 0) : [];
    const items = data.Order_items.filter(oi => oi.Order_id === o.Order_id && oi.is_deleted === 0).map(oi => {
      const design = data.Designs.find(d => d.Design_id === oi.Design_id);
      return {
        ...oi,
        design_name: design?.Design_name || 'Garment Item',
      };
    });
    const tasks = data.Task.filter(t => t.Order_id === o.Order_id && t.is_deleted === 0).map(t => {
      const emp = data.Employees.find(e => e.Employee_id === t.Employee_id);
      return {
        ...t,
        employee_name: emp ? emp.full_name : 'Unassigned',
      };
    });

    let urgency: 'overdue' | 'today' | 'tomorrow' | 'this_week' | 'upcoming' = 'upcoming';
    if (o.deadline < today) {
      urgency = 'overdue';
    } else if (o.deadline === today) {
      urgency = 'today';
    } else if (o.deadline === tomorrow) {
      urgency = 'tomorrow';
    } else if (o.deadline <= in7Days) {
      urgency = 'this_week';
    }

    return {
      ...o,
      customer_name: customer ? customer.full_name : 'Unknown Customer',
      customer,
      phones,
      items,
      tasks,
      urgency,
      isDueTomorrow: urgency === 'tomorrow',
      isDueToday: urgency === 'today',
      isOverdue: urgency === 'overdue',
    };
  });

  // Sort by deadline ascending
  enriched.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const dueTomorrow = enriched.filter(o => o.urgency === 'tomorrow');
  const dueToday = enriched.filter(o => o.urgency === 'today');
  const overdue = enriched.filter(o => o.urgency === 'overdue');
  const upcomingThisWeek = enriched.filter(o => o.urgency === 'this_week');
  const upcomingLater = enriched.filter(o => o.urgency === 'upcoming');

  res.json({
    summary: {
      totalUpcoming: enriched.length,
      dueTomorrowCount: dueTomorrow.length,
      dueTodayCount: dueToday.length,
      overdueCount: overdue.length,
      thisWeekCount: upcomingThisWeek.length,
    },
    dueTomorrow,
    dueToday,
    overdue,
    upcomingThisWeek,
    upcomingLater,
    allScheduled: enriched,
  });
});

// GET /api/shedules/tomorrow - Explicit endpoint for critical tomorrow orders
scheduleRouter.get('/tomorrow', (_req: Request, res: Response) => {
  const data = db.getData();
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = tomorrowObj.toISOString().split('T')[0];

  const tomorrowOrders = data.Orders
    .filter(o => o.is_deleted === 0 && o.is_completed === 0 && o.deadline === tomorrow)
    .map(o => {
      const customer = data.Customers.find(c => c.Customer_id === o.Customer_id);
      const phones = customer ? data.Customer_phone.filter(p => p.Customer_id === customer.Customer_id && p.is_deleted === 0) : [];
      const items = data.Order_items.filter(oi => oi.Order_id === o.Order_id && oi.is_deleted === 0);
      const tasks = data.Task.filter(t => t.Order_id === o.Order_id && t.is_deleted === 0).map(t => {
        const emp = data.Employees.find(e => e.Employee_id === t.Employee_id);
        return {
          ...t,
          employee_name: emp ? emp.full_name : 'Unassigned',
        };
      });

      return {
        ...o,
        customer_name: customer ? customer.full_name : 'Unknown Customer',
        customer,
        phones,
        items,
        tasks,
      };
    });

  res.json({
    date: tomorrow,
    count: tomorrowOrders.length,
    orders: tomorrowOrders,
  });
});
