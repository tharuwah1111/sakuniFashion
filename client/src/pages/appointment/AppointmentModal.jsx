import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { X, Calendar, User, Phone, CheckCircle, Clock } from 'lucide-react';

export const AppointmentModal = ({
  isOpen,
  onClose,
  onSaved,
  appointment,
}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [appointDate, setAppointDate] = useState('');
  const [approved, setApproved] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setName(appointment.name || '');
      setNumber(appointment.number || '');
      setAppointDate(appointment.Appoint_date ? appointment.Appoint_date.substring(0, 16) : '');
      setApproved(appointment.Approved || 0);
    } else {
      setName('');
      setNumber('');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      setAppointDate(tomorrow.toISOString().substring(0, 16));
      setApproved(0);
    }
  }, [appointment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !number.trim() || !appointDate) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        number: number.trim(),
        Appoint_date: appointDate,
        Approved: Number(approved),
      };

      if (appointment) {
        await api.updateAppointment(appointment.Appointment_id, payload);
      } else {
        await api.createAppointment(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {appointment ? 'Edit Fitting Appointment' : 'Book New Fitting Appointment'}
              </h2>
              <p className="text-xs text-slate-400">Sakuni Fashion Tailoring Consultations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Client / Customer Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kasun Fernando"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Phone Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0771234567"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date & Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={appointDate}
              onChange={(e) => setAppointDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Status Approval
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApproved(0)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                  approved === 0
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Pending Approval</span>
              </button>
              <button
                type="button"
                onClick={() => setApproved(1)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                  approved === 1
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approved & Confirmed</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium shadow-md shadow-violet-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{appointment ? 'Update Appointment' : 'Book Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
