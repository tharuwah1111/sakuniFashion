import { Router } from 'express';
import { db } from '../database/db.js';

export const employeeRouter = Router();

// GET /api/employees
employeeRouter.get('/', (req, res) => {
  const q = ((req.query.q) || '').toLowerCase().trim();
  const data = db.getData();

  const employees = data.Employees
    .filter(e => e.is_deleted === 0)
    .filter(e => {
      if (!q) return true;
      return (
        e.Employee_id.toLowerCase().includes(q) ||
        e.full_name.toLowerCase().includes(q) ||
        e.NIC.toLowerCase().includes(q)
      );
    })
    .map(e => {
      const phones = data.Employee_phone.filter(p => p.Employee_id === e.Employee_id && p.is_deleted === 0);
      
      const empTasks = data.Task
        .filter(t => t.Employee_id === e.Employee_id && t.is_deleted === 0)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const lastAssignedTask = empTasks.length > 0 ? empTasks[0] : null;

      const taskEarnings = empTasks
        .filter(t => t.is_completed === 1)
        .reduce((sum, t) => sum + (t.fee || 0), 0);

      const totalSalaries = data.Salary
        .filter(s => s.Employee_id === e.Employee_id)
        .reduce((sum, s) => sum + (s.salary || 0), 0);

      const pendingTaskEarnings = empTasks
        .filter(t => t.is_completed === 0)
        .reduce((sum, t) => sum + (t.fee || 0), 0);

      return {
        ...e,
        phones,
        lastAssignedTask,
        completedTasksCount: empTasks.filter(t => t.is_completed === 1).length,
        activeTasksCount: empTasks.filter(t => t.is_completed === 0).length,
        totalEarnings: taskEarnings,
        pendingEarnings: pendingTaskEarnings,
        totalSalariesPaid: totalSalaries,
      };
    });

  res.json(employees);
});

// GET /api/employees/:id
employeeRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const emp = data.Employees.find(e => e.Employee_id === id && e.is_deleted === 0);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const phones = data.Employee_phone.filter(p => p.Employee_id === id && p.is_deleted === 0);
  const tasks = data.Task.filter(t => t.Employee_id === id && t.is_deleted === 0);
  const salaries = data.Salary.filter(s => s.Employee_id === id);

  const lastAssignedTask = tasks.length > 0
    ? [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  const totalEarnings = tasks
    .filter(t => t.is_completed === 1)
    .reduce((sum, t) => sum + (t.fee || 0), 0);

  res.json({
    ...emp,
    phones,
    tasks,
    salaries,
    lastAssignedTask,
    totalEarnings,
  });
});

// POST /api/employees
employeeRouter.post('/', (req, res) => {
  const { first_name, last_name, NIC, phones = [] } = req.body;
  if (!first_name || !last_name || !NIC) {
    return res.status(400).json({ error: 'First name, last name, and NIC are required' });
  }

  const data = db.getData();
  const nextNum = data.Employees.length + 1;
  const Employee_id = `EMP${String(nextNum).padStart(3, '0')}`;
  const full_name = `${first_name.trim()} ${last_name.trim()}`;
  const Created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newEmp = {
    Employee_id,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    full_name,
    NIC: String(NIC).trim(),
    Created_at,
    is_deleted: 0,
  };

  data.Employees.push(newEmp);

  if (Array.isArray(phones)) {
    phones.forEach((p) => {
      if (p.number && p.number.trim()) {
        data.Employee_phone.push({
          Employee_id,
          number: p.number.trim(),
          state: p.state || 'Active',
          is_deleted: 0,
        });
      }
    });
  }

  db.save();

  res.status(201).json({
    ...newEmp,
    phones: data.Employee_phone.filter(p => p.Employee_id === Employee_id && p.is_deleted === 0),
    totalEarnings: 0,
    lastAssignedTask: null,
  });
});

// PUT /api/employees/:id
employeeRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, NIC, phones } = req.body;
  const data = db.getData();

  const emp = data.Employees.find(e => e.Employee_id === id && e.is_deleted === 0);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  if (first_name) emp.first_name = first_name.trim();
  if (last_name) emp.last_name = last_name.trim();
  emp.full_name = `${emp.first_name} ${emp.last_name}`;
  if (NIC) emp.NIC = String(NIC).trim();

  if (Array.isArray(phones)) {
    data.Employee_phone.forEach(p => {
      if (p.Employee_id === id) p.is_deleted = 1;
    });
    phones.forEach((p) => {
      if (p.number && p.number.trim()) {
        data.Employee_phone.push({
          Employee_id: id,
          number: p.number.trim(),
          state: p.state || 'Active',
          is_deleted: 0,
        });
      }
    });
  }

  db.save();

  res.json({
    ...emp,
    phones: data.Employee_phone.filter(p => p.Employee_id === id && p.is_deleted === 0),
  });
});

// DELETE /api/employees/:id
employeeRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const emp = data.Employees.find(e => e.Employee_id === id && e.is_deleted === 0);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  emp.is_deleted = 1;
  data.Employee_phone.forEach(p => {
    if (p.Employee_id === id) p.is_deleted = 1;
  });

  db.save();

  res.json({ success: true, message: 'Employee deleted successfully' });
});
