import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import HeaderWithNotificationModal from './HeaderWithNotificationModal';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { SearchTrigger, SearchIconTrigger } from './GlobalSearch';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New order #1042 received',
    description: 'Sarah Connor placed an order for $250.00',
    time: '5m ago',
    read: false,
    type: 'order',
    amount: '$250.00',
    link: '/orders',
  },
  {
    id: 2,
    title: 'New customer signed up',
    description: 'Kyle Reese created an enterprise account',
    time: '45m ago',
    read: false,
    type: 'user',
    tag: 'Enterprise',
    link: '/customers',
  },
  {
    id: 3,
    title: 'Payment confirmed',
    description: 'Invoice #8892 ($500.00) completed by Rick Deckard',
    time: '2h ago',
    read: false,
    type: 'payment',
    amount: '$500.00',
    link: '/transactions',
  },
  {
    id: 4,
    title: 'Low inventory alert',
    description: 'Wireless noise-canceling headphones are running low',
    time: '1d ago',
    read: true,
    type: 'alert',
    tag: 'Warning',
    link: '/orders',
  },
];

export default function Navbar({ onMenuClick }) {
  const [showModal, setShowModal] = useState(false); // Controls the notification dropdown
  const notificationRef = useRef(null);

  // Maintain notifications state and persist in localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dashboard_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleAddNotification = (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleResetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  // Close the notification dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!showModal) return;

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  return (
    <>
      {/* --------- Header background & left menu button ---------- */}
      <header className="relative z-30 h-16 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 px-4 md:px-8">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Global search: full box on md+, icon on small screens */}
          <SearchTrigger />
          <SearchIconTrigger />
        </div>

        {/* ---------- Action area (theme, notifications, user) ---------- */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Dark / Light mode toggle */}
          <ThemeToggle />

          {/* Notification bell & dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowModal((prev) => !prev)}
              className={`relative p-2 rounded-xl transition-all duration-200 ${showModal
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 ring-2 ring-blue-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              title="Show notifications"
              aria-label="Notifications"
              aria-expanded={showModal}
            >
              <Bell size={20} />

              {/* Notification count badge - only displayed when there are unread messages */}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold leading-none ring-2 ring-white dark:ring-slate-900 shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown positioned directly below bell icon */}
            <HeaderWithNotificationModal
              show={showModal}
              onClose={() => setShowModal(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onToggleRead={handleToggleRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
              onResetNotifications={handleResetNotifications}
              onAddNotification={handleAddNotification}
            />
          </div>

          {/* Horizontal divider */}
          <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          {/* User avatar / menu */}
          <UserMenu />
        </div>
      </header>
    </>
  );
}
