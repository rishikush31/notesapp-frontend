// src/utils/clientFetch.js

export async function clientFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (res.status !== 401) {
    return res;
  }

  // One forced refresh attempt
  const refreshRes = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshRes.ok) {
    throw new Error('Session expired');
  }

  // Retry original request
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
}
