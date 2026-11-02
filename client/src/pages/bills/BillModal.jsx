import React, { useState } from 'react';
import { X, DollarSign, Check } from 'lucide-react';

export const BillModal = ({
  isOpen,
  onClose,
  bill,
  onPaymentRecorded,
}) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await onPaymentRecorded(bill.Bill_id, paymentAmount);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Record Payment</h2>
              <p className="text-xs text-slate-400">Bill ID: {bill.Bill_id} &bull; Order: {bill.Order_id}</p>
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
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Customer:</span>
              <span className="font-semibold text-slate-200">{bill.customer_name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Bill:</span>
              <span className="font-mono font-bold text-white">LKR {bill.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Advance Paid So Far:</span>
              <span className="font-mono text-emerald-400 font-semibold">LKR {bill.advance_payment?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2 text-sm font-bold">
              <span>Current Balance Remaining:</span>
              <span className="font-mono text-amber-400">LKR {bill.remains?.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Payment Amount Received (LKR)
            </label>
            <input
              type="number"
              min="1"
              max={bill.remains}
              step="100"
              required
              value={paymentAmount || ''}
              onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
              placeholder={`Up to LKR ${bill.remains?.toLocaleString()}`}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setPaymentAmount(bill.remains)}
              className="text-xs text-emerald-400 hover:text-emerald-300 mt-1.5 underline underline-offset-2 cursor-pointer"
            >
              Pay full remaining balance (LKR {bill.remains?.toLocaleString()})
            </button>
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
              disabled={isSubmitting || paymentAmount <= 0}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
