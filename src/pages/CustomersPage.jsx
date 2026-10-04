import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingScreen from '../components/LoadingScreen';
import { input, inputIcon, select, selectSmAuto, label as labelClass } from '../components/formStyles';
import { formatCurrency, toNumberValue, isMoney } from '../utils/format';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    Inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
      {status}
    </span>
  );
};

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, setCustomers } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active', joined: '', spend: '' });

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: api.getCustomers
  });

  useEffect(() => {
    if (apiData) {
      setCustomers(apiData);
    } else if (error) {
      toast.error('Could not load customers from the server. Showing local defaults.', { id: 'api-error' });
    }
  }, [apiData, error, setCustomers]);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      // spend feeds a number input, so hand it a plain numeric string.
      setFormData({ ...customer, spend: toNumberValue(customer.spend) });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', status: 'Active', joined: new Date().toISOString().split('T')[0], spend: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMoney(String(formData.spend ?? '').trim())) {
      toast.error('Total spend must be a number (e.g. 1200.50).', { id: 'invalid-spend' });
      return;
    }
    const payload = { ...formData, spend: toNumberValue(formData.spend) };

    try {
      if (editingCustomer) {
        const saved = await api.updateCustomer(editingCustomer.id, payload);
        updateCustomer(editingCustomer.id, saved);
        // Keep the query cache in sync so remounting this page (e.g. coming
        // back from the detail view) can't overwrite the edit with stale data.
        queryClient.setQueryData(['customers'], (rows) =>
          rows?.map((row) => (String(row.id) === String(saved.id) ? saved : row)) ?? rows
        );
        toast.success('Customer updated successfully!');
      } else {
        const created = await api.createCustomer(payload);
        addCustomer(created);
        // New records show first — put the row at the top of the cache and
        // land the user on page 1 with a clean slate.
        queryClient.setQueryData(['customers'], (rows) => [created, ...(rows ?? [])]);
        setSearchTerm('');
        setStatusFilter('All');
        setCurrentPage(1);
        toast.success('Customer added successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Could not save the customer.', { id: 'save-customer' });
    }
  };

  const handleDeleteClick = (id) => {
    setCustomerToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.deleteCustomer(customerToDelete);
      deleteCustomer(customerToDelete);
      queryClient.setQueryData(['customers'], (rows) =>
        rows?.filter((row) => String(row.id) !== String(customerToDelete)) ?? rows
      );
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully!');
      setCustomerToDelete(null);
    } catch (err) {
      toast.error(err?.message || 'Could not delete the customer.', { id: 'delete-customer' });
    }
  };

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const cleanSearch = searchTerm.toLowerCase().replace(/\s+/g, '');
    const matchesSearch =
      c.name.toLowerCase().replace(/\s+/g, '').includes(cleanSearch) ||
      c.email.toLowerCase().replace(/\s+/g, '').includes(cleanSearch);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading)
    return (
      <LoadingScreen variant="inline" message="Loading customers…" />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your customer base and relationships.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={inputIcon}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={selectSmAuto}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="hidden md:table-cell px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="hidden sm:table-cell px-6 py-3 font-semibold">Joined</th>
                <th className="px-6 py-3 font-semibold">Total Spend</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{c.name}</td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.joined}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(c.spend)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/customers/${c.id}`)} className="p-2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="View Details" aria-label={`View ${c.name}`}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(c)} className="p-2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit" aria-label={`Edit ${c.name}`}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(c.id)} className="p-2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete" aria-label={`Delete ${c.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">No customers found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCustomers.length)} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors dark:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors dark:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={input}
              placeholder="e.g. Jordan Miles"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={input}
              placeholder="customer@company.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className={select}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Joined Date</label>
              <input
                type="date"
                required
                value={formData.joined}
                onChange={e => setFormData({ ...formData, joined: e.target.value })}
                className={input}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Total Spend</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              inputMode="decimal"
              value={formData.spend}
              onChange={e => setFormData({ ...formData, spend: e.target.value })}
              className={input}
              placeholder="e.g. 1200.50"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
}