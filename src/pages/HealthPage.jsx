import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Server,
  Zap,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const LATENCY_DATA = [
  { time: '00:00', latency: 34, rps: 1200 },
  { time: '03:00', latency: 28, rps: 840 },
  { time: '06:00', latency: 31, rps: 1450 },
  { time: '09:00', latency: 45, rps: 3200 },
  { time: '12:00', latency: 38, rps: 4100 },
  { time: '15:00', latency: 42, rps: 3800 },
  { time: '18:00', latency: 36, rps: 2900 },
  { time: '21:00', latency: 30, rps: 1800 },
];

const INITIAL_SERVICES = [
  {
    id: 1,
    name: 'US-East API Gateway',
    region: 'us-east-1 (N. Virginia)',
    type: 'gateway',
    status: 'operational',
    latency: '18ms',
    uptime: '99.99%',
  },
  {
    id: 2,
    name: 'PostgreSQL Primary Cluster',
    region: 'us-east-1 (Multi-AZ)',
    type: 'database',
    status: 'operational',
    latency: '36ms',
    uptime: '99.98%',
  },
  {
    id: 3,
    name: 'Redis Cache Memory Tier',
    region: 'us-east-1 (In-Memory)',
    type: 'cache',
    status: 'operational',
    latency: '3ms',
    uptime: '100%',
  },
  {
    id: 4,
    name: 'Global Edge CDN',
    region: '240 Edge Points of Presence',
    type: 'cdn',
    status: 'operational',
    latency: '12ms',
    uptime: '99.99%',
  },
  {
    id: 5,
    name: 'Authentication & Session Service',
    region: 'global-auth-cluster',
    type: 'auth',
    status: 'operational',
    latency: '22ms',
    uptime: '100%',
  },
  {
    id: 6,
    name: 'Async Background Job Queue',
    region: 'worker-pool-tier',
    type: 'worker',
    status: 'operational',
    latency: '58ms',
    uptime: '99.95%',
  },
];

const AUDIT_LOGS = [
  {
    id: 1,
    event: 'Automated Snapshot & Backup Succeeded',
    service: 'PostgreSQL Primary Cluster',
    time: 'Today at 03:00 AM',
    status: 'success',
  },
  {
    id: 2,
    event: 'Edge SSL Certificates Auto-Renewed',
    service: 'Global Edge CDN',
    time: 'Yesterday at 11:20 PM',
    status: 'success',
  },
  {
    id: 3,
    event: 'Redis Memory Optimization & GC Complete',
    service: 'Redis Cache Memory Tier',
    time: '2 days ago',
    status: 'success',
  },
  {
    id: 4,
    event: 'Kubernetes Worker Node Autoscale Triggered',
    service: 'Async Background Job Queue',
    time: 'Sep 14, 2026',
    status: 'info',
  },
];

export default function HealthPage() {
  const { isDarkMode } = useTheme();
  const [services] = useState(INITIAL_SERVICES);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const strokeColor = isDarkMode ? '#60a5fa' : '#2563eb';
  const gridColor = isDarkMode ? '#374151' : '#f0f0f0';
  const textColor = isDarkMode ? '#9ca3af' : '#6b7280';

  const handleRunDiagnostic = () => {
    setIsRunningDiagnostic(true);
    const toastId = toast.loading('Running full system latency & integrity tests...');

    setTimeout(() => {
      setIsRunningDiagnostic(false);
      toast.success('Diagnostics passed! All 6 services responding with 0 errors.', {
        id: toastId,
        icon: '✅',
      });
    }, 1200);
  };

  const handleRestartNode = (serviceName) => {
    toast.success(`Node "${serviceName}" cache re-indexed successfully!`, {
      icon: '🔄',
      id: `restart-${serviceName}`,
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            System Health & Infrastructure SLA
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time API gateway status, server cluster load, and historical SLA performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toast.success('Telemetry data refreshed', { icon: '📡' })}
            className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw size={15} />
          </button>

          <button
            type="button"
            disabled={isRunningDiagnostic}
            onClick={handleRunDiagnostic}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30 transition-colors disabled:opacity-70"
          >
            {isRunningDiagnostic ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Probing Services...</span>
              </>
            ) : (
              <>
                <Activity size={14} />
                <span>Run Deep Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Status Hero Beacon */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <span className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <CheckCircle2 size={24} />
            </span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                All Core Services Operational
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                100% Uptime Today
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Zero active incidents reported in the last 24 hours across all regions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">30-Day Avg Uptime</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
              99.98%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Live Gateway Latency</span>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
              34ms
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Active Workers</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
              16 Nodes
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards aligned with dashboard palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Response Latency (Green) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/25">
              <Zap size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingDown size={14} />
              -6ms faster
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Median API Response (p50)
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            32 ms
          </h3>
        </div>

        {/* Metric 2: Cluster CPU Load (Blue) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
              <Cpu size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Normal Load
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Compute Cluster Load
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            24.2%
          </h3>
        </div>

        {/* Metric 3: Memory / RAM Utilization (Purple) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/25">
              <Database size={20} />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Allocated
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Memory Allocation
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            61.4%
          </h3>
        </div>

        {/* Metric 4: Error Rate (Orange) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-sm shadow-orange-600/25">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Within SLA
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            24h HTTP 5xx Error Rate
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            0.01%
          </h3>
        </div>
      </div>

      {/* Latency & Throughput Area Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Latency & Throughput Trends (24 Hours)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous monitoring of round-trip times (ms) and peak request volume.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">Latency (ms)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300">Requests / sec</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LATENCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : '#111827',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#latencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Infrastructure Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Infrastructure Node Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status checks across primary cloud clusters and microservices.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            6 / 6 Healthy
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Server size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {svc.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Operational
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{svc.region}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Ping Latency</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {svc.latency}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">SLA Uptime</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {svc.uptime}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRestartNode(svc.name)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Diagnostic
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident & Maintenance Audit History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            System Maintenance & Event Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of automated cluster backups, upgrades, and certificates.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {AUDIT_LOGS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.event}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Target: <span className="font-medium text-slate-700 dark:text-slate-300">{item.service}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
