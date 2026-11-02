import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { InventoryModal } from './InventoryModal.jsx';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

export const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await api.getInventory();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSaveItem = async (data) => {
    if (editingItem) {
      await api.updateInventoryItem(editingItem.Inventory_id, data);
    } else {
      await api.createInventoryItem(data);
    }
    loadInventory();
  };

  const handleStockAdjust = async (id, change) => {
    try {
      await api.adjustInventoryStock(id, change);
      loadInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      try {
        await api.deleteInventoryItem(id);
        loadInventory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = items.filter(i =>
    i.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.Inventory_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.qty < 20).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-cyan-400" /> Inventory &amp; Raw Materials
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track fabric yardage, embroidery threads, buttons, and garment notions stock levels
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{items.length}</div>
            <div className="text-xs text-slate-400">Total Material Types</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {items.reduce((sum, i) => sum + i.qty, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Total Units / Yards in Store</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{lowStockCount}</div>
            <div className="text-xs text-slate-400">Low Stock Alerts (&lt; 20 units)</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name or ID (e.g. Silk, INV001)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading inventory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Inventory Items</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add fabric bolts, threads, and hardware to keep track of your workshop materials.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Item Name</th>
                  <th className="px-5 py-3.5">Stock Level</th>
                  <th className="px-5 py-3.5">Quick Stock Adjust</th>
                  <th className="px-5 py-3.5">Date Added</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(item => {
                  const isLow = item.qty < 20;

                  return (
                    <tr key={item.Inventory_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-400">
                        {item.Inventory_id}
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">
                        {item.item_name}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-base ${
                              isLow ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.qty}
                          </span>
                          {isLow && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStockAdjust(item.Inventory_id, -5)}
                            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-700/60 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                            title="Subtract 5 units"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.Inventory_id, -1)}
                            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                            title="Subtract 1 unit"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.Inventory_id, 1)}
                            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-700/60 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                            title="Add 1 unit"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.Inventory_id, 5)}
                            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-700/60 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {item.Created_at}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit item name or quantity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.Inventory_id, item.item_name)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Remove item from inventory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <InventoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
};
