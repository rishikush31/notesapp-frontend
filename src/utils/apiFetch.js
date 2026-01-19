import store from '../store/redux';
import { logout } from '../store/auth/actions';
import { BACKEND_BASE_URL } from '../config/env';

/**
 * Centralized API fetch
 * - All tokens are handled by cookies
 * - Retries on 401 using refresh token
 * - Logs out if refresh fails
 */
export async function apiFetch(url, options = {}) {
  options.credentials = 'include';
  options.headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(`${BACKEND_BASE_URL}${url}`, options);
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }

  // If 401 → try refresh token (client only)
  if (__BROWSER__ && res.status === 401) {
    try {
      const refreshRes = await fetch(`${BACKEND_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshRes.ok) throw new Error('Refresh token invalid');

      // Retry original request
      res = await fetch(`${BACKEND_BASE_URL}${url}`, options);

      // If still 401 after refresh → logout
      if (res.status === 401) {
        store.dispatch(logout());
        throw new Error('Session expired. Please login again.');
      }

    } catch (err) {
      console.error('Refresh failed:', err);
      store.dispatch(logout());
      throw new Error('Session expired. Please login again.');
    }
  }

  let text = await res.text();
  let data = text ? JSON.parse(text) : {};

  if (!res.ok) throw new Error(data.message || res.statusText || 'API request failed');

  return data;
}
