import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { inputIcon, selectSmAuto } from '../components/formStyles';

const allTransactions = [
  { id: 1, user: 'Sarah Connor', action: 'Completed payment', amount: '$250.00', status: 'Completed', date: '2026-09-10', time: '10:30 AM' },
  { id: 2, user: 'Kyle Reese', action: 'New subscription', amount: '$49.00', status: 'Pending', date: '2026-09-12', time: '11:15 AM' },
  { id: 3, user: 'T-800', action: 'Refund requested', amount: '$120.00', status: 'Review', date: '2026-09-14', time: '02:45 PM' },
  { id: 4, user: 'Ellen Ripley', action: 'Payment failed', amount: '$15.00', status: 'Failed', date: '2026-09-15', time: '09:00 AM' },
  { id: 5, user: 'Rick Deckard', action: 'Completed payment', amount: '$500.00', status: 'Completed', date: '2026-09-15', time: '04:20 PM' },
  { id: 6, user: 'Sarah Connor', action: 'Completed payment', amount: '$1,200.00', status: 'Completed', date: '2026-09-16', time: '08:00 AM' },
  { id: 7, user: 'Kyle Reese', action: 'Completed payment', amount: '$150.00', status: 'Completed', date: '2026-09-16', time: '09:30 AM' },
  { id: 8, user: 'T-800', action: 'New subscription', amount: '$99.00', status: 'Pending', date: '2026-09-16', time: '10:00 AM' },
  { id: 9, user: 'Ellen Ripley', action: 'Completed payment', amount: '$450.00', status: 'Completed', date: '2026-09-16', time: '11:00 AM' },
  { id: 10, user: 'Rick Deckard', action: 'Refund requested', amount: '$200.00', status: 'Review', date: '2026-09-16', time: '12:00 PM' },
];

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

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTransactions = allTransactions.filter(t => {
    const cleanSearch = searchTerm.toLowerCase().replace(/\s+/g, '');
    const matchesSearch = t.user.toLowerCase().replace(/\s+/g, '').includes(cleanSearch) ||
                          t.action.toLowerCase().replace(/\s+/g, '').includes(cleanSearch);
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete history of all financial movements.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by customer or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputIcon}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {t.user}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {t.action}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {t.amount}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{t.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">{t.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
