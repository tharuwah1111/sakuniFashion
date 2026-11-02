import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import {
  Calendar,
  AlertTriangle,
  Clock,
  Phone,
  User,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Scissors,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { OrderDetailModal } from '../orders/OrderDetailModal.jsx';

export const ScheduleView = () => {
  const [scheduleData, setScheduleData] = useState(null);
  const [activeTab, setActiveTab] = useState('tomorrow'); // 'tomorrow', 'today', 'overdue', 'this_week', 'all'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSchedules();
      setScheduleData(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleMarkComplete = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 1);
      loadSchedules();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const tomorrowDateStr = new Date(Date.now() + 86400000).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const summary = scheduleData?.summary || {
    dueTomorrowCount: 0,
    dueTodayCount: 0,
    overdueCount: 0,
    thisWeekCount: 0,
    totalUpcoming: 0,
  };

  const getOrdersForTab = () => {
    if (!scheduleData) return [];
    switch (activeTab) {
      case 'tomorrow':
        return scheduleData.dueTomorrow || [];
      case 'today':
        return scheduleData.dueToday || [];
      case 'overdue':
        return scheduleData.overdue || [];
      case 'this_week':
        return scheduleData.upcomingThisWeek || [];
      case 'all':
      default:
        return scheduleData.allScheduled || [];
    }
  };

  const displayedOrders = getOrdersForTab();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 p-6 rounded-2xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Clock className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sakuni Factory Dispatch Control
            </div>
            <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-amber-400" />
              Delivery Schedules & Production Deadlines
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Strict delivery deadline tracking. Prioritize tailors on <strong className="text-amber-300">Tomorrow's Deliveries ({tomorrowDateStr})</strong> to avoid order handover delays.
            </p>
          </div>
          <button
            onClick={loadSchedules}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-2 text-sm font-medium transition cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Deadlines</span>
          </button>
        </div>
      </div>

      {/* Tomorrow Special Highlight Alert */}
      {summary.dueTomorrowCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 border-2 border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse duration-1000">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-amber-300 text-base">
                Tomorrow's Delivery Deadline Alert! ({summary.dueTomorrowCount} Orders Due)
              </div>
              <p className="text-xs text-slate-300">
                Scheduled for delivery tomorrow, <strong>{tomorrowDateStr}</strong>. Verify all stitching tasks are completed.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tomorrow')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Tomorrow's Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Urgency Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('tomorrow')}
          className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
            activeTab === 'tomorrow'
              ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Due Tomorrow</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
              summary.dueTomorrowCount > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {summary.dueTomorrowCount}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Tomorrow</div>
        </button>

        <button
          onClick={() => setActiveTab('today')}
          className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
            activeTab === 'today'
              ? 'bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Due Today</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
              summary.dueTodayCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {summary.dueTodayCount}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Today</div>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
            activeTab === 'overdue'
              ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Overdue</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
              summary.overdueCount > 0 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {summary.overdueCount}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Delayed</div>
        </button>

        <button
          onClick={() => setActiveTab('this_week')}
          className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
            activeTab === 'this_week'
              ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">This Week</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-800 text-slate-400">
              {summary.thisWeekCount}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Next 7 Days</div>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">All Active</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-800 text-slate-400">
              {summary.totalUpcoming}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Full Queue</div>
        </button>
      </div>

      {/* Orders List for selected tab */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
            Loading production schedule...
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <div className="text-base font-semibold text-slate-200">No orders in this schedule category!</div>
            <p className="text-xs text-slate-500 mt-1">All production items in this timeframe have been delivered or completed.</p>
          </div>
        ) : (
          displayedOrders.map((order, idx) => {
            const completedTasks = (order.tasks || []).filter(t => t.is_completed === 1).length;
            const totalTasks = (order.tasks || []).length;
            const isAllTasksDone = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div
                key={order.Order_id || `sched-${idx}`}
                className={`p-5 rounded-2xl border transition bg-slate-900/70 ${
                  order.urgency === 'tomorrow'
                    ? 'border-amber-500/50 hover:border-amber-500'
                    : order.urgency === 'today'
                    ? 'border-rose-500/50 hover:border-rose-500'
                    : order.urgency === 'overdue'
                    ? 'border-red-500/50 hover:border-red-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Order Info & Customer */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-100">
                        {order.Order_id}
                      </span>
                      {order.urgency === 'tomorrow' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Due Tomorrow
                        </span>
                      )}
                      {order.urgency === 'today' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Due Today
                        </span>
                      )}
                      {order.urgency === 'overdue' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {order.urgent === 1 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          URGENT ORDER
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium text-slate-100">
                        <User className="w-4 h-4 text-indigo-400" />
                        <span>{order.customer_name}</span>
                      </div>
                      {order.phones && order.phones.length > 0 && (
                        <a
                          href={`tel:${order.phones[0].phone}`}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono">{order.phones[0].phone}</span>
                        </a>
                      )}
                    </div>

                    {/* Garment Items list */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(order.items || []).map((it, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                        >
                          <Scissors className="w-3 h-3 text-slate-500" />
                          <span>{it.design_name || 'Design'}</span>
                          <span className="text-slate-500 font-mono">x{it.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Tailor Task Completion Progress */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 min-w-[220px]">
                    <div className="text-xs text-slate-400 flex items-center justify-between mb-1.5 font-semibold">
                      <span>Tailor Task Progress</span>
                      <span className={`font-mono font-bold ${isAllTasksDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {completedTasks} / {totalTasks} Completed
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isAllTasksDone ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 truncate">
                      Assigned:{' '}
                      {order.tasks && order.tasks.length > 0
                        ? order.tasks.map(t => t.employee_name).join(', ')
                        : 'No tailor assigned yet'}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => setSelectedOrderId(order.Order_id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => handleMarkComplete(order.Order_id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusUpdated={() => loadSchedules()}
        />
      )}
    </div>
  );
};
