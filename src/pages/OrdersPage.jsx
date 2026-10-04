import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    Review: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    Failed: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
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

export default function OrdersPage() {
  const { orders, addOrder, updateOrder, deleteOrder, setOrders } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ id: '', customer: '', date: '', total: '', status: 'Pending' });

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  const queryClient = useQueryClient();

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders
  });

  useEffect(() => {
    if (apiData) {
      setOrders(apiData);
    } else if (error) {
      toast.error('Could not load orders from the server. Showing local defaults.', { id: 'api-error' });
    }
  }, [apiData, error, setOrders]);

  const handleOpenModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      // total feeds a number input, so hand it a plain numeric string.
      setFormData({ ...order, total: toNumberValue(order.total) });
    } else {
      setEditingOrder(null);
      setFormData({ id: '', customer: '', date: new Date().toISOString().split('T')[0], total: '', status: 'Pending' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMoney(String(formData.total ?? '').trim())) {
      toast.error('Total must be a number (e.g. 250.00).', { id: 'invalid-total' });
      return;
    }
    const payload = { ...formData, total: toNumberValue(formData.total) };

    try {
      if (editingOrder) {
        const saved = await api.updateOrder(editingOrder.id, payload);
        updateOrder(editingOrder.id, saved);
        // Keep the query cache in sync so remounting this page can't
        // overwrite the edit with stale data.
        queryClient.setQueryData(['orders'], (rows) =>
          rows?.map((row) => (String(row.id) === String(saved.id) ? saved : row)) ?? rows
        );
        toast.success('Order updated successfully!');
      } else {
        const created = await api.createOrder(payload);
        addOrder(created);
        // New records show first — put the row at the top of the cache and
        // land the user on page 1 with a clean slate.
        queryClient.setQueryData(['orders'], (rows) => [created, ...(rows ?? [])]);
        setSearchTerm('');
        setStatusFilter('All');
        setCurrentPage(1);
        toast.success('Order created successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Could not save the order.', { id: 'save-order' });
    }
  };

  const handleDeleteClick = (id) => {
    setOrderToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await api.deleteOrder(orderToDelete);
      deleteOrder(orderToDelete);
      queryClient.setQueryData(['orders'], (rows) =>
        rows?.filter((row) => String(row.id) !== String(orderToDelete)) ?? rows
      );
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted successfully!');
      setOrderToDelete(null);
    } catch (err) {
      toast.error(err?.message || 'Could not delete the order.', { id: 'delete-order' });
    }
  };

  // Filter logic
  const filteredOrders = orders.filter(o => {
    const cleanSearch = searchTerm.toLowerCase().replace(/\s+/g, '');
    const matchesSearch =
      o.customer.toLowerCase().replace(/\s+/g, '').includes(cleanSearch) ||
      o.id.toLowerCase().replace(/\s+/g, '').includes(cleanSearch);
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading)
    return (
      <LoadingScreen variant="inline" message="Loading orders…" />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and manage your store orders.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Order
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Review">Review</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{o.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{o.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{o.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(o.total)}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(o)} className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(o.id)} className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">No orders found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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
        title={editingOrder ? 'Edit Order' : 'Create New Order'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={labelClass}>Order ID</label>
            <input
              type="text"
              required
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className={input}
              placeholder="e.g. ORD-001"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Customer</label>
            <input
              type="text"
              required
              value={formData.customer}
              onChange={e => setFormData({ ...formData, customer: e.target.value })}
              className={input}
              placeholder="e.g. Acme Corporation"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className={input}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Total</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                inputMode="decimal"
                value={formData.total}
                onChange={e => setFormData({ ...formData, total: e.target.value })}
                className={input}
                placeholder="e.g. 250.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className={select}
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Review">Review</option>
              <option value="Failed">Failed</option>
            </select>
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
              {editingOrder ? 'Update Order' : 'Save Order'}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}
