import { Router } from 'express';
import { db } from '../database/db.js';

export const customerRouter = Router();

// GET /api/customers
customerRouter.get('/', (req, res) => {
  const q = ((req.query.q) || '').toLowerCase().trim();
  const data = db.getData();

  const customers = data.Customers
    .filter(c => c.is_deleted === 0)
    .filter(c => {
      if (!q) return true;
      return (
        c.Customer_id.toLowerCase().includes(q) ||
        c.full_name.toLowerCase().includes(q) ||
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q)
      );
    })
    .map(c => {
      const phones = data.Customer_phone.filter(p => p.Customer_id === c.Customer_id && p.is_deleted === 0);
      const size = data.Customer_size.find(s => s.Customer_id === c.Customer_id);
      const orderCount = data.Orders.filter(o => o.Customer_id === c.Customer_id && o.is_deleted === 0).length;
      return {
        ...c,
        phones,
        size,
        orderCount,
      };
    });

  res.json(customers);
});

// GET /api/customers/:id
customerRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const customer = data.Customers.find(c => c.Customer_id === id && c.is_deleted === 0);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const phones = data.Customer_phone.filter(p => p.Customer_id === id && p.is_deleted === 0);
  const size = data.Customer_size.find(s => s.Customer_id === id);

  const customerOrders = data.Orders
    .filter(o => o.Customer_id === id && o.is_deleted === 0)
    .map(o => {
      const items = data.Order_items.filter(oi => oi.Order_id === o.Order_id && oi.is_deleted === 0);
      const bill = data.Bills.find(b => b.Order_id === o.Order_id && b.is_deleted === 0);
      const tasks = data.Task.filter(t => t.Order_id === o.Order_id && t.is_deleted === 0);
      return {
        ...o,
        items,
        bill,
        tasks,
      };
    });

  res.json({
    ...customer,
    phones,
    size,
    orders: customerOrders,
  });
});

// POST /api/customers
customerRouter.post('/', (req, res) => {
  const { first_name, last_name, phones = [], size = {} } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  const data = db.getData();
  const nextIdNum = data.Customers.length + 1;
  const Customer_id = `CUS${String(nextIdNum).padStart(3, '0')}`;
  const full_name = `${first_name.trim()} ${last_name.trim()}`;
  const Created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newCustomer = {
    Customer_id,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    full_name,
    is_deleted: 0,
    Created_at,
  };

  data.Customers.push(newCustomer);

  if (Array.isArray(phones)) {
    phones.forEach((p) => {
      if (p.number && p.number.trim()) {
        data.Customer_phone.push({
          Customer_id,
          number: p.number.trim(),
          state: p.state || 'Mobile',
          is_deleted: 0,
        });
      }
    });
  }

  const sizeId = `SIZ${String(data.Customer_size.length + 1).padStart(3, '0')}`;
  const newSize = {
    Size_id: sizeId,
    Customer_id,
    Arm_Length: Number(size.Arm_Length) || 0,
    Point: Number(size.Point) || 0,
    Arm_end: Number(size.Arm_end) || 0,
    B_irst: Number(size.B_irst) || 0,
    Neck_width: Number(size.Neck_width) || 0,
    Arm_hole: Number(size.Arm_hole) || 0,
    Back_height: Number(size.Back_height) || 0,
    Neck_length: Number(size.Neck_length) || 0,
    Back_neck_length: Number(size.Back_neck_length) || 0,
    Waist: Number(size.Waist) || 0,
    Arm: Number(size.Arm) || 0,
    B_neck_width: Number(size.B_neck_width) || 0,
    Under_bra: Number(size.Under_bra) || 0,
    Side_slim: Number(size.Side_slim) || 0,
    Sh_to_under_bra: Number(size.Sh_to_under_bra) || 0,
    Sho_to_point: Number(size.Sho_to_point) || 0,
    F_first: Number(size.F_first) || 0,
    Shoulder: Number(size.Shoulder) || 0,
    sh_to_waist: Number(size.sh_to_waist) || 0,
  };
  data.Customer_size.push(newSize);

  db.save();

  res.status(201).json({
    ...newCustomer,
    phones: data.Customer_phone.filter(p => p.Customer_id === Customer_id && p.is_deleted === 0),
    size: newSize,
  });
});

// PUT /api/customers/:id
customerRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phones, size } = req.body;
  const data = db.getData();

  const customer = data.Customers.find(c => c.Customer_id === id && c.is_deleted === 0);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  if (first_name) customer.first_name = first_name.trim();
  if (last_name) customer.last_name = last_name.trim();
  customer.full_name = `${customer.first_name} ${customer.last_name}`;

  if (Array.isArray(phones)) {
    data.Customer_phone.forEach(p => {
      if (p.Customer_id === id) p.is_deleted = 1;
    });
    phones.forEach((p) => {
      if (p.number && p.number.trim()) {
        data.Customer_phone.push({
          Customer_id: id,
          number: p.number.trim(),
          state: p.state || 'Mobile',
          is_deleted: 0,
        });
      }
    });
  }

  if (size) {
    let existingSize = data.Customer_size.find(s => s.Customer_id === id);
    if (!existingSize) {
      existingSize = {
        Size_id: `SIZ${String(data.Customer_size.length + 1).padStart(3, '0')}`,
        Customer_id: id,
        Arm_Length: 0,
        Point: 0,
        Arm_end: 0,
        B_irst: 0,
        Neck_width: 0,
        Arm_hole: 0,
        Back_height: 0,
        Neck_length: 0,
        Back_neck_length: 0,
        Waist: 0,
        Arm: 0,
        B_neck_width: 0,
        Under_bra: 0,
        Side_slim: 0,
        Sh_to_under_bra: 0,
        Sho_to_point: 0,
        F_first: 0,
        Shoulder: 0,
        sh_to_waist: 0,
      };
      data.Customer_size.push(existingSize);
    }

    const fields = [
      'Arm_Length', 'Point', 'Arm_end', 'B_irst', 'Neck_width',
      'Arm_hole', 'Back_height', 'Neck_length', 'Back_neck_length',
      'Waist', 'Arm', 'B_neck_width', 'Under_bra', 'Side_slim',
      'Sh_to_under_bra', 'Sho_to_point', 'F_first', 'Shoulder', 'sh_to_waist'
    ];

    fields.forEach(f => {
      if (size[f] !== undefined) {
        existingSize[f] = Number(size[f]);
      }
    });
  }

  db.save();

  res.json({
    ...customer,
    phones: data.Customer_phone.filter(p => p.Customer_id === id && p.is_deleted === 0),
    size: data.Customer_size.find(s => s.Customer_id === id),
  });
});

// DELETE /api/customers/:id
customerRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const customer = data.Customers.find(c => c.Customer_id === id && c.is_deleted === 0);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  customer.is_deleted = 1;
  data.Customer_phone.forEach(p => {
    if (p.Customer_id === id) p.is_deleted = 1;
  });

  db.save();

  res.json({ success: true, message: 'Customer deleted successfully' });
});
