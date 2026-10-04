import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingCart, BarChart3, Settings, HelpCircle,
  LogOut, X, ReceiptText, FileText, UserPlus, CreditCard, HeartPulse,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './UserMenu';

const SECTIONS = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Overview', to: '/' },
      { icon: Users, label: 'Customers', to: '/customers' },
      { icon: ShoppingCart, label: 'Orders', to: '/orders' },
      { icon: ReceiptText, label: 'Transactions', to: '/transactions' },
      { icon: BarChart3, label: 'Analytics', to: '/analytics' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: FileText, label: 'Reports', to: '/reports' },
      { icon: UserPlus, label: 'Team', to: '/team' },
      { icon: CreditCard, label: 'Billing', to: '/billing' },
      { icon: HeartPulse, label: 'Health', to: '/health' },
      { icon: Settings, label: 'Settings', to: '/settings' },
      { icon: HelpCircle, label: 'Help Center', to: '/help' },
    ],
  },
];

/** True when `to` is the active route (handles nested paths like /customers/3). */
function isActiveRoute(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

function MenuItem({ icon: Icon, label, to, onClick, active = false, collapsed = false, onNavigate }) {
  const base =
    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';

  const styles = active
    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100';

  const content = (
    <>
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
      )}
      <Icon size={19} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${styles} w-full`}
        title={collapsed ? label : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={to} onClick={onNavigate} className={`${base} ${styles}`} title={collapsed ? label : undefined}>
      {content}
    </Link>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900',
          'border-r border-slate-200 dark:border-slate-800',
          'transition-all duration-300 ease-in-out w-64',
          'lg:relative lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div
          className={`flex items-center h-16 px-4 border-b border-slate-100 dark:border-slate-800 ${
            collapsed ? 'lg:justify-center' : 'justify-between'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 min-w-0" onClick={onClose}>
            <span className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/25">
              D
            </span>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                DashCore
              </span>
            )}
          </Link>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <MenuItem
                    key={item.to}
                    {...item}
                    collapsed={collapsed}
                    active={isActiveRoute(location.pathname, item.to)}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-1">
              <Avatar name={user.name} size={34} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
          )}

          <MenuItem icon={LogOut} label="Logout" onClick={handleLogout} collapsed={collapsed} />

          {/* Collapse toggle (desktop only) */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
