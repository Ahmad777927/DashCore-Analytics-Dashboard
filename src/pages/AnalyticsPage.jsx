import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye,
  Download, RefreshCw, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, MousePointerClick, Globe,
  Smartphone, Monitor, Tablet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RANGES = ['7D', '30D', 'Quarter', 'Year'];

const REVENUE_DATA = {
  '7D': [
    { label: 'Mon', revenue: 14200, orders: 312, users: 1840 },
    { label: 'Tue', revenue: 11800, orders: 274, users: 1620 },
    { label: 'Wed', revenue: 18600, orders: 421, users: 2150 },
    { label: 'Thu', revenue: 22400, orders: 508, users: 2780 },
    { label: 'Fri', revenue: 19300, orders: 438, users: 2390 },
    { label: 'Sat', revenue: 27100, orders: 614, users: 3320 },
    { label: 'Sun', revenue: 21500, orders: 487, users: 2670 },
  ],
  '30D': [
    { label: 'W1', revenue: 88000, orders: 1980, users: 11200 },
    { label: 'W2', revenue: 101000, orders: 2290, users: 12800 },
    { label: 'W3', revenue: 94500, orders: 2140, users: 11900 },
    { label: 'W4', revenue: 117000, orders: 2650, users: 14600 },
  ],
  Quarter: [
    { label: 'Jan', revenue: 312000, orders: 7080, users: 39400 },
    { label: 'Feb', revenue: 284000, orders: 6440, users: 35800 },
    { label: 'Mar', revenue: 367000, orders: 8320, users: 46200 },
  ],
  Year: [
    { label: 'Jan', revenue: 312000, orders: 7080, users: 39400 },
    { label: 'Feb', revenue: 284000, orders: 6440, users: 35800 },
    { label: 'Mar', revenue: 367000, orders: 8320, users: 46200 },
    { label: 'Apr', revenue: 398000, orders: 9020, users: 50100 },
    { label: 'May', revenue: 421000, orders: 9550, users: 53200 },
    { label: 'Jun', revenue: 388000, orders: 8800, users: 49000 },
    { label: 'Jul', revenue: 445000, orders: 10090, users: 56500 },
    { label: 'Aug', revenue: 462000, orders: 10480, users: 58700 },
    { label: 'Sep', revenue: 431000, orders: 9770, users: 54400 },
    { label: 'Oct', revenue: 479000, orders: 10870, users: 60900 },
    { label: 'Nov', revenue: 523000, orders: 11870, users: 66400 },
    { label: 'Dec', revenue: 601000, orders: 13630, users: 76100 },
  ],
};

const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 38, color: '#2563eb' },
  { name: 'Direct', value: 24, color: '#8b5cf6' },
  { name: 'Social Media', value: 19, color: '#22c55e' },
  { name: 'Referral', value: 12, color: '#f97316' },
  { name: 'Email', value: 7, color: '#ec4899' },
];

const DEVICE_DATA = [
  { device: 'Desktop', sessions: 54, icon: Monitor, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { device: 'Mobile', sessions: 38, icon: Smartphone, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  { device: 'Tablet', sessions: 8, icon: Tablet, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
];

const CONVERSION_DATA = {
  '7D': [
    { label: 'Mon', rate: 3.2 }, { label: 'Tue', rate: 2.8 }, { label: 'Wed', rate: 4.1 },
    { label: 'Thu', rate: 4.8 }, { label: 'Fri', rate: 3.9 }, { label: 'Sat', rate: 5.2 }, { label: 'Sun', rate: 4.4 },
  ],
  '30D': [
    { label: 'W1', rate: 3.6 }, { label: 'W2', rate: 4.1 }, { label: 'W3', rate: 3.8 }, { label: 'W4', rate: 4.7 },
  ],
  Quarter: [
    { label: 'Jan', rate: 3.8 }, { label: 'Feb', rate: 3.5 }, { label: 'Mar', rate: 4.2 },
  ],
  Year: [
    { label: 'Jan', rate: 3.8 }, { label: 'Feb', rate: 3.5 }, { label: 'Mar', rate: 4.2 },
    { label: 'Apr', rate: 4.5 }, { label: 'May', rate: 4.8 }, { label: 'Jun', rate: 4.3 },
    { label: 'Jul', rate: 5.0 }, { label: 'Aug', rate: 5.2 }, { label: 'Sep', rate: 4.7 },
    { label: 'Oct', rate: 5.4 }, { label: 'Nov', rate: 5.8 }, { label: 'Dec', rate: 6.2 },
  ],
};

const CATEGORY_PERF = [
  { category: 'Electronics', revenue: 142000, growth: 18.4 },
  { category: 'Fashion', revenue: 98000, growth: 12.1 },
  { category: 'Home & Garden', revenue: 67000, growth: 8.7 },
  { category: 'Beauty', revenue: 54000, growth: 22.3 },
  { category: 'Sports', revenue: 41000, growth: -3.2 },
  { category: 'Books', revenue: 28000, growth: 5.6 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(n) {
  if (n >= 1_000_000) return `\$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `\$${(n / 1_000).toFixed(1)}K`;
  return `\$${n}`;
}
function fmtNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

// ─── KPI Stat Card ────────────────────────────────────────────────────────────

function KpiCard({ title, value, trend, trendValue, icon: Icon, gradient, iconBg }) {
  const isUp = trend === 'up';
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
      {/* decorative circle */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-2 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
            ${isUp ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue} vs last period
          </div>
        </div>
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { isDarkMode } = useTheme();
  const [range, setRange] = useState('30D');
  const [activeSegment, setActiveSegment] = useState('Revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const revenueData = REVENUE_DATA[range];
  const conversionData = CONVERSION_DATA[range];

  // Aggregate KPIs for selected range
  const kpis = useMemo(() => {
    const total = revenueData.reduce((a, d) => ({ revenue: a.revenue + d.revenue, orders: a.orders + d.orders, users: a.users + d.users }), { revenue: 0, orders: 0, users: 0 });
    return total;
  }, [revenueData]);

  const avgConversion = useMemo(() => {
    const avg = conversionData.reduce((a, d) => a + d.rate, 0) / conversionData.length;
    return avg.toFixed(1);
  }, [conversionData]);

  // Chart theme colours
  const gridColor = isDarkMode ? '#374151' : '#f3f4f6';
  const tickColor = isDarkMode ? '#9ca3af' : '#6b7280';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Analytics data refreshed', { id: 'analytics-refresh' });
    }, 1200);
  };

  const handleExport = () => {
    toast.success('Report exported as CSV', { id: 'analytics-export' });
  };

  const segments = ['Revenue', 'Orders', 'Users'];

  // Which dataKey to highlight in the main area chart
  const segmentKey = activeSegment.toLowerCase();

  return (
    <div className="space-y-8 pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Deep-dive into your business performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <Calendar size={14} className="text-slate-400 ml-2" />
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === r
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:border-blue-400 hover:text-blue-600 transition-all"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-all"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard
          title="Total Revenue"
          value={fmtCurrency(kpis.revenue)}
          trend="up"
          trendValue="+18.4%"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          iconBg="bg-blue-400/30"
        />
        <KpiCard
          title="Total Orders"
          value={fmtNum(kpis.orders)}
          trend="up"
          trendValue="+12.1%"
          icon={ShoppingCart}
          gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          iconBg="bg-purple-400/30"
        />
        <KpiCard
          title="Active Users"
          value={fmtNum(kpis.users)}
          trend="up"
          trendValue="+9.7%"
          icon={Users}
          gradient="bg-gradient-to-br from-green-500 to-green-700"
          iconBg="bg-green-400/30"
        />
        <KpiCard
          title="Avg. Conversion"
          value={`${avgConversion}%`}
          trend="up"
          trendValue="+1.2pp"
          icon={MousePointerClick}
          gradient="bg-gradient-to-br from-orange-500 to-orange-700"
          iconBg="bg-orange-400/30"
        />
      </div>

      {/* ── Main Area Chart ── */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Performance Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Trend across the selected period</p>
          </div>
          {/* Segment Pills */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {segments.map(s => (
              <button
                key={s}
                onClick={() => setActiveSegment(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSegment === s
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }}
                tickFormatter={v => segmentKey === 'revenue' ? fmtCurrency(v) : fmtNum(v)} />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    formatter={(v, name) =>
                      name === 'revenue' ? fmtCurrency(v) : fmtNum(v)
                    }
                  />
                )}
              />
              {segmentKey === 'revenue' && (
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#gradBlue)" dot={false} activeDot={{ r: 5, fill: '#2563eb' }} />
              )}
              {segmentKey === 'orders' && (
                <Area type="monotone" dataKey="orders" name="orders" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradPurple)" dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }} />
              )}
              {segmentKey === 'users' && (
                <Area type="monotone" dataKey="users" name="users" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradGreen)" dot={false} activeDot={{ r: 5, fill: '#22c55e' }} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Row 2: Traffic Sources + Conversion Rate ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Traffic Sources Donut */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Traffic Sources</h2>
              <p className="text-xs text-slate-400 mt-0.5">Where visitors are coming from</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe size={14} />
              All channels
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-44 h-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {TRAFFIC_SOURCES.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{payload[0].name}</p>
                          <p className="text-slate-500 dark:text-slate-400">{payload[0].value}%</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {TRAFFIC_SOURCES.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{s.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Conversion Rate Line Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Conversion Rate</h2>
              <p className="text-xs text-slate-400 mt-0.5">Visitors to paying customers</p>
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
              Avg {avgConversion}%
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 10 }}
                  tickFormatter={v => `${v}%`} domain={[0, 8]} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 text-xs">
                        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                        <p className="text-green-600 font-semibold">{payload[0].value}%</p>
                      </div>
                    ) : null
                  }
                />
                <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2.5}
                  dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Row 3: Category Performance + Device Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Category Performance bar */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Revenue by Category</h2>
                <p className="text-xs text-slate-400 mt-0.5">Top-performing product categories</p>
              </div>
              <button
                onClick={() => toast.success('Category report downloaded', { id: 'cat-report' })}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Download size={12} /> Download
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_PERF} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 10 }}
                    tickFormatter={v => fmtCurrency(v)} />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false}
                    tick={{ fill: tickColor, fontSize: 11 }} width={90} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                          <p className="text-blue-600 font-semibold">{fmtCurrency(payload[0].value)}</p>
                          <p className={`font-medium mt-1 ${payload[0].payload.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {payload[0].payload.growth >= 0 ? '+' : ''}{payload[0].payload.growth}% growth
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}
                    label={{ position: 'right', fontSize: 10, fill: tickColor, formatter: v => fmtCurrency(v) }}>
                    {CATEGORY_PERF.map((entry, index) => (
                      <Cell key={index}
                        fill={entry.growth >= 0 ? '#2563eb' : '#ef4444'}
                        opacity={1 - index * 0.1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Growth badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {CATEGORY_PERF.map(c => (
                <div key={c.category} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.category}</span>
                  <span className={`text-xs font-bold ml-1 flex-shrink-0 ${c.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {c.growth >= 0 ? '+' : ''}{c.growth}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Device Breakdown + Quick Stats */}
        <div className="flex flex-col gap-6">

          {/* Device share */}
          <Card className="p-6 flex-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Device Breakdown</h2>
            <p className="text-xs text-slate-400 mb-5">Sessions by device type</p>
            <div className="space-y-4">
              {DEVICE_DATA.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.device}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.color}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.device}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{d.sessions}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-11">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${d.sessions}%`,
                          background: d.device === 'Desktop' ? '#2563eb' : d.device === 'Mobile' ? '#8b5cf6' : '#f97316'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick KPIs */}
          <Card className="p-6 flex-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h2>
            <div className="space-y-3">
              {[
                { label: 'Avg. Session Duration', value: '4m 32s', icon: Eye, up: true },
                { label: 'Bounce Rate', value: '32.4%', icon: TrendingDown, up: false },
                { label: 'Pages / Session', value: '6.8', icon: TrendingUp, up: true },
                { label: 'New Visitors', value: '68%', icon: Users, up: true },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <stat.icon size={13} />
                    {stat.label}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    {stat.up
                      ? <ArrowUpRight size={13} className="text-green-500" />
                      : <ArrowDownRight size={13} className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Row 4: Top Pages Table ── */}
      <Card>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Top Pages</h2>
            <p className="text-xs text-slate-400 mt-0.5">Most visited pages this period</p>
          </div>
          <button
            onClick={() => toast.success('Pages report exported', { id: 'pages-export' })}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <Filter size={12} /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                {['Page', 'Views', 'Unique Visitors', 'Bounce Rate', 'Avg Time', 'Trend'].map(h => (
                  <th key={h} className="text-left px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { page: '/dashboard', views: '24,821', unique: '18,340', bounce: '21.4%', time: '6m 14s', trend: 'up', change: '+14%' },
                { page: '/products', views: '18,654', unique: '14,220', bounce: '34.7%', time: '4m 02s', trend: 'up', change: '+8%' },
                { page: '/checkout', views: '12,110', unique: '11,880', bounce: '12.1%', time: '7m 48s', trend: 'up', change: '+22%' },
                { page: '/account', views: '9,442', unique: '7,100', bounce: '28.3%', time: '3m 31s', trend: 'down', change: '-4%' },
                { page: '/blog/top-picks', views: '7,218', unique: '6,840', bounce: '41.2%', time: '5m 17s', trend: 'up', change: '+31%' },
                { page: '/pricing', views: '5,983', unique: '5,610', bounce: '45.6%', time: '2m 58s', trend: 'down', change: '-2%' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-600 dark:text-blue-400 text-xs font-semibold">{row.page}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{row.views}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.unique}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.bounce}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${row.trend === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {row.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
