import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Plus,
  Trash2,
  X,
  Check,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { input, inputSm, selectSm, checkbox, label as labelClass } from '../components/formStyles';

const INITIAL_PAYMENT_METHODS = [
  {
    id: 'pm-1',
    brand: 'Visa',
    last4: '4242',
    expMonth: '08',
    expYear: '28',
    isDefault: true,
    cardholder: 'Alex Johnson',
  },
  {
    id: 'pm-2',
    brand: 'Mastercard',
    last4: '8892',
    expMonth: '11',
    expYear: '27',
    isDefault: false,
    cardholder: 'Alex Johnson',
  },
];

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-009',
    date: 'Sep 01, 2026',
    amount: '$149.00',
    plan: 'Enterprise Pro (Monthly)',
    status: 'Paid',
    method: 'Visa •••• 4242',
  },
  {
    id: 'INV-2026-008',
    date: 'Aug 01, 2026',
    amount: '$149.00',
    plan: 'Enterprise Pro (Monthly)',
    status: 'Paid',
    method: 'Visa •••• 4242',
  },
  {
    id: 'INV-2026-007',
    date: 'Jul 01, 2026',
    amount: '$149.00',
    plan: 'Enterprise Pro (Monthly)',
    status: 'Paid',
    method: 'Visa •••• 4242',
  },
  {
    id: 'INV-2026-006',
    date: 'Jun 01, 2026',
    amount: '$79.00',
    plan: 'Professional Plan (Monthly)',
    status: 'Paid',
    method: 'Visa •••• 4242',
  },
  {
    id: 'INV-2026-005',
    date: 'May 01, 2026',
    amount: '$79.00',
    plan: 'Professional Plan (Monthly)',
    status: 'Paid',
    method: 'Visa •••• 4242',
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('Enterprise');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENT_METHODS);
  const [invoices] = useState(INITIAL_INVOICES);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isSwitchTierOpen, setIsSwitchTierOpen] = useState(false);
  const [targetTier, setTargetTier] = useState(null);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // New card form
  const [newCard, setNewCard] = useState({
    cardholder: '',
    cardNumber: '',
    expMonth: '12',
    expYear: '28',
    cvc: '',
    setAsDefault: false,
  });

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Downloading tax invoice ${invoice.id} (${invoice.amount})...`, {
      icon: '📄',
      id: `invoice-${invoice.id}`,
    });
  };

  const handleSetDefaultMethod = (id) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    );
    toast.success('Default payment method updated!');
  };

  const handleDeleteCardClick = (pm) => {
    if (pm.isDefault && paymentMethods.length > 1) {
      toast.error('Please assign another default payment method before deleting this card.');
      return;
    }
    setMethodToDelete(pm);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteCard = () => {
    if (methodToDelete) {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== methodToDelete.id));
      toast.success(`${methodToDelete.brand} ending in ${methodToDelete.last4} removed.`);
      setMethodToDelete(null);
    }
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = newCard.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }

    const brand = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : 'Amex';
    const last4 = cleanNum.slice(-4);

    const created = {
      id: `pm-${Date.now()}`,
      brand,
      last4,
      expMonth: newCard.expMonth,
      expYear: newCard.expYear,
      isDefault: newCard.setAsDefault || paymentMethods.length === 0,
      cardholder: newCard.cardholder || 'Alex Johnson',
    };

    if (created.isDefault) {
      setPaymentMethods((prev) => [
        created,
        ...prev.map((p) => ({ ...p, isDefault: false })),
      ]);
    } else {
      setPaymentMethods((prev) => [...prev, created]);
    }

    setIsAddCardOpen(false);
    setNewCard({
      cardholder: '',
      cardNumber: '',
      expMonth: '12',
      expYear: '28',
      cvc: '',
      setAsDefault: false,
    });
    toast.success(`${brand} ending in ${last4} added successfully!`, { icon: '💳' });
  };

  const handlePlanSwitch = (tierName) => {
    setTargetTier(tierName);
    setIsSwitchTierOpen(true);
  };

  const confirmPlanSwitch = () => {
    if (targetTier) {
      setCurrentPlan(targetTier);
      toast.success(`Successfully switched subscription to ${targetTier} plan!`, {
        icon: '🚀',
      });
      setIsSwitchTierOpen(false);
      setTargetTier(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Subscription & Invoicing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review your active plan, manage payment methods, and download historical invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${billingCycle === 'annual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            <span>Annual (Save 20%)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>

      {/* Hero Active Plan Card */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-950/20 overflow-hidden border border-blue-800/40">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Active Tier
              </span>
              <span className="text-xs text-blue-200/80">Next billing date: Oct 15, 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              DashCore {currentPlan} Tier
            </h2>
            <p className="text-sm text-blue-200/80 mt-1 max-w-lg">
              Full workspace access, high-frequency webhooks, team collaboration seats, and priority SLA support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <div className="text-3xl font-extrabold">
                {billingCycle === 'annual' ? '$119' : '$149'}
                <span className="text-sm font-normal text-blue-200/70"> / month</span>
              </div>
              <p className="text-xs text-blue-200/60 mt-0.5">
                {billingCycle === 'annual' ? 'Billed annually ($1,428/yr)' : 'Billed monthly on the 15th'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handlePlanSwitch('Enterprise Plus')}
              className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg shadow-black/20 transition-all hover:scale-102 shrink-0"
            >
              Change Tier
            </button>
          </div>
        </div>

        {/* Quota Progress Meters */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          {/* Seat Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200 font-medium">Team Member Seats</span>
              <span className="font-bold">8 / 15 Used</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '53%' }} />
            </div>
          </div>

          {/* API Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200 font-medium">Monthly API Invocations</span>
              <span className="font-bold">820k / 1.0M</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          {/* Storage Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200 font-medium">Export Storage</span>
              <span className="font-bold">42.4 GB / 100 GB</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '42%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Selection Comparison Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Available Subscription Tiers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scale your data infrastructure as your user base and throughput expands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Starter
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                $29
                <span className="text-xs font-normal text-slate-400"> /mo</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Essential analytics for early-stage ventures and small apps.
              </p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>Up to 3 team members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>100,000 API calls / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>Standard CSV data export</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePlanSwitch('Starter')}
              className="w-full mt-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              Downgrade to Starter
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Professional
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                $79
                <span className="text-xs font-normal text-slate-400"> /mo</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Advanced reporting, custom cohorts, and automated schedules.
              </p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" />
                  <span>Up to 8 team members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" />
                  <span>500,000 API calls / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" />
                  <span>Automated recurring schedules</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePlanSwitch('Professional')}
              className="w-full mt-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              Switch to Professional
            </button>
          </div>

          {/* Enterprise Plan (Current) */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-600 dark:border-blue-500 p-6 flex flex-col justify-between shadow-lg shadow-blue-600/10">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white tracking-wider">
              Current Plan
            </span>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Enterprise
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                $149
                <span className="text-xs font-normal text-slate-400"> /mo</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Dedicated infrastructure, custom SLAs, and high volume throughput.
              </p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>15 team seats included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>1.0M API calls + unlimited exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600" />
                  <span>Dedicated customer success engineer</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="w-full mt-6 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold cursor-default"
            >
              Active Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Stored Payment Methods
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Credit cards and corporate payment options on file.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30 transition-colors"
          >
            <Plus size={14} />
            <span>Add Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${pm.isDefault
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-sm">
                  {pm.brand === 'Visa' ? 'VISA' : 'MC'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      •••• •••• •••• {pm.last4}
                    </p>
                    {pm.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-600 text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Expires {pm.expMonth}/{pm.expYear} • {pm.cardholder}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!pm.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultMethod(pm.id)}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteCardClick(pm)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove card"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Billing History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Invoice History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download tax receipts and audited transaction records.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.success('Exporting all historical receipts as ZIP...')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Download size={13} />
            <span>Export All (.ZIP)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Invoice ID</th>
                <th className="px-6 py-3.5">Billing Period</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white text-xs">
                    {inv.id}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{inv.plan}</p>
                    <p className="text-slate-400">{inv.date}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-xs">
                    {inv.amount}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {inv.method}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Check size={12} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(inv)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Download PDF receipt"
                    >
                      <Download size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Payment Method
                </h3>
              </div>
              <button
                onClick={() => setIsAddCardOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={newCard.cardholder}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardholder: e.target.value })
                  }
                  className={input}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4242 •••• •••• 4242"
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardNumber: e.target.value })
                  }
                  className={`${input} font-mono`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Month
                  </label>
                  <select
                    value={newCard.expMonth}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expMonth: e.target.value })
                    }
                    className={selectSm}
                  >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(
                      (m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Year
                  </label>
                  <select
                    value={newCard.expYear}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expYear: e.target.value })
                    }
                    className={selectSm}
                  >
                    {['26', '27', '28', '29', '30', '31'].map((y) => (
                      <option key={y} value={y}>
                        20{y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="123"
                    value={newCard.cvc}
                    onChange={(e) =>
                      setNewCard({ ...newCard, cvc: e.target.value })
                    }
                    className={`${inputSm} font-mono text-center`}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={newCard.setAsDefault}
                  onChange={(e) =>
                    setNewCard({ ...newCard, setAsDefault: e.target.checked })
                  }
                  className={checkbox}
                />
                <span>Set as default payment method</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Lock size={13} />
                  <span>Securely Save Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Switch Tier Confirmation Modal */}
      <ConfirmModal
        isOpen={isSwitchTierOpen}
        onClose={() => setIsSwitchTierOpen(false)}
        onConfirm={confirmPlanSwitch}
        title={`Switch to ${targetTier} Tier?`}
        message={`Your billing will automatically prorate and adjust to the ${targetTier} plan immediately.`}
      />

      {/* Delete Card Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteCard}
        title="Remove Payment Card?"
        message={`Are you sure you want to remove the ${methodToDelete?.brand} ending in ${methodToDelete?.last4}?`}
      />
    </div>
  );
}
