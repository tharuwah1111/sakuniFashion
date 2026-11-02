import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { DesignModal } from './DesignModal.jsx';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Palette,
  Scissors,
} from 'lucide-react';

export const DesignList = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const data = await api.getDesigns();
      setDesigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleSaveDesign = async (data) => {
    if (editingDesign) {
      await api.updateDesign(editingDesign.Design_id, data);
    } else {
      await api.createDesign(data);
    }
    loadDesigns();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete design "${name}"?`)) {
      try {
        await api.deleteDesign(id);
        loadDesigns();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const categories = ['All', ...Array.from(new Set(designs.map(d => d.catogory).filter(Boolean)))];
  const filtered = filterCategory === 'All' ? designs : designs.filter(d => d.catogory === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-amber-400" /> Designs &amp; Garments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manufacturing catalogue, garment pricing, tailor piece-rate fees, and color options
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDesign(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Design
        </button>
      </div>

      {/* Categories Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat} {cat === 'All' ? `(${designs.length})` : `(${designs.filter(d => d.catogory === cat).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading garment designs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Designs Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add your clothing line designs with custom task fee rates and colorways.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(design => (
            <div
              key={design.Design_id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {design.catogory || 'General'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{design.Design_id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-2.5 group-hover:text-amber-400 transition-colors">
                  {design.Design_name}
                </h3>

                {/* Price and fee badge */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-rose-400" /> Selling Price
                    </span>
                    <div className="text-base font-bold text-white mt-0.5">
                      LKR {design.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-emerald-400" /> Tailor Task Fee
                    </span>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      LKR {design.fee_for_task.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="mt-3.5">
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-amber-400" /> Colors:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {design.colors && design.colors.length > 0 ? (
                      design.colors.map((col, cIdx) => (
                        <span
                          key={`${col}-${cIdx}`}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {col}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">No colors specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingDesign(design);
                    setModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit design"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(design.Design_id, design.Design_name)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete design"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DesignModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDesign(null);
        }}
        onSave={handleSaveDesign}
        design={editingDesign}
      />
    </div>
  );
};
