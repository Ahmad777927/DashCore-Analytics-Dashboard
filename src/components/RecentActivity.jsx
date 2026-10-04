import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, ArrowUpRight } from 'lucide-react';

const activities = [
  { id: 1, user: 'Sarah Connor', action: 'Completed payment', amount: '$250.00', status: 'Completed', date: '2 mins ago' },
  { id: 2, user: 'Kyle Reese', action: 'New subscription', amount: '$49.00', status: 'Pending', date: '1 hour ago' },
  { id: 3, user: 'T-800', action: 'Refund requested', amount: '$120.00', status: 'Review', date: '5 hours ago' },
  { id: 4, user: 'Ellen Ripley', action: 'Payment failed', amount: '$15.00', status: 'Failed', date: 'Yesterday' },
  { id: 5, user: 'Rick Deckard', action: 'Completed payment', amount: '$500.00', status: 'Completed', date: '2 days ago' },
];

const STATUS_STYLES = {
  Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Review: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Failed: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentActivity() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest activity across your account
          </p>
        </div>
        <button
          onClick={() => navigate('/transactions')}
          className="shrink-0 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          View all
          <ArrowUpRight size={14} />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <Inbox size={28} className="mx-auto mb-2 opacity-60" />
          <p className="text-sm">No recent activity yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 sm:px-6 py-3 font-semibold">Customer</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Activity</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Amount</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Status</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activities.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-5 sm:px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {item.user}
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {item.action}
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.amount}
                  </td>
                  <td className="px-5 sm:px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-slate-400 dark:text-slate-500">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}