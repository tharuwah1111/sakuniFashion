import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { DollarSign, Plus, Calendar, User, Search, RefreshCw } from 'lucide-react';
import { PaySalaryModal } from './PaySalaryModal.jsx';

export const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterEmpId, setFilterEmpId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [salaryData, empData] = await Promise.all([
        api.getSalaries(filterEmpId || undefined),
        api.getEmployees(),
      ]);
      setSalaries(salaryData || []);
      setEmployees(empData || []);
    } catch (err) {
      console.error('Failed to load salary data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterEmpId]);

  const totalDisbursed = salaries.reduce((acc, s) => acc + (Number(s.salary) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Payroll & Tailor Salary Disbursements
          </h1>
          <p className="text-sm text-slate-400">
            Track piece-rate and monthly salary payments to factory tailors and employees.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-emerald-950/30 flex items-center gap-2 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Disburse Salary</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            LKR
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Disbursed</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">
              LKR {totalDisbursed.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Payments Logged</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {salaries.length} Records
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Employees</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {employees.length} Staff
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
        <div className="text-sm text-slate-400 font-medium">Filter by Employee:</div>
        <select
          value={filterEmpId}
          onChange={(e) => setFilterEmpId(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Employees</option>
          {employees.map((e) => (
            <option key={e.Employee_id} value={e.Employee_id}>
              {e.full_name} ({e.Employee_id})
            </option>
          ))}
        </select>
        {filterEmpId && (
          <button
            onClick={() => setFilterEmpId('')}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Salary Records Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Salary ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee / Tailor</th>
                <th className="py-3 px-4">NIC</th>
                <th className="py-3 px-4 text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading salary records...
                  </td>
                </tr>
              ) : salaries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No salary disbursement records found.
                  </td>
                </tr>
              ) : (
                salaries.map((sal) => (
                  <tr key={sal.Salary_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      {sal.Salary_id}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {sal.date ? new Date(sal.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{sal.full_name || 'N/A'}</div>
                      <div className="text-xs text-slate-400 font-mono">ID: {sal.Employee_id}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">
                      {sal.NIC || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      LKR {(Number(sal.salary) || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaySalaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSalaryPaid={() => loadData()}
      />
    </div>
  );
};
