import { Router } from 'express';
import { loginRouter } from '../src/login/loginRoute.js';
import { customerRouter } from '../src/customers/customerRoute.js';
import { designRouter } from '../src/designs/designRoute.js';
import { inventoryRouter } from '../src/inventory/inventoryRoute.js';
import { employeeRouter } from '../src/employees/employeeRoute.js';
import { orderRouter } from '../src/orders/order.js';
import { taskRouter } from '../src/task/taskRoute.js';
import { billRouter } from '../src/bills/billRoute.js';
import { salaryRouter } from '../src/salary/salaryRoute.js';
import { appointmentRouter } from '../src/appointment/appointmentRoute.js';
import { scheduleRouter } from '../src/shedules/scheduleRoute.js';
import { performanceRouter } from '../src/performance/performanceRoute.js';
import { db } from '../src/database/db.js';

export const apiRoutes = Router();

// Mount all backend entity routes
apiRoutes.use('/login', loginRouter);
apiRoutes.use('/customers', customerRouter);
apiRoutes.use('/designs', designRouter);
apiRoutes.use('/inventory', inventoryRouter);
apiRoutes.use('/employees', employeeRouter);
apiRoutes.use('/orders', orderRouter);
apiRoutes.use('/tasks', taskRouter);
apiRoutes.use('/bills', billRouter);
apiRoutes.use('/salary', salaryRouter);
apiRoutes.use('/appointment', appointmentRouter);
apiRoutes.use('/shedules', scheduleRouter);
apiRoutes.use('/performance', performanceRouter);

// Health check and database reset endpoints
apiRoutes.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Sakuni Fashion Management System' });
});

apiRoutes.post('/database/reset', (_req, res) => {
  const data = db.resetToDefault();
  res.json({ success: true, message: 'Database reset to default seed data', data });
});
