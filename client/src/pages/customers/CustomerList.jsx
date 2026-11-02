import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import { CustomerModal } from './CustomerModal.jsx';
import { CustomerDetailModal } from './CustomerDetailModal.jsx';
import {
  Users,
  Search,
  Plus,
  Phone,
  Ruler,
  Trash2,
  Edit2,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

export const CustomerList = ({ onCreateOrderForCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers(searchQuery);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateCustomer = async (data) => {
    if (editingCustomer) {
      await api.updateCustomer(editingCustomer.Customer_id, data);
    } else {
      await api.createCustomer(data);
    }
    loadCustomers();
  };

  const handleDeleteCustomer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
      try {
        await api.deleteCustomer(id);
        loadCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenDetail = async (c) => {
    try {
      const detailed = await api.getCustomer(c.Customer_id);
      setSelectedCustomer(detailed);
    } catch {
      setSelectedCustomer(c);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-rose-500" /> Customers Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage bespoke clientele, phone contacts, tailor body measurements, and order logs
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, Customer ID (e.g. CUS001)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
        <div className="text-xs text-slate-400 shrink-0 font-medium px-2">
          {customers.length} total customers
        </div>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Loading customer records...
        </div>
      ) : customers.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Customers Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No results match "${searchQuery}". Try a different keyword.`
              : 'Add your first customer to begin recording orders and custom measurements.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(customer => {
            const primaryPhone = customer.phones && customer.phones.length > 0 ? customer.phones[0] : null;
            const hasSize = !!customer.size;

            return (
              <div
                key={customer.Customer_id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-400 font-bold flex items-center justify-center text-sm">
                        {customer.first_name?.[0]}
                        {customer.last_name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm group-hover:text-rose-400 transition-colors">
                          {customer.full_name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500">
                          {customer.Customer_id}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDetail(customer)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="View Customer Profile & Size Chart"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact info & metrics */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-rose-400" /> Phone:
                      </span>
                      <span className="font-mono">
                        {primaryPhone ? primaryPhone.number : 'Not set'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-amber-400" /> Measurements:
                      </span>
                      {hasSize ? (
                        <span className="text-emerald-400 font-medium">Recorded (19 pts)</span>
                      ) : (
                        <span className="text-slate-500 italic">Pending input</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-400" /> Order History:
                      </span>
                      <span className="font-semibold text-white">
                        {customer.orderCount || 0} orders
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCustomer(customer);
                        setModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit customer details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.Customer_id, customer.full_name)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(customer)}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Add/Edit Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleCreateCustomer}
        customer={editingCustomer}
      />

      {/* Customer Details & Sizing & Orders Modal */}
      <CustomerDetailModal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
        onEdit={cust => {
          setSelectedCustomer(null);
          setEditingCustomer(cust);
          setModalOpen(true);
        }}
        onCreateOrder={onCreateOrderForCustomer}
      />
    </div>
  );
};
