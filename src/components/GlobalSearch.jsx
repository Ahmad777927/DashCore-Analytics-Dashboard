import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, Users, ShoppingCart, ReceiptText,
  ArrowRight, CornerDownLeft, X, Loader2,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useData } from '../context/DataContext';
import { api } from '../services/api';
import { buildSearchIndex, searchIndex } from '../utils/searchIndex';
import { inputLgIconBoth } from './formStyles';

/* ------------------------------------------------------------------ */
/* Type metadata: icon + colours per search-result category            */
/* ------------------------------------------------------------------ */

const TYPE_META = {
  page: {
    icon: LayoutDashboard,
    label: 'Pages',
    chip: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  },
  customer: {
    icon: Users,
    label: 'Customers',
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  },
  order: {
    icon: ShoppingCart,
    label: 'Orders',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  },
  transaction: {
    icon: ReceiptText,
    label: 'Transactions',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
};

export const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Global command palette shared across the whole dashboard. */
export default function GlobalSearch() {
  const { isOpen, toggle, close } = useSearch();

  /* ---------------- ⌘K / Ctrl+K global shortcut ---------------- */
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key?.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  // Mounting the dialog only while open means its local state (query, active
  // row, …) resets naturally on every open — no reset effect required.
  if (!isOpen) return null;

  return <SearchDialog onClose={close} />;
}

function SearchDialog({ onClose }) {
  const { customers, orders, setCustomers, setOrders } = useData();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  /* ---------------- Focus the input + lock body scroll ---------------- */
  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = '';
    };
  }, []);

  /* ---------------- Hydrate live data once ---------------- */
  useEffect(() => {
    let active = true;

    (async () => {
      setIsSyncing(true);
      try {
        const [customerData, orderData] = await Promise.all([
          customers.length ? Promise.resolve(customers) : api.getCustomers(),
          orders.length ? Promise.resolve(orders) : api.getOrders(),
        ]);
        if (!active) return;
        if (Array.isArray(customerData) && customerData.length) setCustomers(customerData);
        if (Array.isArray(orderData) && orderData.length) setOrders(orderData);
      } catch {
        // Offline / API failure -> search still works over static targets.
      } finally {
        if (active) setIsSyncing(false);
      }
    })();

    return () => {
      active = false;
    };
    // Intentionally runs once per open; live data is read from the initial snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Build + run the search ---------------- */
  const index = useMemo(() => buildSearchIndex({ customers, orders }), [customers, orders]);
  const results = useMemo(() => searchIndex(index, query), [index, query]);

  // Reset the highlight whenever the query changes (done in the input handler
  // so we don't need an extra effect + render pass).
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setActiveIndex(0);
  }, []);

  // Keep the active row scrolled into view.
  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (item) => {
      if (!item) return;
      onClose();
      navigate(item.path);
    },
    [onClose, navigate]
  );

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl mt-0 sm:mt-16 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search input — uses the shared `inputLgIconBoth` style so the modal
            field matches every other search field in the app (surface, focus
            ring, dark-mode colours). The old borderless input picked up the
            global `:focus-visible` outline around just the text area, which
            looked like a stray box inside the header. */}
        <div className="flex items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search pages, customers, orders, transactions…"
              className={inputLgIconBoth}
              aria-label="Search query"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {/* One trailing slot inside the field: spinner while the data
                snapshot hydrates, otherwise a clear button. */}
            {isSyncing ? (
              <Loader2
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
              />
            ) : (
              query && (
                <button
                  type="button"
                  onClick={() => {
                    handleQueryChange('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600 dark:hover:bg-slate-700/70 dark:hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        <ResultList
          results={results}
          query={query}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelect={handleSelect}
          listRef={listRef}
        />

        {/* Keyboard hints */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>
                <CornerDownLeft size={10} />
              </Kbd>
              open
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result list                                                         */
/* ------------------------------------------------------------------ */

function ResultList({ results, query, activeIndex, setActiveIndex, onSelect, listRef }) {
  if (!query.trim()) {
    return <QuickLinks onSelect={onSelect} />;
  }

  if (results.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          No results for “{query}”
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try a customer name, an order ID or a page like “billing”.
        </p>
      </div>
    );
  }

  return (
    <ul ref={listRef} className="overflow-y-auto py-2 flex-1" role="listbox">
      {results.map((item, i) => {
        const meta = TYPE_META[item.type] || TYPE_META.page;
        const Icon = item.icon || meta.icon;
        const isActive = i === activeIndex;

        return (
          <li key={item.id} role="option" aria-selected={isActive}>
            <button
              type="button"
              data-active={isActive}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => onSelect(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${meta.chip}`}>
                <Icon size={16} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.sublabel}
                  </span>
                )}
              </span>

              <span className="hidden sm:flex items-center gap-2 shrink-0">
                {item.meta && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">{item.meta}</span>
                )}
                <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 dark:text-slate-500">
                  {meta.label}
                </span>
              </span>

              <ArrowRight
                size={14}
                className={`shrink-0 transition-opacity ${
                  isActive ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'
                }`}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Quick links shown before the user types                             */
/* ------------------------------------------------------------------ */

function QuickLinks({ onSelect }) {
  const { customers, orders } = useData();

  const suggestions = [
    { id: 'quick-customers', label: 'Customers', sublabel: `${customers.length} records`, path: '/customers', icon: Users },
    { id: 'quick-orders', label: 'Orders', sublabel: `${orders.length} records`, path: '/orders', icon: ShoppingCart },
    { id: 'quick-analytics', label: 'Analytics', sublabel: 'Charts & insights', path: '/analytics', icon: LayoutDashboard },
    { id: 'quick-billing', label: 'Billing', sublabel: 'Plans & invoices', path: '/billing', icon: ReceiptText },
  ];

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Quick links
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors text-left"
            >
              <span className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                  {item.sublabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small Kbd chip                                                      */
/* ------------------------------------------------------------------ */

export function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/* Triggers                                                            */
/* ------------------------------------------------------------------ */

/** Full-width search box used on desktop / tablet. */
export function SearchTrigger() {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={open}
      className="hidden md:flex items-center gap-3 w-full max-w-md pl-3 pr-2 py-2 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-sm text-slate-500 dark:text-slate-400 transition-colors"
      aria-label="Open global search"
    >
      <Search size={17} />
      <span className="flex-1 text-left">Search…</span>
      <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
      <Kbd>K</Kbd>
    </button>
  );
}

/** Icon-only trigger for small screens. */
export function SearchIconTrigger() {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={open}
      className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Open global search"
    >
      <Search size={20} />
    </button>
  );
}