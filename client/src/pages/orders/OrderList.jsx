import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { CreateOrderModal } from './CreateOrderModal.jsx';
import { OrderDetailModal } from './OrderDetailModal.jsx';
import {
  ShoppingBag,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  DollarSign,
} from 'lucide-react';

export const OrderList = ({
  initialCustomerForOrder,
  onClearInitialCustomer,
  onPrintInvoice,
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter === 'in_progress') params.status = 0;
      if (statusFilter === 'completed') params.status = 1;
      if (statusFilter === 'cancelled') params.status = 2;
      if (statusFilter === 'urgent') params.urgent = true;

      const data = await api.getOrders(params);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (initialCustomerForOrder) {
      setCreateModalOpen(true);
    }
  }, [initialCustomerForOrder]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete order ${id}? This will also delete associated tasks and billing.`)) {
      try {
        await api.deleteOrder(id);
        loadOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenDetail = async (order) => {
    try {
      const detailed = await api.getOrder(order.Order_id);
      setSelectedOrder(detailed);
    } catch {
      setSelectedOrder(order);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.Order_id.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      o.deadline.includes(q)
    );
  });

  const dueTomorrowCount = orders.filter(o => o.isDueTomorrow && o.is_completed === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-rose-500" /> Manufacturing Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track garment production orders, completion deadlines, and tailor workflows
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Order
        </button>
      </div>

      {/* Due Tomorrow High-Priority Alert Banner if any orders need finish tomorrow */}
      {dueTomorrowCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {dueTomorrowCount} Order{dueTomorrowCount > 1 ? 's' : ''} Need To Finish TOMORROW!
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Urgent manufacturing deadlines approaching. Check task completion with assigned tailors.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('urgent')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
          >
            View Urgent
          </button>
        </div>
      )}

      {/* Filter and search controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. ORD001), Customer Name, or Deadline..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            In Production
          </button>
          <button
            onClick={() => setStatusFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'urgent'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-rose-400/80 hover:text-rose-300 bg-slate-950'
            }`}
          >
            <AlertTriangle className="w-3 h-3" /> Due Soon / Tomorrow
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'cancelled'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}".`
              : 'Create a new order to begin scheduling tailor assignments and tracking delivery deadlines.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => {
            const isTomorrow = order.isDueTomorrow && order.is_completed === 0;
            const isToday = order.isDueToday && order.is_completed === 0;
            const isOverdue = order.isOverdue;

            return (
              <div
                key={order.Order_id || `order-${idx}`}
                className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg transition-all ${
                  isTomorrow
                    ? 'border-amber-500/70 ring-1 ring-amber-500/30 bg-amber-950/10'
                    : isToday || isOverdue
                    ? 'border-rose-500/70 ring-1 ring-rose-500/30 bg-rose-950/10'
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: order id, customer, items */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-base text-white">
                        {order.Order_id}
                      </span>

                      {/* Status badge */}
                      {order.is_completed === 1 ? (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : order.is_completed === 2 ? (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Production
                        </span>
                      )}

                      {/* Urgent badges */}
                      {isTomorrow && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> DUE TOMORROW
                        </span>
                      )}
                      {isToday && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> DUE TODAY
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1">
                          OVERDUE
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        Customer: <strong className="text-slate-200">{order.customer_name}</strong>
                      </span>
                    </div>

                    {/* Order items preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {order.items.map((item, idx) => (
                          <span
                            key={item.Order_item_id || item.id || `item-${idx}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            <span>{item.qty}x {item.design_name || 'Design'}</span>
                            <span className="text-slate-500">({item.color})</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Middle: Deadline & Billing */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 text-xs text-slate-300 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-6 shrink-0">
                    <div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" /> Deadline:
                      </div>
                      <div className={`font-bold text-sm ${isTomorrow ? 'text-amber-400' : 'text-slate-200'}`}>
                        {order.deadline}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Ordered: {order.create_at}
                      </div>
                    </div>

                    {order.bill && (
                      <div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-400" /> Total Bill:
                        </div>
                        <div className="font-bold text-sm text-white">
                          LKR {order.bill.total?.toLocaleString()}
                        </div>
                        <div className={`text-[10px] ${order.bill.remains > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {order.bill.remains > 0 ? `Due: LKR ${order.bill.remains?.toLocaleString()}` : 'Fully Paid'}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(order.Order_id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          if (onClearInitialCustomer) onClearInitialCustomer();
        }}
        onOrderCreated={loadOrders}
        initialCustomer={initialCustomerForOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onOrderUpdated={loadOrders}
        onPrintInvoice={onPrintInvoice}
      />
    </div>
  );
};
