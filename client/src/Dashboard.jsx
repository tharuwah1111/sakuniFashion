import React, { useState, useEffect } from 'react';
import { api } from './api.js';
import {
  Scissors,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Package,
  Layers,
  ArrowRight,
  Phone,
  RefreshCw,
  Sparkles,
  Plus
} from 'lucide-react';

export const Dashboard = ({ onNavigate, onOpenCreateOrder }) => {
  const [performance, setPerformance] = useState(null);
  const [schedules, setSchedules] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [perfData, schedData, ordersData, invData] = await Promise.all([
        api.getPerformance(),
        api.getSchedules(),
        api.getOrders(),
        api.getInventory(),
      ]);

      setPerformance(perfData);
      setSchedules(schedData);
      setRecentOrders((ordersData || []).slice(0, 5));
      setInventoryAlerts((invData || []).filter(item => ((item.qty !== undefined ? item.qty : item.quantity) || 0) < 50));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const metrics = performance?.metrics || {
    totalOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    totalRevenue: 0,
    totalAdvanceCollected: 0,
    totalRemains: 0,
    activeEmployeesCount: 0,
    totalTasks: 0,
    pendingTasks: 0,
  };

  const dueTomorrowOrders = schedules?.dueTomorrow || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sakuni Fashion Manufacturing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Factory Operations & Tailoring Command
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Real-time monitoring of custom tailoring orders, 19-point body measurements, tailor piece-rate tasks, tomorrow's production deadlines, and fabric inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenCreateOrder && onOpenCreateOrder()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 flex items-center gap-2 cursor-pointer transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Customer Order</span>
            </button>
            <button
              onClick={loadDashboardData}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 cursor-pointer transition"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL: Tomorrow's Deadlines Spotlight */}
      {dueTomorrowOrders.length > 0 ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 border-2 border-amber-500/50 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black animate-bounce duration-1000">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-amber-300 tracking-tight">
                    Tomorrow's Delivery Deadlines ({dueTomorrowOrders.length} Orders Due)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  These orders must be finished, pressed, and ready for customer pickup tomorrow.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('shedules')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Manage Schedules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueTomorrowOrders.slice(0, 3).map((order, idx) => (
              <div
                key={order.Order_id || `due-${idx}`}
                className="bg-slate-950/90 border border-amber-500/30 p-3.5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-slate-200 text-sm">{order.Order_id}</span>
                    <span className="text-[11px] font-semibold text-amber-400 font-mono">
                      LKR {(order.total_amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300">{order.customer_name}</div>
                  {order.phones && order.phones.length > 0 && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{order.phones[0].phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Tailor Tasks:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {(order.tasks || []).filter(t => t.is_completed === 1).length} / {(order.tasks || []).length} Done
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Tomorrow's schedule is clean: No pending deliveries scheduled for tomorrow!</span>
          </div>
          <button
            onClick={() => onNavigate('shedules')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
          >
            View upcoming calendar
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Production Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-slate-900/70 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">
            {metrics.inProgressOrders}
          </div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{metrics.completedOrders}</span> delivered total
          </div>
        </div>

        {/* Tailor Tasks Pending */}
        <div
          onClick={() => onNavigate('task')}
          className="bg-slate-900/70 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Tailor Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
            {metrics.pendingTasks}
          </div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            <span>{metrics.totalTasks} total tasks assigned</span>
          </div>
        </div>

        {/* Revenue & Billing */}
        <div
          onClick={() => onNavigate('bills')}
          className="bg-slate-900/70 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Order Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            LKR {metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>Adv: LKR {metrics.totalAdvanceCollected.toLocaleString()}</span>
            <span className="text-rose-400 font-semibold">Due: LKR {metrics.totalRemains.toLocaleString()}</span>
          </div>
        </div>

        {/* Tailor Staff Count */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-slate-900/70 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Factory Tailors
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-100 font-mono">
            {metrics.activeEmployeesCount}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Piece-rate craftsmen active
          </div>
        </div>
      </div>

      {/* Middle Grid: Recent Orders & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Production Orders */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-slate-100 text-base">Recent Production Orders</h3>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No orders registered yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((ord, idx) => (
                      <tr
                        key={ord.Order_id || `recent-${idx}`}
                        onClick={() => onNavigate('orders')}
                        className="hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        <td className="py-3 px-3 font-mono font-medium text-slate-200">
                          {ord.Order_id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200">{ord.customer_name || 'Customer'}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {ord.deadline || 'N/A'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.is_completed === 1
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : ord.is_completed === 2
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.is_completed === 1 ? 'Completed' : ord.is_completed === 2 ? 'Cancelled' : 'In Production'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          LKR {(ord.total_amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Inventory Alert */}
        <div className="space-y-4">
          {/* Quick Nav Cards */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="font-bold text-slate-100 text-sm mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('customers')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition cursor-pointer"
              >
                <Users className="w-4 h-4 text-sky-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">Customer Records</div>
                <div className="text-[10px] text-slate-400">19 Tailoring Sizes</div>
              </button>

              <button
                onClick={() => onNavigate('designs')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition cursor-pointer"
              >
                <Layers className="w-4 h-4 text-purple-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">Designs Catalog</div>
                <div className="text-[10px] text-slate-400">Frocks, Sarees & Fees</div>
              </button>

              <button
                onClick={() => onNavigate('inventory')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition cursor-pointer"
              >
                <Package className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">Raw Materials</div>
                <div className="text-[10px] text-slate-400">Fabrics, Buttons, Silk</div>
              </button>

              <button
                onClick={() => onNavigate('appointment')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-violet-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">Appointments</div>
                <div className="text-[10px] text-slate-400">Client Fittings</div>
              </button>
            </div>
          </div>

          {/* Low Stock Warning */}
          {inventoryAlerts.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low Inventory Stock Warning</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3">
                {inventoryAlerts.length} material items have stock below 50 units.
              </p>
              <div className="space-y-1.5">
                {inventoryAlerts.slice(0, 3).map((it, idx) => (
                  <div key={it.Inventory_id || it.Item_id || `inv-${idx}`} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-slate-200 font-medium">{it.item_name}</span>
                    <span className="text-amber-400 font-mono font-bold">{it.qty !== undefined ? it.qty : (it.quantity || 0)} {it.unit || 'units'}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
              >
                Restock Materials &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
