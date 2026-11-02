import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { EmployeeModal } from './EmployeeModal.jsx';
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Trash2,
  Edit2,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  IdCard,
  TrendingUp,
} from 'lucide-react';

export const EmployeeList = ({ onPaySalary }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees(searchQuery);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveEmployee = async (data) => {
    if (editingEmployee) {
      await api.updateEmployee(editingEmployee.Employee_id, data);
    } else {
      await api.createEmployee(data);
    }
    loadEmployees();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove employee ${name}?`)) {
      try {
        await api.deleteEmployee(id);
        loadEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-indigo-400" /> Employees &amp; Tailor Staff
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Watch total piece-rate earnings, last assigned garment tasks, NIC, and payroll
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEmployee(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Employee
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tailors by name, NIC number, or Employee ID (e.g. EMP001)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 shrink-0 font-medium px-2">
          {employees.length} employees on staff
        </div>
      </div>

      {/* Grid of employees */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <UserCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Employees Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Register your tailoring artisans, cutters, and finishers to assign manufacturing tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {employees.map(emp => {
            const primaryPhone = emp.phones && emp.phones.length > 0 ? emp.phones[0] : null;

            return (
              <div
                key={emp.Employee_id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-base">
                        {emp.first_name?.[0]}
                        {emp.last_name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-400 transition-colors">
                          {emp.full_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {emp.Employee_id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <IdCard className="w-3 h-3 text-slate-500" /> {emp.NIC}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingEmployee(emp);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.Employee_id, emp.full_name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Phone and contact */}
                  <div className="mt-4 flex items-center justify-between text-xs bg-slate-950/60 px-3 py-2 rounded-xl text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone:
                    </span>
                    <span className="font-mono font-medium">
                      {primaryPhone ? primaryPhone.number : 'No number'}
                    </span>
                  </div>

                  {/* USE CASE: Watch total earning of employees */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
                      <span className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Total Earned
                      </span>
                      <div className="text-base font-bold text-emerald-300 mt-0.5">
                        LKR {(emp.totalEarnings || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {emp.completedTasksCount || 0} completed tasks
                      </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] uppercase font-semibold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Earnings
                      </span>
                      <div className="text-base font-bold text-amber-300 mt-0.5">
                        LKR {(emp.pendingEarnings || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {emp.activeTasksCount || 0} tasks in progress
                      </div>
                    </div>
                  </div>

                  {/* USE CASE: Watch last assigned task for employee */}
                  <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Last Assigned Task
                    </span>

                    {emp.lastAssignedTask ? (
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-2">
                            <span className="font-mono text-indigo-400">
                              {emp.lastAssignedTask.Task_id}
                            </span>
                            <span>Order: {emp.lastAssignedTask.Order_id}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Target Date: <strong className="text-slate-300">{emp.lastAssignedTask.complete_at}</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 block">
                            LKR {emp.lastAssignedTask.fee?.toLocaleString()}
                          </span>
                          {emp.lastAssignedTask.is_completed === 1 ? (
                            <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Done
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 inline-flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No tasks currently assigned</p>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                {onPaySalary && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Salary Records: LKR {(emp.totalSalariesPaid || 0).toLocaleString()}
                    </span>
                    <button
                      onClick={() => onPaySalary(emp)}
                      className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Pay Salary
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </div>
  );
};
