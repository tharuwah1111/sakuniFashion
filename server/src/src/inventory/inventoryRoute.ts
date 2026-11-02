import { Router, Request, Response } from 'express';
import { db, InventoryItem } from '../database/db.js';

export const inventoryRouter = Router();

// GET /api/inventory - List all inventory items
inventoryRouter.get('/', (_req: Request, res: Response) => {
  const data = db.getData();
  const items = data.Inventory.filter(i => i.is_deleted === 0);
  res.json(items);
});

// POST /api/inventory - Add new item
inventoryRouter.post('/', (req: Request, res: Response) => {
  const { item_name, qty } = req.body;
  if (!item_name) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  const data = db.getData();
  const nextNum = data.Inventory.length + 1;
  const Inventory_id = `INV${String(nextNum).padStart(3, '0')}`;
  const Created_at = new Date().toISOString().split('T')[0];

  const newItem: InventoryItem = {
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

// PUT /api/inventory/:id - Update item name or quantity
inventoryRouter.put('/:id', (req: Request, res: Response) => {
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

// PATCH /api/inventory/:id/stock - Adjust quantity (+/-)
inventoryRouter.patch('/:id/stock', (req: Request, res: Response) => {
  const { id } = req.params;
  const { change } = req.body; // e.g. +5 or -10
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

// DELETE /api/inventory/:id - Remove item
inventoryRouter.delete('/:id', (req: Request, res: Response) => {
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
