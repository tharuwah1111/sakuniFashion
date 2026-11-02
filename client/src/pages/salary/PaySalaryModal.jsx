import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { X, DollarSign, Check, Calendar, UserCheck } from 'lucide-react';

export const PaySalaryModal = ({
  isOpen,
  onClose,
  onSalaryPaid,
  employee,
}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [salaryAmount, setSalaryAmount] = useState(40000);
  const [payDate, setPayDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getEmployees().then(setEmployees).catch(console.error);
      const today = new Date().toISOString().split('T')[0];
      setPayDate(today);

      if (employee) {
        setSelectedEmpId(employee.Employee_id);
      } else {
        setSelectedEmpId('');
      }
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmpId || salaryAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await api.paySalary({
        Employee_id: selectedEmpId,
        salary: Number(salaryAmount),
        date: payDate,
      });
      onSalaryPaid();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to record salary payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEmp = employees.find(e => e.Employee_id === selectedEmpId);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Disburse Tailor Salary</h2>
              <p className="text-xs text-slate-400">Record wage / payroll payment in database</p>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Select Employee <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Choose Employee / Tailor --</option>
              {employees.map(e => (
                <option key={e.Employee_id} value={e.Employee_id}>
                  {e.full_name} ({e.Employee_id}) - NIC: {e.NIC}
                </option>
              ))}
            </select>
          </div>

          {selectedEmp && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div>Completed Tasks Earnings: <strong className="text-emerald-400 font-mono">LKR {(selectedEmp.totalEarnings || 0).toLocaleString()}</strong></div>
              <div>Pending Tasks: <strong className="text-amber-400 font-mono">LKR {(selectedEmp.pendingEarnings || 0).toLocaleString()}</strong></div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Payment Date
            </label>
            <input
              type="date"
              required
              value={payDate}
              onChange={e => setPayDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Salary / Advance Amount (LKR)
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              required
              value={salaryAmount}
              onChange={e => setSalaryAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
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
              disabled={isSubmitting || !selectedEmpId}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Record Salary Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
