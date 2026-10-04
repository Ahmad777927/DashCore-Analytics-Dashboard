import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  ShoppingBag,
  DollarSign,
  Users,
  AlertTriangle,
  Bell,
  Trash2,
  CheckCheck,
  RotateCcw,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { inputSmIcon } from './formStyles';

/**
 * Top Dashboard Panel Color Scheme:
 * - Orders    -> Royal Blue    (matches Total Revenue / Sales)
 * - Customers -> Vibrant Purple (matches Active Users)
 * - Payments  -> Emerald Green (matches Avg. Session / Revenue)
 * - Alerts    -> Amber Orange  (matches Total Sales / System alerts)
 */
const NOTIFICATION_CONFIG = {
  order: {
    icon: ShoppingBag,
    gradient: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    badge: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200/80 dark:border-blue-800/60',
    tag: 'Order',
    dot: 'bg-blue-600 dark:bg-blue-400 ring-blue-100 dark:ring-blue-950',
    defaultLink: '/orders',
  },
  user: {
    icon: Users,
    gradient: 'from-purple-500 to-indigo-600 shadow-purple-500/25',
    badge: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border-purple-200/80 dark:border-purple-800/60',
    tag: 'Customer',
    dot: 'bg-purple-600 dark:bg-purple-400 ring-purple-100 dark:ring-purple-950',
    defaultLink: '/customers',
  },
  payment: {
    icon: DollarSign,
    gradient: 'from-emerald-500 to-green-600 shadow-emerald-500/25',
    badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200/80 dark:border-emerald-800/60',
    tag: 'Payment',
    dot: 'bg-emerald-600 dark:bg-emerald-400 ring-emerald-100 dark:ring-emerald-950',
    defaultLink: '/transactions',
  },
  alert: {
    icon: AlertTriangle,
    gradient: 'from-amber-500 to-orange-600 shadow-orange-500/25',
    badge: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border-amber-200/80 dark:border-amber-800/60',
    tag: 'Alert',
    dot: 'bg-orange-600 dark:bg-orange-400 ring-orange-100 dark:ring-orange-950',
    defaultLink: '/health',
  },
};

const getConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || {
    icon: Bell,
    gradient: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    badge: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200/80 dark:border-blue-800/60',
    tag: 'Update',
    dot: 'bg-blue-600 dark:bg-blue-400 ring-blue-100 dark:ring-blue-950',
    defaultLink: '/',
  };
};

export default function HeaderWithNotificationModal({
  show,
  onClose,
  notifications = [],
  onMarkAsRead,
  onToggleRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onResetNotifications,
  onAddNotification,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'order' | 'payment' | 'user' | 'alert'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtered notifications based on activeTab and searchQuery (unconditional Hook)
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab === 'unread' && item.read) return false;
      if (
        ['order', 'payment', 'user', 'alert'].includes(activeTab) &&
        item.type !== activeTab
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesTag = getConfig(item.type).tag.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  if (!show) return null;

  const handleMarkAllRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
      toast.success('All notifications marked as read', { id: 'mark-all-read' });
    }
  };

  const handleSimulateAlert = () => {
    if (onAddNotification) {
      const demoPool = [
        {
          id: Date.now(),
          title: `New order #${Math.floor(1050 + Math.random() * 50)} received`,
          description: 'Instant checkout completed by John Matrix for $349.00',
          time: 'Just now',
          read: false,
          type: 'order',
          amount: '$349.00',
          link: '/orders',
        },
        {
          id: Date.now(),
          title: 'Premium subscription active',
          description: 'Cyberdyne AI upgraded to Annual Business plan',
          time: 'Just now',
          read: false,
          type: 'payment',
          amount: '$1,200.00',
          link: '/transactions',
        },
        {
          id: Date.now(),
          title: 'New customer registration',
          description: 'Sarah Walker registered from United Kingdom',
          time: 'Just now',
          read: false,
          type: 'user',
          tag: 'Pro Member',
          link: '/customers',
        },
        {
          id: Date.now(),
          title: 'Server threshold alert',
          description: 'API latency surged to 240ms on EU-West cluster',
          time: 'Just now',
          read: false,
          type: 'alert',
          tag: 'Warning',
          link: '/health',
        },
      ];
      const randomItem = demoPool[Math.floor(Math.random() * demoPool.length)];
      onAddNotification(randomItem);
      toast('🔔 New live notification received!', { icon: '✨' });
    }
  };

  const handleItemClick = (item) => {
    // If unread, mark as read
    if (!item.read && onMarkAsRead) {
      onMarkAsRead(item.id);
    }
    // Navigate if has link
    const targetLink = item.link || getConfig(item.type).defaultLink;
    if (targetLink) {
      onClose();
      navigate(targetLink);
    }
  };

  return (
    <div
      className="absolute right-0 top-full mt-3 w-92 sm:w-[420px] max-w-[calc(100vw-1.5rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-950/20 dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-3 duration-200"
      role="dialog"
      aria-label="Notifications"
    >
      {/* Eye-catching ambient top stripe with dashboard stat colors */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 via-emerald-500 to-orange-500" />

      {/* Header bar */}
      <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/70 to-white/40 dark:from-slate-800/60 dark:to-slate-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
              <Bell size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                  Notifications
                </h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 animate-pulse">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                    All caught up
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-colors ${showSearch
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              title="Search notifications"
            >
              <Search size={16} />
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Collapsible search bar */}
        {showSearch && (
          <div className="mt-3 relative animate-in fade-in slide-in-from-top-1 duration-150">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter alerts, orders, customers..."
              className={inputSmIcon}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Filter categories tabs with dashboard palette indicators */}
        <div className="flex items-center gap-1.5 mt-3 pt-1 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'unread'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'unread'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500 text-white'
                  }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'order'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Orders
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'payment'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Payments
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'user'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Customers
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alert')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'alert'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Alerts
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-inner">
              {activeTab === 'unread' ? (
                <Sparkles size={24} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Bell size={24} />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {activeTab === 'unread'
                  ? 'All Caught Up!'
                  : searchQuery
                    ? `No matches for "${searchQuery}"`
                    : 'No notifications in this view'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                {activeTab === 'unread'
                  ? 'There are no unread notifications waiting for your review.'
                  : 'Try changing your category filters or trigger a live demo notification.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSimulateAlert}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 transition-all hover:scale-102"
              >
                <PlusCircle size={13} />
                <span>Simulate Demo Alert</span>
              </button>
              {onResetNotifications && (
                <button
                  type="button"
                  onClick={() => {
                    onResetNotifications();
                    toast.success('Demo notifications restored!');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const config = getConfig(item.type);
            const Icon = config.icon;
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group relative flex items-start gap-3.5 p-4 transition-all duration-150 cursor-pointer border-l-4 ${isUnread
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/35'
                    : 'border-transparent hover:bg-slate-50/90 dark:hover:bg-slate-800/50'
                  }`}
              >
                {/* Modern StatCard-style Gradient Icon Box */}
                <div
                  className={`p-2.5 rounded-2xl shrink-0 text-white bg-gradient-to-br ${config.gradient} shadow-md flex items-center justify-center transition-transform group-hover:scale-105`}
                >
                  <Icon size={18} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.badge}`}
                      >
                        {config.tag}
                      </span>
                      {item.amount && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                          {item.amount}
                        </span>
                      )}
                      {item.tag && (
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-snug truncate ${isUnread
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'font-medium text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      <span>View details</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>

                {/* Status Indicator & Hover Actions */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  {/* Indicator Dot */}
                  {isUnread ? (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-white dark:ring-slate-900 shadow-sm`}
                      title="Unread notification"
                    />
                  ) : (
                    <span className="w-2.5 h-2.5" />
                  )}

                  {/* Action Icons */}
                  <div className="flex items-center gap-1 mt-auto">
                    {onToggleRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead(item.id);
                          toast.success(
                            item.read
                              ? 'Marked as unread'
                              : 'Marked as read'
                          );
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-all"
                        title={item.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        <Check size={13} />
                      </button>
                    )}

                    {onDeleteNotification && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(item.id);
                          toast.success('Notification removed');
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                        title="Delete notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modern footer with quick actions */}
      <div className="p-3 bg-slate-50/90 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulateAlert}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            title="Simulate a real-time incoming notification"
          >
            <PlusCircle size={13} />
            <span>Simulate Alert</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/settings');
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
            title="Notification Preferences"
          >
            <Settings size={12} />
            <span>Preferences</span>
          </button>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            Mark all read
          </button>
        ) : (
          onResetNotifications && (
            <button
              type="button"
              onClick={() => {
                onResetNotifications();
                toast.success('Demo notifications restored!');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Reset demo data"
            >
              Reset
            </button>
          )
        )}
      </div>
    </div>
  );
}