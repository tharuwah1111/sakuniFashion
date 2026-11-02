import React, { useState } from 'react';
import { api } from '../api.js';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  ShoppingBag,
  DollarSign,
  Briefcase,
  Printer,
} from 'lucide-react';

export const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onOrderUpdated,
  onPrintInvoice,
}) => {
  const [newDeadline, setNewDeadline] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (status) => {
    let confirmMsg = 'Update order status?';
    if (status === 2) {
      confirmMsg = 'Cancel this order? All pending assigned manufacturing tasks will also be cancelled/updated.';
    } else if (status === 1) {
      confirmMsg = 'Mark this order as COMPLETED? Assigned tasks will also be completed.';
    }

    if (window.confirm(confirmMsg)) {
      try {
        setIsUpdating(true);
        await api.updateOrderStatus(order.Order_id, status);
        onOrderUpdated();
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleUpdateDeadline = async () => {
    if (!newDeadline) return;
    try {
      setIsUpdating(true);
      await api.updateOrder(order.Order_id, { deadline: newDeadline });
      onOrderUpdated();
      setNewDeadline('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Order: {order.Order_id}</h2>
                {order.is_completed === 1 ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : order.is_completed === 2 ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    Cancelled
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> In Production
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Created: {order.create_at} &bull; Time: {order.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onPrintInvoice && (
              <button
                onClick={() => onPrintInvoice(order)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Invoice
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Deadline Alert Banner */}
          {order.isDueTomorrow && order.is_completed === 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>CRITICAL NOTICE:</strong> This order is scheduled to finish <strong>TOMORROW</strong> ({order.deadline}). Please ensure tailors complete all associated sewing tasks!
              </span>
            </div>
          )}

          {/* Customer & Deadline row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-rose-400" /> Customer Information
              </span>
              <div className="text-base font-bold text-white">
                {order.customer_name || 'Customer'}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {order.Customer_id}
              </div>
              {order.customer?.phones && order.customer.phones.length > 0 && (
                <div className="mt-2 text-xs text-slate-300">
                  Phone: <span className="font-mono">{order.customer.phones[0].number}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Production Deadline
                </span>
                <div className="text-lg font-bold text-amber-400">
                  {order.deadline}
                </div>
              </div>

              {/* Deadline adjuster */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleUpdateDeadline}
                  disabled={!newDeadline || isUpdating}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg disabled:opacity-40 cursor-pointer"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>

          {/* Garments Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-rose-400" /> Garment Order Items
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Design / Style</th>
                    <th className="px-4 py-2.5">Colorway</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {order.items?.map(item => (
                    <tr key={item.Order_item_id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">
                          {item.design_name || 'Custom Garment'}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-400 italic">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">{item.color}</td>
                      <td className="px-4 py-3 text-center font-mono">{item.qty}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        LKR {item.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-white">
                        LKR {(item.qty * item.price)?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tasks associated with this order */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Tailor Production Tasks
            </h3>
            <div className="space-y-2">
              {order.tasks && order.tasks.length > 0 ? (
                order.tasks.map(t => (
                  <div
                    key={t.Task_id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className="font-mono text-indigo-400">{t.Task_id}</span>
                        <span>Tailor: {t.employee_name || 'Unassigned'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Target Date: {t.complete_at}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">
                        Fee: LKR {t.fee?.toLocaleString()}
                      </span>
                      {t.is_completed === 1 ? (
                        <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No tasks created for this order.</p>
              )}
            </div>
          </div>

          {/* Bill summary */}
          {order.bill && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Order Invoice #{order.bill.Bill_id}</span>
                <div className="text-base font-bold text-white mt-0.5">
                  Total: LKR {order.bill.total?.toLocaleString()}
                </div>
              </div>
              <div className="text-right text-xs">
                <div>Paid Advance: <span className="text-emerald-400 font-bold">LKR {order.bill.advance_payment?.toLocaleString()}</span></div>
                <div>Balance Due: <span className={order.bill.remains > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>LKR {order.bill.remains?.toLocaleString()}</span></div>
              </div>
            </div>
          )}

          {/* Status action buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {order.is_completed !== 2 && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(2)}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel Order (Sync Tasks)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {order.is_completed !== 1 && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(1)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Order
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
