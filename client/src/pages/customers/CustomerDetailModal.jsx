import React from 'react';
import { X, Phone, Calendar, ShoppingBag, Ruler, CheckCircle2, Clock, Printer } from 'lucide-react';

export const CustomerDetailModal = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onCreateOrder,
}) => {
  if (!isOpen || !customer) return null;

  const size = customer.size;
  const orders = customer.orders || [];

  const handlePrintSizeSheet = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-lg shadow-inner">
              {customer.first_name?.[0]}
              {customer.last_name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{customer.full_name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-rose-400 font-mono">
                  {customer.Customer_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Registered {customer.Created_at?.split(' ')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSizeSheet}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Print Customer Measurement Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(customer)}
              className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 rounded-lg transition-colors cursor-pointer"
            >
              Edit Details
            </button>
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
          {/* Quick info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Contact details */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" /> Phone Numbers
              </h3>
              {customer.phones && customer.phones.length > 0 ? (
                <div className="space-y-1.5">
                  {customer.phones.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-200 font-mono font-medium">{p.number}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {p.state}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No phone numbers recorded</p>
              )}
            </div>

            {/* Orders summary */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Manufacturing Orders
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{orders.length}</span>
                <span className="text-xs text-slate-400">total lifetime orders</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex gap-3">
                <span className="text-emerald-400">
                  {orders.filter(o => o.is_completed === 1).length} completed
                </span>
                <span className="text-amber-400">
                  {orders.filter(o => o.is_completed === 0).length} in progress
                </span>
              </div>
            </div>

            {/* Quick action card */}
            <div className="bg-gradient-to-br from-rose-950/30 to-amber-950/20 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-rose-200">New Order for Customer</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Create a custom tailor order using this customer's saved measurements.
                </p>
              </div>
              {onCreateOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onCreateOrder(customer);
                  }}
                  className="mt-3 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Create Custom Order
                </button>
              )}
            </div>
          </div>

          {/* Size sheet */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-rose-400" /> Customer Body Measurements (Inches)
              </h3>
              <span className="text-[11px] text-slate-400">Master Tailoring Pattern Specs</span>
            </div>

            {size ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Bust / Chest</div>
                  <div className="text-base font-bold text-rose-400">{size.B_irst || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Under Bust</div>
                  <div className="text-base font-bold text-slate-200">{size.Under_bra || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Waist</div>
                  <div className="text-base font-bold text-amber-400">{size.Waist || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Shoulder Across</div>
                  <div className="text-base font-bold text-slate-200">{size.Shoulder || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Arm Length</div>
                  <div className="text-base font-bold text-slate-200">{size.Arm_Length || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Arm Hole</div>
                  <div className="text-base font-bold text-slate-200">{size.Arm_hole || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Bicep / Arm</div>
                  <div className="text-base font-bold text-slate-200">{size.Arm || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Wrist / Arm End</div>
                  <div className="text-base font-bold text-slate-200">{size.Arm_end || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Bust Apex Point</div>
                  <div className="text-base font-bold text-slate-200">{size.Point || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Sh. to Point</div>
                  <div className="text-base font-bold text-slate-200">{size.Sho_to_point || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Sh. to Under Bra</div>
                  <div className="text-base font-bold text-slate-200">{size.Sh_to_under_bra || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Sh. to Waist</div>
                  <div className="text-base font-bold text-slate-200">{size.sh_to_waist || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Front First Width</div>
                  <div className="text-base font-bold text-slate-200">{size.F_first || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Neck Width</div>
                  <div className="text-base font-bold text-slate-200">{size.Neck_width || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Neck Depth</div>
                  <div className="text-base font-bold text-slate-200">{size.Neck_length || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Back Neck Width</div>
                  <div className="text-base font-bold text-slate-200">{size.B_neck_width || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Back Neck Depth</div>
                  <div className="text-base font-bold text-slate-200">{size.Back_neck_length || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Back Height</div>
                  <div className="text-base font-bold text-slate-200">{size.Back_height || '-'}"</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                  <div className="text-[10px] text-slate-400">Side Seam (Slim)</div>
                  <div className="text-base font-bold text-slate-200">{size.Side_slim || '-'}"</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No measurement card recorded yet.</p>
            )}
          </div>

          {/* Order history */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" /> Order History ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No orders placed yet for this customer.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(ord => (
                  <div
                    key={ord.Order_id}
                    className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-200">{ord.Order_id}</span>
                        {ord.is_completed === 1 ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : ord.is_completed === 2 ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Cancelled
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> In Production
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          Deadline: <strong className="text-slate-300">{ord.deadline}</strong>
                        </span>
                      </div>

                      {ord.items && ord.items.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                          {ord.items.map(item => (
                            <div key={item.Order_item_id} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              <span className="text-slate-300">
                                {item.qty}x {item.design_name || 'Design'} ({item.color})
                              </span>
                              {item.notes && <span className="text-slate-500 italic">- {item.notes}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {ord.bill && (
                      <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                        <div className="text-xs text-slate-400">Bill Total</div>
                        <div className="text-sm font-bold text-slate-100">
                          LKR {ord.bill.total.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Paid: LKR {ord.bill.advance_payment.toLocaleString()} |{' '}
                          <span className={ord.bill.remains > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                            Due: LKR {ord.bill.remains.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
