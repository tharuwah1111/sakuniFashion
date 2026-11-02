import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { X, Briefcase, Check } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);

  const [orderId, setOrderId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [completeAt, setCompleteAt] = useState('');
  const [fee, setFee] = useState(1500);
  const [isCompleted, setIsCompleted] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getEmployees().then(setEmployees).catch(console.error);
      api.getOrders().then(setOrders).catch(console.error);

      if (task) {
        setOrderId(task.Order_id || '');
        setEmployeeId(task.Employee_id || '');
        setCompleteAt(task.complete_at || '');
        setFee(task.fee || 0);
        setIsCompleted(task.is_completed || 0);
      } else {
        setOrderId('');
        setEmployeeId('');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCompleteAt(tomorrow.toISOString().split('T')[0]);
        setFee(2000);
        setIsCompleted(0);
      }
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    setIsSubmitting(true);
    try {
      await onSave({
        Order_id: orderId,
        Employee_id: employeeId,
        complete_at: completeAt,
        fee: Number(fee),
        is_completed: isCompleted,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {task ? `Edit Task: ${task.Task_id}` : 'Create / Assign Task'}
              </h2>
              <p className="text-xs text-slate-400">
                Assign tailor artisan and specify piece-rate fee
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
              Associated Order <span className="text-rose-400">*</span>
            </label>
            <select
              required
              disabled={!!task}
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            >
              <option value="">-- Choose Order --</option>
              {orders.map(o => (
                <option key={o.Order_id} value={o.Order_id}>
                  {o.Order_id} ({o.customer_name}) - Deadline: {o.deadline}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Assigned Tailor / Employee
            </label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Unassigned --</option>
              {employees.map(e => (
                <option key={e.Employee_id} value={e.Employee_id}>
                  {e.full_name} ({e.Employee_id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                required
                value={completeAt}
                onChange={e => setCompleteAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Task Fee (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={fee}
                onChange={e => setFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {task && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Task Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={isCompleted === 0}
                    onChange={() => setIsCompleted(0)}
                    className="accent-indigo-500"
                  />
                  <span>In Progress</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-emerald-400 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={isCompleted === 1}
                    onChange={() => setIsCompleted(1)}
                    className="accent-emerald-500"
                  />
                  <span>Completed</span>
                </label>
              </div>
            </div>
          )}

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
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{task ? 'Update Task' : 'Save Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
