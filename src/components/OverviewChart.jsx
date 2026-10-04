import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { selectSmAuto } from './formStyles';

export default function OverviewChart() {
  const { isDarkMode } = useTheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ['revenueData'],
    queryFn: api.getRevenueData,
  });

  const strokeColor = isDarkMode ? '#60a5fa' : '#2563eb';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';

  if (isLoading) {
    return (
      <div className="h-96 w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <Loader2 size={18} className="animate-spin" />
        Loading chart…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <AlertCircle size={22} className="text-amber-500" />
        <p className="text-sm">Couldn&apos;t load revenue data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-96 flex flex-col">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly growth trends</p>
        </div>
        <select className={selectSmAuto}>
          <option>Last 7 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="h-72 w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
              tickFormatter={(v) => `$${Math.round(v / 100) / 10}k`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Revenue']}
              contentStyle={{
                borderRadius: '12px',
                border: `1px solid ${gridColor}`,
                boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.2)',
                backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                color: isDarkMode ? '#f1f5f9' : '#0f172a',
                fontSize: 12,
              }}
              labelStyle={{ color: textColor, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
