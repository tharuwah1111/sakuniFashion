import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Ruler, Phone, User, Check } from 'lucide-react';

const SIZE_LABELS = {
  // Torso & Bust
  B_irst: { label: 'Bust / Chest (B_irst)', unit: 'in', category: 'Torso & Bust' },
  Under_bra: { label: 'Under Bust (Under_bra)', unit: 'in', category: 'Torso & Bust' },
  Point: { label: 'Bust Apex Point', unit: 'in', category: 'Torso & Bust' },
  Sho_to_point: { label: 'Shoulder to Point', unit: 'in', category: 'Torso & Bust' },
  Sh_to_under_bra: { label: 'Shoulder to Under Bust', unit: 'in', category: 'Torso & Bust' },
  F_first: { label: 'Front Chest Width (F_first)', unit: 'in', category: 'Torso & Bust' },

  // Waist & Lengths
  Waist: { label: 'Waist Circumference', unit: 'in', category: 'Waist & Length' },
  sh_to_waist: { label: 'Shoulder to Waist Length', unit: 'in', category: 'Waist & Length' },
  Side_slim: { label: 'Side Seam (Side_slim)', unit: 'in', category: 'Waist & Length' },
  Back_height: { label: 'Back Height Length', unit: 'in', category: 'Waist & Length' },

  // Neck & Shoulder
  Shoulder: { label: 'Shoulder Across', unit: 'in', category: 'Neck & Shoulders' },
  Neck_width: { label: 'Front Neck Width', unit: 'in', category: 'Neck & Shoulders' },
  Neck_length: { label: 'Front Neck Depth', unit: 'in', category: 'Neck & Shoulders' },
  B_neck_width: { label: 'Back Neck Width', unit: 'in', category: 'Neck & Shoulders' },
  Back_neck_length: { label: 'Back Neck Depth', unit: 'in', category: 'Neck & Shoulders' },

  // Arms & Sleeves
  Arm_Length: { label: 'Sleeve / Arm Length', unit: 'in', category: 'Arms & Sleeves' },
  Arm_hole: { label: 'Arm Hole Round', unit: 'in', category: 'Arms & Sleeves' },
  Arm: { label: 'Bicep / Arm Round', unit: 'in', category: 'Arms & Sleeves' },
  Arm_end: { label: 'Wrist / Arm End Round', unit: 'in', category: 'Arms & Sleeves' },
};

export const CustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phones, setPhones] = useState([{ number: '', state: 'Mobile' }]);
  const [activeTab, setActiveTab] = useState('profile');
  const [sizeMeasurements, setSizeMeasurements] = useState({
    Arm_Length: 0,
    Point: 0,
    Arm_end: 0,
    B_irst: 0,
    Neck_width: 0,
    Arm_hole: 0,
    Back_height: 0,
    Neck_length: 0,
    Back_neck_length: 0,
    Waist: 0,
    Arm: 0,
    B_neck_width: 0,
    Under_bra: 0,
    Side_slim: 0,
    Sh_to_under_bra: 0,
    Sho_to_point: 0,
    F_first: 0,
    Shoulder: 0,
    sh_to_waist: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name || '');
      setLastName(customer.last_name || '');
      if (customer.phones && customer.phones.length > 0) {
        setPhones(customer.phones.map(p => ({ number: p.number, state: p.state || 'Mobile' })));
      } else {
        setPhones([{ number: '', state: 'Mobile' }]);
      }
      if (customer.size) {
        setSizeMeasurements(customer.size);
      }
    } else {
      setFirstName('');
      setLastName('');
      setPhones([{ number: '', state: 'Mobile' }]);
      setSizeMeasurements({
        Arm_Length: 0,
        Point: 0,
        Arm_end: 0,
        B_irst: 0,
        Neck_width: 0,
        Arm_hole: 0,
        Back_height: 0,
        Neck_length: 0,
        Back_neck_length: 0,
        Waist: 0,
        Arm: 0,
        B_neck_width: 0,
        Under_bra: 0,
        Side_slim: 0,
        Sh_to_under_bra: 0,
        Sho_to_point: 0,
        F_first: 0,
        Shoulder: 0,
        sh_to_waist: 0,
      });
      setActiveTab('profile');
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleAddPhone = () => {
    setPhones([...phones, { number: '', state: 'Mobile' }]);
  };

  const handleRemovePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const handleSizeChange = (key, val) => {
    const num = parseFloat(val);
    setSizeMeasurements(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setIsSubmitting(true);
    try {
      const validPhones = phones.filter(p => p.number.trim().length > 0);
      await onSave({
        first_name: firstName,
        last_name: lastName,
        phones: validPhones,
        size: sizeMeasurements,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Torso & Bust', 'Waist & Length', 'Neck & Shoulders', 'Arms & Sleeves'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {customer ? `Edit Customer: ${customer.full_name}` : 'Add New Customer'}
              </h2>
              <p className="text-xs text-slate-400">
                Manage personal contact info and bespoke tailor size measurements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-800 flex gap-4 bg-slate-900/90 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Basic Details &amp; Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sizes')}
            className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'sizes'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ruler className="w-4 h-4" /> Tailor Body Measurements (19 pts)
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'profile' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Dilini"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Wickramasinghe"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Phone numbers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-400" /> Phone Numbers
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Number
                  </button>
                </div>

                <div className="space-y-2.5">
                  {phones.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 0771234567"
                        value={p.number}
                        onChange={e => handlePhoneChange(idx, 'number', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                      <select
                        value={p.state}
                        onChange={e => handlePhoneChange(idx, 'state', e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                      >
                        <option value="Mobile">Mobile</option>
                        <option value="Residence">Residence</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Work">Work</option>
                      </select>
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(idx)}
                          className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                <Ruler className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Tip: Switch to the <strong>Tailor Body Measurements</strong> tab above to record or update custom sizing for pattern making, bridal wear, and jackets.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">
                  Record all body dimensions in inches (in) for accurate pattern cuts.
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-rose-400 rounded-md">
                  Inches (in)
                </span>
              </div>

              {categories.map(cat => (
                <div key={cat} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {cat}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(SIZE_LABELS)
                      .filter(([_, meta]) => meta.category === cat)
                      .map(([key, meta]) => (
                        <div key={key} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                          <label className="block text-[11px] font-medium text-slate-300 mb-1 truncate" title={meta.label}>
                            {meta.label}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              value={sizeMeasurements[key] ?? 0}
                              onChange={e => handleSizeChange(key, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500 pr-8"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                              {meta.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer buttons */}
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
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-medium shadow-md shadow-rose-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{customer ? 'Update Customer' : 'Save Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
