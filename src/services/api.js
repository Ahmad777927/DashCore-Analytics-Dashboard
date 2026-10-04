/**
 * Thin fetch wrapper.
 *
 * In development Vite proxies `/api` to the Express server, so requests are
 * same-origin and the httpOnly auth cookie flows automatically. In production
 * the SPA is served by the same Express process, so a relative path works too.
 *
 * `credentials: 'include'` is still required so cookies are sent/accepted when
 * the client and API are on different origins (e.g. VITE_API_URL is set).
 */
const API_BASE = import.meta.env?.VITE_API_URL || '';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || [];
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Unable to reach the server. Please check your connection.', 0);
  }

  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    // A 401 while the user thought they were signed in means the cookie
    // expired or was revoked. Broadcast it so AuthContext can log them out.
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw new ApiError(
      payload?.message || `Request failed with status ${res.status}`,
      res.status,
      payload?.errors
    );
  }

  return payload;
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export const authApi = {
  signup({ name, username, email, password, role }) {
    return request('/auth/signup', {
      method: 'POST',
      body: { name, username, email, password, role },
    });
  },

  login({ identifier, password }) {
    return request('/auth/login', {
      method: 'POST',
      body: { identifier, password },
    });
  },

  logout() {
    return request('/auth/logout', { method: 'POST' });
  },

  me(signal) {
    return request('/auth/me', { signal });
  },

  /** Persists profile edits (name, email, department) for the signed-in user. */
  updateProfile({ name, email, department }) {
    return request('/auth/me', {
      method: 'PATCH',
      body: { name, email, department },
    });
  },
};

/* ------------------------------------------------------------------ */
/* Password reset (React forgot/reset pages)                           */
/* ------------------------------------------------------------------ */

export const passwordApi = {
  /** Always resolves with a generic message — no account enumeration. */
  forgotPassword({ email }) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  /** Confirms a reset token is valid before showing the form. */
  verifyResetToken(token) {
    return request(`/auth/reset-password/${encodeURIComponent(token)}`);
  },

  resetPassword({ token, password, confirm }) {
    return request(`/auth/reset-password/${encodeURIComponent(token)}`, {
      method: 'POST',
      body: { password, confirm },
    });
  },
};

/* ------------------------------------------------------------------ */
/* Dashboard data — served by our own API (/api/customers, /api/orders) */
/* ------------------------------------------------------------------ */

/**
 * Local monthly revenue series for the overview chart. Kept in the client so
 * the dashboard never depends on a third-party service.
 */
const REVENUE_SERIES = [
  { name: 'Jan', value: 42100 },
  { name: 'Feb', value: 46800 },
  { name: 'Mar', value: 51250 },
  { name: 'Apr', value: 48900 },
  { name: 'May', value: 57400 },
  { name: 'Jun', value: 63150 },
  { name: 'Jul', value: 68900 },
];

export const api = {
  async getCustomers() {
    const payload = await request('/customers');
    return payload.customers;
  },

  createCustomer(payload) {
    return request('/customers', { method: 'POST', body: payload })
      .then(data => data.customer);
  },

  updateCustomer(id, payload) {
    return request(`/customers/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload })
      .then(data => data.customer);
  },

  deleteCustomer(id) {
    return request(`/customers/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getOrders() {
    const payload = await request('/orders');
    return payload.orders;
  },

  createOrder(payload) {
    return request('/orders', { method: 'POST', body: payload })
      .then(data => data.order);
  },

  updateOrder(id, payload) {
    return request(`/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload })
      .then(data => data.order);
  },

  deleteOrder(id) {
    return request(`/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  getRevenueData() {
    return Promise.resolve(REVENUE_SERIES.map(point => ({ ...point })));
  }
};
