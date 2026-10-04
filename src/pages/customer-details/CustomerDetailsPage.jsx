import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Globe,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  Clock,
  TrendingUp,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Terminal,
  Activity,
  Send,
  Lock,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

/* =========================
   Status Badge
========================= */

const StatusBadge = ({ status }) => {
  const styles = {
    Active:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
    'At Risk':
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    Onboarding:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    Churned:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
    Inactive:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Inactive
        }`}
    >
      {status}
    </span>
  );
};

/* =========================
   Stat Card
========================= */

const StatCard = ({ label, value, subValue, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
      </div>

      {trend !== undefined && trend !== null && (
        <span
          className={`flex items-center text-xs font-medium ${trend > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : trend < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
        >
          {trend > 0 ? (
            <ArrowUpRight className="w-3 h-3 mr-1" />
          ) : trend < 0 ? (
            <ArrowDownRight className="w-3 h-3 mr-1" />
          ) : null}

          {trend > 0 ? '+' : ''}
          {trend}%
        </span>
      )}
    </div>

    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </h3>

        {subValue && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {subValue}
          </span>
        )}
      </div>
    </div>
  </div>
);

/* =========================
   Billing Section
========================= */

const BillingSection = () => {
  const invoices = [
    {
      id: 'INV-9902',
      date: 'Sep 18, 2026',
      amount: '$1,200.00',
      status: 'Paid',
    },
    {
      id: 'INV-9841',
      date: 'Aug 18, 2026',
      amount: '$1,200.00',
      status: 'Paid',
    },
    {
      id: 'INV-9710',
      date: 'Jul 18, 2026',
      amount: '$1,200.00',
      status: 'Overdue',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment History */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Payment History
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Recent invoices and payments
                </p>
              </div>

              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                View All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Invoice
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>

                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {invoice.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {invoice.date}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {invoice.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${invoice.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current Plan
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Enterprise
              </h3>
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Monthly Cost
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                $1,200
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Billing Cycle
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Monthly
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Next Billing
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Oct 18, 2026
              </span>
            </div>
          </div>

          <button className="w-full mt-6 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            Manage Plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Payment Method
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Default payment method for this customer
            </p>
          </div>

          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Update
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="w-12 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-slate-500" />
          </div>

          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              •••• •••• •••• 4242
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Visa · Expires 12/28
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Technical Section
========================= */

const TechnicalSection = () => {
  const securityItems = [
    {
      label: 'Two-Factor Auth',
      status: 'Enabled',
      icon: ShieldCheck,
    },
    {
      label: 'SSO Integration',
      status: 'Pending',
      icon: Lock,
    },
    {
      label: 'Data Encryption',
      status: 'Active',
      icon: ShieldCheck,
    },
    {
      label: 'Audit Logging',
      status: 'Enabled',
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* API Configuration */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              API Configuration
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Integration credentials and endpoints
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              API Key
            </label>

            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3">
              <code className="text-sm text-slate-700 dark:text-slate-300">
                sk_live_********************8f2d
              </code>

              <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Reveal
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Webhook URL
            </label>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3">
              <Globe className="w-4 h-4 text-slate-400" />

              <code className="text-sm text-slate-700 dark:text-slate-300 break-all">
                https://nexusflow.ai/webhooks/main
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Security
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Account security status
        </p>

        <div className="mt-6 space-y-4">
          {securityItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500" />

                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>

                <span
                  className={`text-xs font-medium ${item.status === 'Pending'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Health */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              System Health
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Current integration health
            </p>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium">Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              API Uptime
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              99.98%
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Avg. Response Time
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              142ms
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Requests Today
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              18,429
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Communication Section
========================= */

const CommunicationSection = () => {
  const messages = [
    {
      id: 'msg-1',
      date: 'Sep 20, 2026',
      channel: 'Email',
      subject: 'Q3 Review Meeting',
      status: 'Read',
      type: 'Outbound',
    },
    {
      id: 'msg-2',
      date: 'Sep 15, 2026',
      channel: 'Slack',
      subject: 'API Integration Question',
      status: 'Replied',
      type: 'Inbound',
    },
    {
      id: 'msg-3',
      date: 'Sep 10, 2026',
      channel: 'Zoom',
      subject: 'Onboarding Call',
      status: 'Completed',
      type: 'Outbound',
    },
  ];

  const preferences = [
    {
      label: 'Email',
      value: 'Preferred',
      icon: Mail,
    },
    {
      label: 'Slack',
      value: 'Enabled',
      icon: MessageSquare,
    },
    {
      label: 'Phone',
      value: 'Enabled',
      icon: Phone,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Communication History */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Communication History
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recent customer communication
          </p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {message.channel === 'Email' ? (
                      <Mail className="w-5 h-5 text-slate-500" />
                    ) : message.channel === 'Slack' ? (
                      <MessageSquare className="w-5 h-5 text-slate-500" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {message.subject}
                      </h4>

                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {message.type}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {message.channel} · {message.date}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {message.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Preferences */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Contact Preferences
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Preferred communication channels
          </p>

          <div className="mt-6 space-y-4">
            {preferences.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />

                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Event */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" />

            <span className="text-sm font-medium">Upcoming Event</span>
          </div>

          <h3 className="text-xl font-semibold mt-4">
            Quarterly Review
          </h3>

          <p className="text-indigo-100 text-sm mt-2">
            Sep 25, 2026 · 10:00 AM
          </p>

          <p className="text-indigo-100 text-sm mt-1">
            Zoom Meeting
          </p>

          <button className="mt-5 w-full px-4 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            View Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Customer Details Page
========================= */

export default function CustomerDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { customers } = useData();

  const [activeTab, setActiveTab] = useState('overview');

  const customer = customers?.find(
    (item) => String(item.id) === String(id)
  );

  /* =========================
     Fallback Customer
  ========================= */

  const fallbackCustomer = {
    name: 'Alexander Wright',
    company: 'Nexus Flow AI',
    email: 'a.wright@nexusflow.ai',
    phone: '+1 (555) 123-4567',
    status: 'Active',
    healthScore: 84,
    plan: 'Enterprise',
    memberSince: 'Oct 2023',
    metrics: {
      usage: {
        current: 1240,
        limit: 2000,
      },
      nps: 9,
      lastLogin: '2 hours ago',
      openTickets: 2,
    },
    activities: [
      {
        id: 'activity-1',
        type: 'support',
        title: 'API Integration Issue',
        description:
          'Customer reported 500 errors on /v1/deploy endpoint',
        timestamp: '2026-09-20T14:30:00Z',
        status: 'completed',
      },
      {
        id: 'activity-2',
        type: 'billing',
        title: 'Invoice #INV-9902 Paid',
        description:
          'Monthly subscription payment processed successfully',
        timestamp: '2026-09-18T09:15:00Z',
        status: 'completed',
      },
      {
        id: 'activity-3',
        type: 'usage',
        title: 'Usage Spike Detected',
        description:
          'Unexpected 40% increase in request volume over last 24h',
        timestamp: '2026-09-17T11:00:00Z',
        status: 'alert',
      },
    ],
  };

  const customerData = customer
    ? {
      ...customer,
      metrics: customer.metrics || fallbackCustomer.metrics,
      activities: customer.activities || fallbackCustomer.activities,
    }
    : fallbackCustomer;

  const {
    name,
    company,
    email,
    phone,
    status,
    healthScore,
    plan,
    memberSince,
    metrics,
    activities,
  } = customerData;

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
    },
    {
      id: 'technical',
      label: 'Technical',
      icon: Terminal,
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
    },
  ];

  const usagePercentage =
    metrics?.usage?.limit > 0
      ? Math.round((metrics.usage.current / metrics.usage.limit) * 100)
      : 0;

  return (
    // <main> already provides the page padding, background and scroll
    // container — don't repeat them here (that's what pushed the content in).
    <div>
      <div>
        {/* =========================
            Header
        ========================= */}

        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </button>

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {name
                    ?.split(' ')
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    {name}
                  </h1>

                  <StatusBadge status={status} />
                </div>

                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {company}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    {email}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                    {phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Settings className="w-4 h-4" />
                Manage
              </button>

              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Send className="w-4 h-4" />
                Quick Action
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            Tabs
        ========================= */}

        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================
            Content
        ========================= */}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <StatCard
                label="Health Score"
                value={`${healthScore || 0}%`}
                icon={TrendingUp}
                trend={5}
              />

              <StatCard
                label="Monthly Usage"
                value={metrics?.usage?.current?.toLocaleString() || 0}
                subValue={`/ ${metrics?.usage?.limit?.toLocaleString() || 0}`}
                icon={Activity}
                trend={12}
              />

              <StatCard
                label="NPS Score"
                value={metrics?.nps ?? 0}
                subValue="/ 10"
                icon={MessageSquare}
                trend={0}
              />

              <StatCard
                label="Open Tickets"
                value={metrics?.openTickets ?? 0}
                icon={AlertCircle}
                trend={-2}
              />
            </div>

            {/* Main Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Recent Activity
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Latest customer events
                    </p>
                  </div>

                  <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div
                        className={`p-2.5 rounded-lg ${activity.status === 'alert'
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                      >
                        {activity.type === 'billing' ? (
                          <CreditCard className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        ) : activity.type === 'usage' ? (
                          <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {activity.title}
                            </h4>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {activity.description}
                            </p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Context */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Customer Context
                  </h3>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        Plan
                      </p>

                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {plan || 'Enterprise'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        Member Since
                      </p>

                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {memberSince || 'Oct 2023'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        Last Login
                      </p>

                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {metrics?.lastLogin || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Usage
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Current monthly usage
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {usagePercentage}%
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{
                          width: `${Math.min(usagePercentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
                      <span>
                        {metrics?.usage?.current?.toLocaleString() || 0}{' '}
                        requests
                      </span>

                      <span>
                        {metrics?.usage?.limit?.toLocaleString() || 0} limit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Opportunity */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />

                    <span className="text-sm font-medium text-indigo-100">
                      Growth Opportunity
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mt-3">
                    Customer usage is trending upward
                  </h3>

                  <p className="text-indigo-100 mt-2 max-w-2xl">
                    Usage has increased significantly over the last few weeks.
                    Consider discussing additional capacity or expanding the
                    current plan.
                  </p>
                </div>

                <button className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                  Review Opportunity
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && <BillingSection />}

        {activeTab === 'technical' && <TechnicalSection />}

        {activeTab === 'communication' && <CommunicationSection />}
      </div>
    </div>
  );
}