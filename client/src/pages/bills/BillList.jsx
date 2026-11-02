import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { BillModal } from './BillModal.jsx';
import { InvoicePrintModal } from './InvoicePrintModal.jsx';
import {
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';

export const BillList = () => {
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentModalBill, setPaymentModalBill] = useState(null);
  const [invoiceModalBill, setInvoiceModalBill] = useState(null);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await api.getBills();
      setBills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleRecordPayment = async (billId, amount) => {
    await api.recordBillPayment(billId, amount);
    loadBills();
  };

  const handleOpenInvoice = async (bill) => {
    try {
      const detailed = await api.getBill(bill.Bill_id);
      setInvoiceModalBill(detailed);
    } catch {
      setInvoiceModalBill(bill);
    }
  };

  const filtered = bills.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.Bill_id.toLowerCase().includes(q) ||
      b.Order_id.toLowerCase().includes(q) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q))
    );
  });

  const totalRevenue = bills.reduce((sum, b) => sum + (b.total || 0), 0);
  const totalAdvances = bills.reduce((sum, b) => sum + (b.advance_payment || 0), 0);
  const totalRemains = bills.reduce((sum, b) => sum + (b.remains || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-emerald-400" /> Billing &amp; Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track garment invoice totals, advance deposits, customer balances, and print receipts
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Billed Orders
          </span>
          <div className="text-2xl font-bold text-white mt-1">
            LKR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">{bills.length} invoices generated</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Collected Payments
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            LKR {totalAdvances.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Advance &amp; balance collections</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Pending Receivable Balances
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            LKR {totalRemains.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Due upon garment pickup</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Bill ID (e.g. BIL001), Order ID, or Customer Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bills Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading billing ledger...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Bills Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Bills are automatically generated when manufacturing orders are placed.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Bill ID</th>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5 text-right">Total Amount</th>
                  <th className="px-5 py-3.5 text-right">Advance Paid</th>
                  <th className="px-5 py-3.5 text-right">Remaining Balance</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(bill => {
                  const isFullyPaid = bill.remains <= 0;

                  return (
                    <tr key={bill.Bill_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-emerald-400">
                        {bill.Bill_id}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-400">
                        {bill.Order_id}
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">
                        {bill.customer_name}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        LKR {bill.total?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-emerald-400 font-semibold">
                        LKR {bill.advance_payment?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold">
                        <span className={bill.remains > 0 ? 'text-amber-400' : 'text-slate-500'}>
                          LKR {bill.remains?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isFullyPaid ? (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Fully Paid
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Balance Due
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isFullyPaid && (
                            <button
                              onClick={() => setPaymentModalBill(bill)}
                              className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="Record payment toward balance"
                            >
                              Add Pay
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenInvoice(bill)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="View / Print Official Invoice Receipt"
                          >
                            <Printer className="w-4 h-4" />
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

      {/* Record Payment Modal */}
      <BillModal
        isOpen={!!paymentModalBill}
        onClose={() => setPaymentModalBill(null)}
        bill={paymentModalBill}
        onPaymentRecorded={handleRecordPayment}
      />

      {/* Invoice Print Modal */}
      <InvoicePrintModal
        isOpen={!!invoiceModalBill}
        onClose={() => setInvoiceModalBill(null)}
        bill={invoiceModalBill}
      />
    </div>
  );
};
