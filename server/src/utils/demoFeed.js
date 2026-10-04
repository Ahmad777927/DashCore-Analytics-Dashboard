/**
 * Helpers for merging the built-in demo dataset (../data/seedData.js) with
 * the rows persisted in MongoDB. There are no network calls here — the
 * dashboard only ever talks to its own API and database.
 */

/** Keep only the keys we actually persist. */
export function pickFields(body, writable) {
  return writable.reduce((acc, key) => {
    if (body?.[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});
}

/** True when `id` refers to a built-in seed row (numeric key). */
export function isNumericKey(id) {
  return /^\d+$/.test(String(id ?? ''));
}

/**
 * True when a value is a non-negative money amount the way the modals send
 * it: digits with an optional "$" prefix, thousands separators and up to two
 * decimals (e.g. "250", "$1,200.50").
 */
const MONEY_RE = /^[$]?(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/;

export function isMoney(value) {
  return typeof value === 'string' && MONEY_RE.test(value.trim());
}

/** Normalize a money input to a plain numeric string ("$1,200.50" → "1200.5"). */
export function sanitizeMoney(value) {
  const n = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? String(Number(n.toFixed(2))) : '';
}

