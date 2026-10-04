import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * KPI card with a gradient icon tile, trend pill and hover elevation.
 */
export default function StatCard({ title, value, trend, trendValue, icon: Icon, color }) {
  const isUp = trend === 'up';

  return (
    <div className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={`p-2.5 rounded-xl text-white shadow-lg ${color} shadow-slate-900/10 group-hover:scale-105 transition-transform`}
        >
          <Icon size={22} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isUp
              ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50'
              : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/50'
          }`}
        >
          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trendValue}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white mt-1 truncate">
        {value}
      </h3>
    </div>
  );
}
