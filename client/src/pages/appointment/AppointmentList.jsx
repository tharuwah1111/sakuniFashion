import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { Calendar, Plus, CheckCircle, Clock, Phone, Trash2, Edit, User, Search, RefreshCw } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal.jsx';

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterApproved, setFilterApproved] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAppointments(filterApproved !== '' ? filterApproved : undefined);
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filterApproved]);

  const handleToggleApprove = async (id, currentApproved) => {
    try {
      const newStatus = currentApproved === 1 ? 0 : 1;
      await api.approveAppointment(id, newStatus);
      loadAppointments();
    } catch (err) {
      alert(err.message || 'Failed to update appointment approval');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to cancel and delete the appointment for ${name}?`)) {
      return;
    }
    try {
      await api.deleteAppointment(id);
      loadAppointments();
    } catch (err) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  const filtered = appointments.filter((apt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.name?.toLowerCase().includes(q) ||
      apt.number?.includes(q) ||
      apt.Appointment_id?.toLowerCase().includes(q)
    );
  });

  const pendingCount = appointments.filter((a) => a.Approved === 0).length;
  const approvedCount = appointments.filter((a) => a.Approved === 1).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-400" />
            Client Consultations & Fitting Appointments
          </h1>
          <p className="text-sm text-slate-400">
            Schedule fitting sessions, custom measurement trials, and bridal consultations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAppointments()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-violet-950/30 flex items-center gap-2 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Appointments</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">{appointments.length}</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Confirmation</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Confirmed & Approved</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterApproved('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition border ${
              filterApproved === ''
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterApproved('0')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition border ${
              filterApproved === '0'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterApproved('1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition border ${
              filterApproved === '1'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* Appointment Cards / Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">APT ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Scheduled Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading appointments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => {
                  const dateObj = new Date(apt.Appoint_date);
                  const isUpcoming = dateObj.getTime() > Date.now();
                  return (
                    <tr key={apt.Appointment_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                        {apt.Appointment_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          {apt.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`tel:${apt.number}`}
                          className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono text-xs">{apt.number}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          <span>{dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-xs text-slate-400 font-mono ml-1">
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleApprove(apt.Appointment_id, apt.Approved)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                            apt.Approved === 1
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                          title="Click to toggle status"
                        >
                          {apt.Approved === 1 ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingAppointment(apt);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition cursor-pointer"
                            title="Edit Appointment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.Appointment_id, apt.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => loadAppointments()}
        appointment={editingAppointment}
      />
    </div>
  );
};
