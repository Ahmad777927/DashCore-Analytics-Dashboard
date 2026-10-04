import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SearchProvider } from './context/SearchContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import GlobalSearch from './components/GlobalSearch';
import GuestRoute from './components/GuestRoute';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { DollarSign, Users, ShoppingBag, Activity, FileText, UserPlus, CreditCard, HeartPulse } from 'lucide-react';
import { api } from './services/api';
import { Toaster } from 'react-hot-toast';

/* Route-level code splitting keeps the initial bundle small. */
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const HealthPage = lazy(() => import('./pages/HealthPage'));
const CustomerDetailsPage = lazy(() => import('./pages/customer-details/CustomerDetailsPage'));
// recharts is heavy — only load it when the overview chart actually renders.
const OverviewChart = lazy(() => import('./components/OverviewChart'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

/** First name only, for a friendlier greeting. */
function firstName(name) {
  return (name || 'there').trim().split(/\s+/)[0];
}

/** Shortcuts surfaced on the overview page. */
const QUICK_ACTIONS = [
  { name: 'Generate Report', path: '/reports', icon: FileText },
  { name: 'Invite Team Member', path: '/team', icon: UserPlus },
  { name: 'Manage Billing', path: '/billing', icon: CreditCard },
  { name: 'System Health', path: '/health', icon: HeartPulse },
];

function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: customersData } = useQuery({ queryKey: ['customers'], queryFn: api.getCustomers });
  const { data: ordersData } = useQuery({ queryKey: ['orders'], queryFn: api.getOrders });

  const totalRevenue = ordersData?.reduce((acc, order) => {
    const val = parseFloat(String(order.total).replace('$', ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0) || 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {firstName(user?.name)}! Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="up"
          trendValue="+20.1%"
          icon={DollarSign}
          color="bg-blue-600"
        />
        <StatCard
          title="Active Users"
          value={customersData?.length || 0}
          trend="up"
          trendValue="+180.1%"
          icon={Users}
          color="bg-purple-600"
        />
        <StatCard
          title="Total Sales"
          value={ordersData?.length || 0}
          trend="down"
          trendValue="-4.5%"
          icon={ShoppingBag}
          color="bg-orange-600"
        />
        <StatCard
          title="Avg. Session"
          value="12m 30s"
          trend="up"
          trendValue="+12%"
          icon={Activity}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
            }
          >
            <OverviewChart />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-2.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => navigate(action.path)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors text-sm font-medium flex items-center gap-3 group text-slate-700 dark:text-slate-200"
                  >
                    <span className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400 transition-colors">
                      <Icon size={15} />
                    </span>
                    <span className="flex-1">{action.name}</span>
                    <span className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <SearchProvider>
              <Router>
                {/* Outer boundary: covers lazy /login (no app shell yet) */}
                <Suspense fallback={<LoadingScreen message="Loading…" />}>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <GuestRoute>
                        <LoginPage />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <GuestRoute>
                        <ForgotPasswordPage />
                      </GuestRoute>
                    }
                  />
                  {/* Open route: the email link must work even when signed in. */}
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                              <div className="mx-auto w-full max-w-[1600px]">
                                {/* Scoped boundary: the sidebar & navbar stay
                                    mounted while a lazy page chunk loads. */}
                                <Suspense
                                  fallback={
                                    <LoadingScreen
                                      variant="inline"
                                      message="Loading page…"
                                    />
                                  }
                                >
                                  <Routes>
                                    <Route path="/" element={<DashboardOverview />} />
                                    <Route path="/customers" element={<CustomersPage />} />
                                    <Route path="/customers/:id" element={<CustomerDetailsPage />} />
                                    <Route path="/orders" element={<OrdersPage />} />
                                    <Route path="/transactions" element={<TransactionsPage />} />
                                    <Route path="/analytics" element={<AnalyticsPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/team" element={<TeamPage />} />
                                    <Route path="/billing" element={<BillingPage />} />
                                    <Route path="/health" element={<HealthPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="/help" element={<HelpCenterPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                  </Routes>
                                </Suspense>
                              </div>
                            </main>
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                </Suspense>

                {/* Global command palette (⌘K / Ctrl+K) — needs Router context */}
                <GlobalSearch />
              </Router>
              </SearchProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  className:
                    '!bg-white !text-slate-800 dark:!bg-slate-800 dark:!text-slate-100 !border !border-slate-200 dark:!border-slate-700',
                }}
              />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}