import {
  LayoutDashboard, Users, ShoppingCart, ReceiptText, BarChart3,
  FileText, UserPlus, CreditCard, HeartPulse, Settings, HelpCircle,
} from 'lucide-react';

/** Static navigation targets that are always searchable. */
export const PAGE_TARGETS = [
  { id: 'page-overview', type: 'page', label: 'Overview', path: '/', icon: LayoutDashboard, keywords: 'dashboard home summary kpi' },
  { id: 'page-customers', type: 'page', label: 'Customers', path: '/customers', icon: Users, keywords: 'clients users accounts crm' },
  { id: 'page-orders', type: 'page', label: 'Orders', path: '/orders', icon: ShoppingCart, keywords: 'purchases sales carts' },
  { id: 'page-transactions', type: 'page', label: 'Transactions', path: '/transactions', icon: ReceiptText, keywords: 'payments invoices billing history' },
  { id: 'page-analytics', type: 'page', label: 'Analytics', path: '/analytics', icon: BarChart3, keywords: 'charts reports metrics insights' },
  { id: 'page-reports', type: 'page', label: 'Reports', path: '/reports', icon: FileText, keywords: 'export csv pdf summaries' },
  { id: 'page-team', type: 'page', label: 'Team', path: '/team', icon: UserPlus, keywords: 'members employees staff invite' },
  { id: 'page-billing', type: 'page', label: 'Billing', path: '/billing', icon: CreditCard, keywords: 'plans invoice subscription payment' },
  { id: 'page-health', type: 'page', label: 'Health', path: '/health', icon: HeartPulse, keywords: 'status uptime system monitor' },
  { id: 'page-settings', type: 'page', label: 'Settings', path: '/settings', icon: Settings, keywords: 'preferences profile account config' },
  { id: 'page-help', type: 'page', label: 'Help Center', path: '/help', icon: HelpCircle, keywords: 'support faq documentation contact' },
];

/** Demo transaction rows (mirrors TransactionsPage) so search covers them. */
export const TRANSACTION_TARGETS = [
  { id: 'txn-1', user: 'Sarah Connor', action: 'Completed payment', amount: '$250.00', status: 'Completed', date: '2026-09-10' },
  { id: 'txn-2', user: 'Kyle Reese', action: 'New subscription', amount: '$49.00', status: 'Pending', date: '2026-09-12' },
  { id: 'txn-3', user: 'T-800', action: 'Refund requested', amount: '$120.00', status: 'Review', date: '2026-09-14' },
  { id: 'txn-4', user: 'Ellen Ripley', action: 'Payment failed', amount: '$15.00', status: 'Failed', date: '2026-09-15' },
  { id: 'txn-5', user: 'Rick Deckard', action: 'Completed payment', amount: '$500.00', status: 'Completed', date: '2026-09-15' },
];

/**
 * Normalise a string for fuzzy-ish matching:
 * lowercases, trims and collapses separators so "OR D-1 42" ~ "ord-142".
 */
export function normalize(value) {
  return String(value ?? '').toLowerCase().replace(/[\s_-]+/g, '');
}

/** Score a single candidate against a query (higher = better, 0 = no match). */
export function scoreMatch(haystack, needle) {
  const target = normalize(haystack);
  const query = normalize(needle);
  if (!query) return 0;
  if (target === query) return 100;
  if (target.startsWith(query)) return 70;
  if (target.includes(query)) return 40;
  return 0;
}

/**
 * Build the full searchable list from live data plus static targets.
 */
export function buildSearchIndex({ customers = [], orders = [] } = {}) {
  const customerEntries = customers.map((c) => ({
    id: `customer-${c.id}`,
    type: 'customer',
    label: c.name,
    sublabel: c.email,
    meta: c.company || c.status,
    path: `/customers/${c.id}`,
    searchable: `${c.name} ${c.email} ${c.company ?? ''} ${c.status ?? ''}`,
  }));

  const orderEntries = orders.map((o) => ({
    id: `order-${o.id}`,
    type: 'order',
    label: o.id,
    sublabel: o.customer,
    meta: `${o.total} · ${o.status}`,
    path: '/orders',
    searchable: `${o.id} ${o.customer} ${o.total} ${o.status}`,
  }));

  const transactionEntries = TRANSACTION_TARGETS.map((t) => ({
    id: t.id,
    type: 'transaction',
    label: t.user,
    sublabel: t.action,
    meta: `${t.amount} · ${t.status}`,
    path: '/transactions',
    searchable: `${t.user} ${t.action} ${t.amount} ${t.status} ${t.date}`,
  }));

  return [...PAGE_TARGETS, ...customerEntries, ...orderEntries, ...transactionEntries];
}

/** Run a query across the index, returning scored + grouped results. */
export function searchIndex(index, query, limit = 12) {
  if (!query.trim()) return [];

  return index
    .map((item) => {
      const primary = Math.max(
        scoreMatch(item.label, query),
        scoreMatch(item.sublabel ?? '', query)
      );
      // Fall back to secondary fields (keywords / email / company).
      const secondary = scoreMatch(item.searchable ?? '', query) * 0.6;
      // Page shortcuts benefit from keyword matches.
      const keyword = item.keywords ? scoreMatch(item.keywords, query) * 0.5 : 0;

      const score = Math.max(primary, secondary, keyword);
      return score > 0 ? { ...item, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}