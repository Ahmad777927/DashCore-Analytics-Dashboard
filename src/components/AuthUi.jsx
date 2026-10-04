import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { inputIcon, inputIconBoth, label as labelClass } from './formStyles';

/* ------------------------------------------------------------------ */
/* Shared building blocks for the auth screens (login, forgot / reset  */
/* password). Extracted from LoginPage so every auth screen renders    */
/* inside the same shell and follows the dashboard light/dark theme.   */
/* ------------------------------------------------------------------ */

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
];

export function usePasswordStrength(password) {
  return useMemo(() => {
    const results = RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));
    const score = results.filter((r) => r.passed).length;
    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = [
      'bg-slate-300 dark:bg-slate-700',
      'bg-red-500',
      'bg-amber-500',
      'bg-blue-500',
      'bg-emerald-500',
    ];
    return { results, score, label: labels[score], color: colors[score] };
  }, [password]);
}

/* Auth inputs always render a leading icon, so they use the icon variant. */
export const inputClass = inputIcon;

/* Same, but leaves room on the right for a show/hide password toggle. */
export const inputIconWithToggle = inputIconBoth;

export function Field({ icon: Icon, label, children }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        {children}
      </div>
    </div>
  );
}

export function PasswordMeter({ strength }) {
  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">Password strength</span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {strength.label}
        </span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {strength.results.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-1.5 text-xs ${
              rule.passed
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {rule.passed ? <Check size={13} /> : <X size={13} />}
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}


export function MobileBrand() {
  return (
    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/25">
        D
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        DashCore
      </span>
    </div>
  );
}

function BrandPanel() {
  const perks = [
    'Real-time analytics',
    'Customer & order management',
    'Team collaboration',
    'Enterprise-grade security',
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white">
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-xl font-bold ring-1 ring-white/25">
            D
          </div>
          <span className="text-xl font-bold tracking-tight">DashCore</span>
        </div>

        <div className="space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Everything you need to run your business.
          </h2>
          <p className="text-white/80 leading-relaxed">
            Track revenue, manage customers, monitor orders and keep your whole team aligned — all
            from one beautifully simple dashboard.
          </p>
          <ul className="space-y-3 pt-2">
            {perks.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                <span className="h-6 w-6 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/25">
                  <Check size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} DashCore. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/**
 * Full-page shell used by every auth screen: theme-aware background,
 * desktop brand panel, theme toggle and a centered content column.
 */
export function AuthScreen({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
