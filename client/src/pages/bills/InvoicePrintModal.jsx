import React from 'react';
import { X, Printer, Scissors } from 'lucide-react';

export const InvoicePrintModal = ({
  isOpen,
  onClose,
  bill,
  order,
}) => {
  if (!isOpen || (!bill && !order)) return null;

  const currentBill = bill || order?.bill;
  const currentOrder = order || bill?.order;
  const customer = currentOrder?.customer || bill?.customer;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Bar (Hidden during window.print) */}
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Invoice Preview &bull; #{currentBill?.Bill_id || 'INV'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice / Receipt
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 bg-white print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl">
                <Scissors className="w-6 h-6 rotate-90" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black tracking-tight text-slate-900">
                  SAKUNI FASHION
                </h1>
                <p className="text-xs text-slate-600 tracking-wide uppercase font-semibold">
                  Bespoke Cloth Manufacturing &amp; Tailoring
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Main Workshop &amp; Studio &bull; Tel: +94 11 234 5678 / +94 77 123 4567
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Official Invoice
              </span>
              <div className="text-xl font-mono font-black text-rose-600 mt-0.5">
                {currentBill?.Bill_id}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Date: {currentBill?.created_at?.split(' ')[0] || new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Customer & Order Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To</div>
              <div className="font-bold text-base text-slate-900">{customer?.full_name || 'Valued Customer'}</div>
              <div className="text-slate-600 font-mono mt-0.5">Customer ID: {customer?.Customer_id || currentOrder?.Customer_id}</div>
              {customer?.phones && customer.phones.length > 0 && (
                <div className="text-slate-600 mt-1">Phone: {customer.phones[0].number}</div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold uppercase tracking-wider text-slate-400 mb-1">Order Details</div>
              <div className="font-bold text-sm text-slate-900">Order ID: {currentOrder?.Order_id || currentBill?.Order_id}</div>
              <div className="text-slate-600 mt-1">
                Deadline: <strong className="text-slate-900">{currentOrder?.deadline || '-'}</strong>
              </div>
              <div className="text-slate-600 mt-0.5">
                Status: {currentOrder?.is_completed === 1 ? 'Completed' : 'In Production'}
              </div>
            </div>
          </div>

          {/* Garments Breakdown */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-600 uppercase font-bold tracking-wider">
                  <th className="py-2.5">Item &amp; Description</th>
                  <th className="py-2.5">Colorway</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price (LKR)</th>
                  <th className="py-2.5 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentOrder?.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-900">
                      <div>{item.design_name || 'Garment Design'}</div>
                      {item.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">{item.notes}</div>}
                    </td>
                    <td className="py-3 text-slate-700">{item.color}</td>
                    <td className="py-3 text-center font-mono font-semibold">{item.qty}</td>
                    <td className="py-3 text-right font-mono">{item.price?.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      {(item.qty * item.price)?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Advance Payments */}
          <div className="flex justify-end pt-4 border-t-2 border-slate-900">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal / Grand Total:</span>
                <span className="font-mono font-bold text-slate-900">
                  LKR {currentBill?.total?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Advance Paid:</span>
                <span className="font-mono font-semibold text-emerald-600">
                  - LKR {currentBill?.advance_payment?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-300 text-slate-900">
                <span>Remaining Due:</span>
                <span className={`font-mono ${currentBill && currentBill.remains > 0 ? 'text-rose-600 font-black' : 'text-emerald-600'}`}>
                  LKR {currentBill?.remains?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700 mb-1">Terms &amp; Notes</p>
              <p>Custom tailored garments once fitted and finalized cannot be refunded. Remaining balance must be cleared upon final collection.</p>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="border-b border-slate-400 w-44 ml-auto mb-1"></div>
              <p className="font-semibold text-slate-700">Authorized Signature &amp; Stamp</p>
              <p>Sakuni Fashion Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
