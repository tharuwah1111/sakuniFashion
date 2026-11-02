import { Router } from 'express';
import { db } from '../database/db.js';

export const designRouter = Router();

// GET /api/designs
designRouter.get('/', (_req, res) => {
  const data = db.getData();
  const designs = data.Designs.filter(d => d.is_deleted === 0).map(d => {
    const colors = data.Colors.filter(c => c.Design_id === d.Design_id && c.is_deleted === 0).map(c => c.color);
    return {
      ...d,
      colors,
    };
  });
  res.json(designs);
});

// POST /api/designs
designRouter.post('/', (req, res) => {
  const { Design_name, catogory, price, fee_for_task, colors = [] } = req.body;
  if (!Design_name || price === undefined) {
    return res.status(400).json({ error: 'Design name and price are required' });
  }

  const data = db.getData();
  const nextNum = data.Designs.length + 1;
  const Design_id = `DSG${String(nextNum).padStart(3, '0')}`;

  const newDesign = {
    Design_id,
    Design_name: String(Design_name).trim(),
    catogory: String(catogory || 'General').trim(),
    price: Number(price) || 0,
    fee_for_task: Number(fee_for_task) || 0,
    is_deleted: 0,
  };

  data.Designs.push(newDesign);

  if (Array.isArray(colors)) {
    colors.forEach((col) => {
      if (col && String(col).trim()) {
        data.Colors.push({
          Design_id,
          color: String(col).trim(),
          is_deleted: 0,
        });
      }
    });
  }

  db.save();

  res.status(201).json({
    ...newDesign,
    colors: data.Colors.filter(c => c.Design_id === Design_id && c.is_deleted === 0).map(c => c.color),
  });
});

// PUT /api/designs/:id
designRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Design_name, catogory, price, fee_for_task, colors } = req.body;
  const data = db.getData();

  const design = data.Designs.find(d => d.Design_id === id && d.is_deleted === 0);
  if (!design) {
    return res.status(404).json({ error: 'Design not found' });
  }

  if (Design_name !== undefined) design.Design_name = String(Design_name).trim();
  if (catogory !== undefined) design.catogory = String(catogory).trim();
  if (price !== undefined) design.price = Number(price);
  if (fee_for_task !== undefined) design.fee_for_task = Number(fee_for_task);

  if (Array.isArray(colors)) {
    data.Colors.forEach(c => {
      if (c.Design_id === id) c.is_deleted = 1;
    });
    colors.forEach((col) => {
      if (col && String(col).trim()) {
        data.Colors.push({
          Design_id: id,
          color: String(col).trim(),
          is_deleted: 0,
        });
      }
    });
  }

  db.save();

  res.json({
    ...design,
    colors: data.Colors.filter(c => c.Design_id === id && c.is_deleted === 0).map(c => c.color),
  });
});

// DELETE /api/designs/:id
designRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const design = data.Designs.find(d => d.Design_id === id && d.is_deleted === 0);
  if (!design) {
    return res.status(404).json({ error: 'Design not found' });
  }

  design.is_deleted = 1;
  data.Colors.forEach(c => {
    if (c.Design_id === id) c.is_deleted = 1;
  });

  db.save();

  res.json({ success: true, message: 'Design deleted successfully' });
});
