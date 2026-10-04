/**
 * Money formatting helpers shared by the customers/orders tables and modals.
 *
 * Values are stored as plain numeric strings ("1234.56") by our API; these
 * helpers format them for display and normalize whatever a form produces
 * before it is submitted.
 */

/** "1200.5" / "$1,200.50" → "$1,200.50" (unparseable values pass through). */
export function formatCurrency(value) {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(n)) return value == null ? '' : String(value);
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Normalize a money-ish value to the plain string a number input needs. */
export function toNumberValue(value) {
  if (value == null || value === '') return '';
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) && n >= 0 ? String(n) : '';
}

/** True when the value is a valid non-negative money amount (client side). */
export function isMoney(value) {
  return typeof value === 'string' && /^[$]?(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/.test(value.trim());
}
