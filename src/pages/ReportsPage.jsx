import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Search,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  ArrowUpRight,
  RefreshCw,
  X,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  input,
  inputSmIcon,
  selectSm,
  selectSmIcon,
  checkbox,
  label as labelClass,
} from '../components/formStyles';

const INITIAL_REPORTS = [
  {
    id: 'REP-2026-001',
    name: 'Q3 Financial & Revenue Audit',
    category: 'financial',
    format: 'PDF',
    date: 'Sep 16, 2026',
    size: '3.4 MB',
    author: 'Alex Johnson',
    status: 'Ready',
  },
  {
    id: 'REP-2026-002',
    name: 'Customer Retention & Cohort Analysis',
    category: 'customers',
    format: 'XLSX',
    date: 'Sep 14, 2026',
    size: '1.8 MB',
    author: 'Sarah Connor',
    status: 'Ready',
  },
  {
    id: 'REP-2026-003',
    name: 'API Infrastructure SLA & Latency Log',
    category: 'system',
    format: 'CSV',
    date: 'Sep 12, 2026',
    size: '850 KB',
    author: 'System Bot',
    status: 'Ready',
  },
  {
    id: 'REP-2026-004',
    name: 'Quarterly Sales Tax & Compliance Statement',
    category: 'compliance',
    format: 'PDF',
    date: 'Sep 08, 2026',
    size: '4.2 MB',
    author: 'Alex Johnson',
    status: 'Ready',
  },
  {
    id: 'REP-2026-005',
    name: 'Product Inventory & Velocity Forecast',
    category: 'financial',
    format: 'CSV',
    date: 'Sep 01, 2026',
    size: '2.1 MB',
    author: 'Kyle Reese',
    status: 'Ready',
  },
];

const SCHEDULES = [
  {
    id: 1,
    name: 'Weekly Executive Briefing',
    frequency: 'Every Monday, 8:00 AM',
    recipients: 'leadership@company.com',
    format: 'PDF',
    active: true,
  },
  {
    id: 2,
    name: 'Monthly Revenue Reconciliation',
    frequency: '1st of every month',
    recipients: 'accounting@company.com',
    format: 'XLSX',
    active: true,
  },
  {
    id: 3,
    name: 'Daily System Error Log Export',
    frequency: 'Daily at midnight',
    recipients: 'devops@company.com',
    format: 'CSV',
    active: false,
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New report form state
  const [newReport, setNewReport] = useState({
    name: '',
    category: 'financial',
    format: 'PDF',
    includeCharts: true,
    includeRawData: false,
  });

  const filteredReports = reports.filter((report) => {
    if (selectedCategory !== 'all' && report.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        report.name.toLowerCase().includes(q) ||
        report.author.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = (report) => {
    toast.success(`Downloading ${report.name} (${report.format})...`, {
      icon: '📥',
      id: `download-${report.id}`,
    });
  };

  const handleDeleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success('Report removed from list', { id: 'delete-report' });
  };

  const handleToggleSchedule = (id) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.active;
          toast.success(
            `${s.name} automated schedule ${nextState ? 'enabled' : 'paused'}`,
            { id: `schedule-${id}` }
          );
          return { ...s, active: nextState };
        }
        return s;
      })
    );
  };

  const handleGenerateCustomReport = (e) => {
    e.preventDefault();
    if (!newReport.name.trim()) {
      toast.error('Please enter a report title');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Compiling data modules and generating report...');

    setTimeout(() => {
      const generated = {
        id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: newReport.name,
        category: newReport.category,
        format: newReport.format,
        date: 'Just now',
        size: '2.6 MB',
        author: 'Alex Johnson',
        status: 'Ready',
      };

      setReports((prev) => [generated, ...prev]);
      setIsGenerating(false);
      setIsModalOpen(false);
      setNewReport({
        name: '',
        category: 'financial',
        format: 'PDF',
        includeCharts: true,
        includeRawData: false,
      });

      toast.success('Report successfully compiled and ready for download!', {
        id: toastId,
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports & Business Intelligence
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Export comprehensive financial summaries, user retention cohorts, and automated audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={selectSmIcon}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Quarter-to-Date</option>
              <option>Year-to-Date</option>
            </select>
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30 transition-colors"
          >
            <Plus size={15} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards aligned with dashboard top palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Reports (Blue) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
              <FileText size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <TrendingUp size={14} />
              +14% mo
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Generated Reports
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {reports.length + 42}
          </h3>
        </div>

        {/* Card 2: Scheduled Automations (Purple) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/25">
              <Clock size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              Active
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Automated Schedules
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {schedules.filter((s) => s.active).length} Running
          </h3>
        </div>

        {/* Card 3: Data Volume Exported (Green) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/25">
              <Download size={20} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              CSV / PDF
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Data Export Volume
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            1.82 GB
          </h3>
        </div>

        {/* Card 4: Delivery SLA (Orange) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-sm shadow-orange-600/25">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Verified
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Delivery Reliability
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            99.9% SLA
          </h3>
        </div>
      </div>

      {/* Popular Report Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Instant Report Templates
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any template to download pre-configured exports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Template 1: Financial */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue & Margin Audit
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Gross sales, payment processing fees, and net revenue summaries.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">PDF • 3.4 MB</span>
              <button
                type="button"
                onClick={() =>
                  handleDownload({ name: 'Revenue & Margin Audit', format: 'PDF' })
                }
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Export</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Template 2: Customers */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Customer Retention Cohorts
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Churn breakdown, LTV analysis, and 90-day repeat purchasing curves.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">XLSX • 1.8 MB</span>
              <button
                type="button"
                onClick={() =>
                  handleDownload({ name: 'Customer Retention Cohorts', format: 'XLSX' })
                }
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Export</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Template 3: System SLA */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCode size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Infrastructure SLA Metrics
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              API latency percentiles (p50, p95, p99), error logs, and cluster uptime.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">CSV • 850 KB</span>
              <button
                type="button"
                onClick={() =>
                  handleDownload({ name: 'Infrastructure SLA Metrics', format: 'CSV' })
                }
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Export</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Template 4: Tax & Compliance */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Tax & Compliance Filings
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Auditable sales tax liabilities formatted for CPA and IRS reporting.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">PDF • 4.2 MB</span>
              <button
                type="button"
                onClick={() =>
                  handleDownload({ name: 'Tax & Compliance Filings', format: 'PDF' })
                }
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Export</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reports Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'financial', 'customers', 'system', 'compliance'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or author..."
              className={inputSmIcon}
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Report Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Format</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Author</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No reports match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400">{item.id} • {item.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                        {item.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.author}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Download report"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          title="Delete report"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Automation Deliveries */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled Email Deliveries
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recurring reports automatically compiled and sent to team inboxes.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {schedules.length} configured
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {schedule.name}
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {schedule.format}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cadence: <span className="font-medium text-slate-700 dark:text-slate-300">{schedule.frequency}</span> • Delivered to: <span className="font-mono text-slate-600 dark:text-slate-300">{schedule.recipients}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold ${schedule.active
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-400'
                    }`}
                >
                  {schedule.active ? 'Active' : 'Paused'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleSchedule(schedule.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${schedule.active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${schedule.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Custom Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <FileText size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Generate Custom Business Report
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateCustomReport} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October Sales Performance & Conversion"
                  value={newReport.name}
                  onChange={(e) =>
                    setNewReport({ ...newReport, name: e.target.value })
                  }
                  className={input}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Category
                  </label>
                  <select
                    value={newReport.category}
                    onChange={(e) =>
                      setNewReport({ ...newReport, category: e.target.value })
                    }
                    className={selectSm}
                  >
                    <option value="financial">Financial & Revenue</option>
                    <option value="customers">Customer Behavior</option>
                    <option value="system">System & SLA</option>
                    <option value="compliance">Tax & Compliance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Export Format
                  </label>
                  <select
                    value={newReport.format}
                    onChange={(e) =>
                      setNewReport({ ...newReport, format: e.target.value })
                    }
                    className={selectSm}
                  >
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="CSV">Comma Separated (.csv)</option>
                    <option value="XLSX">Excel Workbook (.xlsx)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Data Modules Included
                </p>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReport.includeCharts}
                    onChange={(e) =>
                      setNewReport({ ...newReport, includeCharts: e.target.checked })
                    }
                    className={checkbox}
                  />
                  <span>Render high-resolution analytics charts and trends</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReport.includeRawData}
                    onChange={(e) =>
                      setNewReport({ ...newReport, includeRawData: e.target.checked })
                    }
                    className={checkbox}
                  />
                  <span>Attach unaggregated raw row data</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Compile & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
