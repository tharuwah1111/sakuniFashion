import { Router } from 'express';
import { db } from '../database/db.js';

export const inventoryRouter = Router();

// GET /api/inventory
inventoryRouter.get('/', (_req, res) => {
  const data = db.getData();
  const items = data.Inventory.filter(i => i.is_deleted === 0);
  res.json(items);
});

// POST /api/inventory
inventoryRouter.post('/', (req, res) => {
  const { item_name, qty } = req.body;
  if (!item_name) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  const data = db.getData();
  const nextNum = data.Inventory.length + 1;
  const Inventory_id = `INV${String(nextNum).padStart(3, '0')}`;
  const Created_at = new Date().toISOString().split('T')[0];

  const newItem = {
    Inventory_id,
    item_name: String(item_name).trim(),
    qty: Number(qty) || 0,
    Created_at,
    is_deleted: 0,
  };

  data.Inventory.push(newItem);
  db.save();

  res.status(201).json(newItem);
});

// PUT /api/inventory/:id
inventoryRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { item_name, qty } = req.body;
  const data = db.getData();

  const item = data.Inventory.find(i => i.Inventory_id === id && i.is_deleted === 0);
  if (!item) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  if (item_name !== undefined) item.item_name = String(item_name).trim();
  if (qty !== undefined) item.qty = Number(qty);

  db.save();

  res.json(item);
});

// PATCH /api/inventory/:id/stock
inventoryRouter.patch('/:id/stock', (req, res) => {
  const { id } = req.params;
  const { change } = req.body;
  const data = db.getData();

  const item = data.Inventory.find(i => i.Inventory_id === id && i.is_deleted === 0);
  if (!item) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  const delta = Number(change) || 0;
  item.qty = Math.max(0, item.qty + delta);

  db.save();

  res.json(item);
});

// DELETE /api/inventory/:id
inventoryRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const item = data.Inventory.find(i => i.Inventory_id === id && i.is_deleted === 0);
  if (!item) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  item.is_deleted = 1;
  db.save();

  res.json({ success: true, message: 'Inventory item removed' });
});
