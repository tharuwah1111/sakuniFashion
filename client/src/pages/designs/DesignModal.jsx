import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check, Palette } from 'lucide-react';

export const DesignModal = ({ isOpen, onClose, onSave, design }) => {
  const [designName, setDesignName] = useState('');
  const [category, setCategory] = useState('Bridal Wear');
  const [price, setPrice] = useState(0);
  const [feeForTask, setFeeForTask] = useState(0);
  const [colors, setColors] = useState(['Gold', 'Maroon']);
  const [newColorInput, setNewColorInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (design) {
      setDesignName(design.Design_name || '');
      setCategory(design.catogory || 'General');
      setPrice(design.price || 0);
      setFeeForTask(design.fee_for_task || 0);
      setColors(design.colors || []);
    } else {
      setDesignName('');
      setCategory('Bridal Wear');
      setPrice(5000);
      setFeeForTask(1500);
      setColors(['Classic Ivory', 'Gold', 'Royal Red']);
    }
  }, [design, isOpen]);

  if (!isOpen) return null;

  const handleAddColor = () => {
    const trimmed = newColorInput.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setColors([...colors, trimmed]);
      setNewColorInput('');
    }
  };

  const handleRemoveColor = (col) => {
    setColors(colors.filter(c => c !== col));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!designName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        Design_name: designName,
        catogory: category,
        price,
        fee_for_task: feeForTask,
        colors,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CATEGORIES = [
    'Bridal Wear',
    'Party Wear',
    'Casual Wear',
    'Formal Wear',
    'Ethnic Wear',
    'Saree Blouse',
    'Children Wear',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {design ? `Edit Design: ${design.Design_name}` : 'Create Apparel Design'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure garment category, customer pricing, and tailor task fee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Design Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={designName}
              onChange={e => setDesignName(e.target.value)}
              placeholder="e.g. Silk Saree Blouse with Beads"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Selling Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Fee For Tailor Task (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={feeForTask}
                onChange={e => setFeeForTask(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Color variation chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" /> Available Color Variations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add color (e.g. Midnight Blue, Wine Red)..."
                value={newColorInput}
                onChange={e => setNewColorInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              {colors.map(col => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-xs text-slate-200 border border-slate-700/60"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {col}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(col)}
                    className="text-slate-400 hover:text-rose-400 ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {colors.length === 0 && (
                <span className="text-xs text-slate-500 italic p-1">No colors added yet</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-medium shadow-md shadow-rose-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{design ? 'Update Design' : 'Save Design'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
