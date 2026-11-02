import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './pages/user/AuthContext.jsx';
import { Login } from './pages/user/Login.jsx';
import { Dashboard } from './pages/dashboard/Dashboard.jsx';
import { CustomerList } from './pages/customers/CustomerList.jsx';
import { DesignList } from './pages/designs/DesignList.jsx';
import { InventoryList } from './pages/inventory/InventoryList.jsx';
import { EmployeeList } from './pages/employees/EmployeeList.jsx';
import { OrderList } from './pages/orders/OrderList.jsx';
import { CreateOrderModal } from './pages/orders/CreateOrderModal.jsx';
import { TaskList } from './pages/task/TaskList.jsx';
import { BillList } from './pages/bills/BillList.jsx';
import { SalaryList } from './pages/salary/SalaryList.jsx';
import { AppointmentList } from './pages/appointment/AppointmentList.jsx';
import { ScheduleView } from './pages/shedules/ScheduleView.jsx';
import { api } from './api.js';
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  CheckSquare,
  Users,
  Palette,
  Package,
  Receipt,
  DollarSign,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

function MainApp() {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tomorrowCount, setTomorrowCount] = useState(0);

  // Check tomorrow's order count for notification badge
  const checkTomorrowDeadlines = async () => {
    try {
      const data = await api.getTomorrowOrders();
      setTomorrowCount(data.count || 0);
    } catch {
    }
  };

  useEffect(() => {
    if (user) {
      checkTomorrowDeadlines();
      const interval = setInterval(checkTomorrowDeadlines, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'shedules',
      label: 'Schedules',
      icon: Calendar,
      badge: tomorrowCount > 0 ? `${tomorrowCount} Due Tomorrow` : null,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'task', label: 'Tailor Tasks', icon: CheckSquare },
    { id: 'customers', label: 'Customers & Sizes', icon: Users },
    { id: 'employees', label: 'Tailors & Staff', icon: Users },
    { id: 'designs', label: 'Designs & Fees', icon: Palette },
    { id: 'inventory', label: 'Materials Stock', icon: Package },
    { id: 'bills', label: 'Invoices & Billing', icon: Receipt },
    { id: 'salary', label: 'Payroll & Wages', icon: DollarSign },
    { id: 'appointment', label: 'Fitting Appointments', icon: CalendarCheck },
  ];

  const handleResetDb = async () => {
    if (window.confirm('Reset database to clean initial state? All test orders and records will be re-seeded.')) {
      try {
        await api.resetDatabase();
        window.location.reload();
      } catch (err) {
        alert(err.message || 'Failed to reset database');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-base tracking-tight bg-gradient-to-r from-rose-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                  SAKUNI FASHION
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
                  Garment Manufacturing System
                </div>
              </div>
            </div>
          </div>

          {/* Tomorrow Deadline Quick Badge */}
          {tomorrowCount > 0 && (
            <button
              onClick={() => setCurrentTab('shedules')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer text-xs font-semibold animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{tomorrowCount} Orders Due Tomorrow!</span>
            </button>
          )}

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDb}
              title="Reset Sample Database"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-slate-200">{user.full_name || user.username}</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 uppercase font-bold text-[10px]">{user.role}</span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block border-t border-slate-800/80 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${isActive
                      ? 'bg-gradient-to-r from-rose-600/20 to-amber-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-rose-500 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="bg-slate-900 w-72 max-w-[80vw] h-full p-4 flex flex-col justify-between border-r border-slate-800 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm text-slate-100">Sakuni Fashion</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${isActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-rose-500 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{user.full_name}</strong>
              </div>
              <button
                onClick={logout}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
          />
        )}
        {currentTab === 'shedules' && <ScheduleView />}
        {currentTab === 'orders' && <OrderList />}
        {currentTab === 'task' && <TaskList />}
        {currentTab === 'customers' && <CustomerList />}
        {currentTab === 'employees' && <EmployeeList />}
        {currentTab === 'designs' && <DesignList />}
        {currentTab === 'inventory' && <InventoryList />}
        {currentTab === 'bills' && <BillList />}
        {currentTab === 'salary' && <SalaryList />}
        {currentTab === 'appointment' && <AppointmentList />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/30 py-4 text-center text-xs text-slate-500">
        <p>Sakuni Fashion Garment Factory Management System &bull; High Reliability Cloth Manufacturing</p>
      </footer>

      {/* Global Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onOrderCreated={() => {
          checkTomorrowDeadlines();
          if (currentTab !== 'orders') {
            setCurrentTab('orders');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
