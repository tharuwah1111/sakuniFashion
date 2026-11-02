import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { X, ShoppingBag, Plus, Trash2, Check, Calendar, DollarSign, UserCheck } from 'lucide-react';

export const CreateOrderModal = ({
  isOpen,
  onClose,
  onOrderCreated,
  initialCustomer,
}) => {
  const [customers, setCustomers] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [advancePayment, setAdvancePayment] = useState(0);

  const [items, setItems] = useState([
    { Design_id: '', color: '', qty: 1, price: 0, notes: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow.toISOString().split('T')[0]);

      api.getCustomers().then(setCustomers).catch(console.error);
      api.getDesigns().then(d => {
        setDesigns(d);
        if (d.length > 0) {
          setItems([
            {
              Design_id: d[0].Design_id,
              color: d[0].colors?.[0] || 'Standard',
              qty: 1,
              price: d[0].price,
              notes: '',
            },
          ]);
        }
      }).catch(console.error);
      api.getEmployees().then(setEmployees).catch(console.error);

      if (initialCustomer) {
        setSelectedCustomerId(initialCustomer.Customer_id);
      } else {
        setSelectedCustomerId('');
      }
    }
  }, [isOpen, initialCustomer]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const defaultDesign = designs[0];
    setItems([
      ...items,
      {
        Design_id: defaultDesign?.Design_id || '',
        color: defaultDesign?.colors?.[0] || 'Standard',
        qty: 1,
        price: defaultDesign?.price || 0,
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDesignChange = (index, designId) => {
    const design = designs.find(d => d.Design_id === designId);
    const updated = [...items];
    updated[index].Design_id = designId;
    updated[index].price = design?.price || 0;
    updated[index].color = design?.colors?.[0] || 'Standard';
    setItems(updated);
  };

  const handleItemFieldChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const remainingBalance = Math.max(0, totalAmount - advancePayment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !deadline || items.length === 0) return;

    setIsSubmitting(true);
    try {
      await api.createOrder({
        Customer_id: selectedCustomerId,
        deadline,
        items,
        advance_payment: advancePayment,
        assigned_employee_id: assignedEmployeeId || undefined,
      });
      onOrderCreated();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Create Manufacturing Order</h2>
              <p className="text-xs text-slate-400">
                Configure garments, custom tailoring specifications, and auto-generated tasks
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer and Deadline row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Customer <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map(c => (
                  <option key={c.Customer_id} value={c.Customer_id}>
                    {c.full_name} ({c.Customer_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" /> Order Finish Deadline <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Initial Tailor Assignment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Assign Primary Tailor (Optional)
            </label>
            <select
              value={assignedEmployeeId}
              onChange={e => setAssignedEmployeeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Unassigned (Assign Later in Tasks) --</option>
              {employees.map(e => (
                <option key={e.Employee_id} value={e.Employee_id}>
                  {e.full_name} ({e.Employee_id})
                </option>
              ))}
            </select>
          </div>

          {/* Order Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Order Garment Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Garment
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const design = designs.find(d => d.Design_id === item.Design_id);
                const colors = design?.colors || ['Standard'];

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      {/* Design selector */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Garment Design</label>
                        <select
                          value={item.Design_id}
                          onChange={e => handleDesignChange(index, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                        >
                          {designs.map(d => (
                            <option key={d.Design_id} value={d.Design_id}>
                              {d.Design_name} - LKR {d.price.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Color */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Colorway</label>
                        <select
                          value={item.color}
                          onChange={e => handleItemFieldChange(index, 'color', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                        >
                          {colors.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Qty & Price */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => handleItemFieldChange(index, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Unit LKR</label>
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={e => handleItemFieldChange(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 text-right"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes & Subtotal */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      <input
                        type="text"
                        placeholder="Custom notes (e.g. puff sleeve, boat neck, lace trim)..."
                        value={item.notes}
                        onChange={e => handleItemFieldChange(index, 'notes', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />

                      <div className="text-right px-2 shrink-0">
                        <span className="text-[11px] text-slate-400 mr-1.5">Subtotal:</span>
                        <span className="font-mono font-bold text-xs text-white">
                          LKR {(item.qty * item.price).toLocaleString()}
                        </span>
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing & Advance payment card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Billing Breakdown &amp; Advance Payment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Total Order Amount</span>
                <div className="text-lg font-bold text-white mt-0.5">
                  LKR {totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] text-slate-400 mb-1">
                  Advance Payment (LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="500"
                  value={advancePayment}
                  onChange={e => setAdvancePayment(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-sm font-bold text-emerald-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Remaining Balance Due</span>
                <div className={`text-lg font-bold mt-0.5 ${remainingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  LKR {remainingBalance.toLocaleString()}
                </div>
              </div>
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
              <span>Confirm &amp; Place Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
