import { Router } from 'express';
import { db } from '../database/db.js';

export const salaryRouter = Router();

// GET /api/salary
salaryRouter.get('/', (req, res) => {
  const { employee_id } = req.query;
  const data = db.getData();

  let salaries = data.Salary;
  if (employee_id) {
    salaries = salaries.filter(s => s.Employee_id === employee_id);
  }

  const enriched = salaries.map(s => {
    const emp = data.Employees.find(e => e.Employee_id === s.Employee_id);
    return {
      ...s,
      employee_name: emp ? emp.full_name : 'Unknown Employee',
      NIC: emp?.NIC,
    };
  });

  enriched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json(enriched);
});

// POST /api/salary
salaryRouter.post('/', (req, res) => {
  const { Employee_id, salary, date } = req.body;
  if (!Employee_id || salary === undefined) {
    return res.status(400).json({ error: 'Employee ID and salary amount are required' });
  }

  const data = db.getData();
  const nextNum = data.Salary.length + 1;
  const Salary_id = `SAL${String(nextNum).padStart(3, '0')}`;
  const payDate = date || new Date().toISOString().split('T')[0];

  const newSalary = {
    Salary_id,
    Employee_id,
    date: payDate,
    salary: Number(salary) || 0,
  };

  data.Salary.push(newSalary);
  db.save();

  const emp = data.Employees.find(e => e.Employee_id === Employee_id);
  res.status(201).json({
    ...newSalary,
    employee_name: emp ? emp.full_name : 'Unknown Employee',
  });
});
