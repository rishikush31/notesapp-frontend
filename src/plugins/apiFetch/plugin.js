import { createPlugin } from 'fusion-core';
import fetch from 'node-fetch';

const BACKEND_BASE_URL = 'http://localhost:3000';

export default createPlugin({
  provides() {
    /**
     * Server-side API fetch with refresh retry
     * - Runs only in Fusion
     * - No Redux
     * - No browser logic
     * - Backend owns auth + refresh
     */
    return async function apiFetch(ctx, path, options = {}) {
      const baseHeaders = {
        'content-type': 'application/json',
        ...(options.headers || {}),
        cookie: ctx.headers.cookie, // forward incoming cookies
      };

      console.log("[apiFetch] Path:", path);
      console.log("[apiFetch] Options before fetch:", options);
      console.log("[apiFetch] Forwarding headers:", baseHeaders);

      // First attempt
      let res = await fetch(`${BACKEND_BASE_URL}${path}`, {
        ...options,
        headers: baseHeaders,
      });

      console.log("[apiFetch] Response received:");
      console.log({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: res.headers.raw(),
      });

      // If unauthorized, attempt refresh
      if (res.status === 401) {
        console.log("[apiFetch] Unauthorized, attempting refresh token");

        const refreshRes = await fetch(`${BACKEND_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            cookie: ctx.headers.cookie,
          },
        });

        console.log("[apiFetch] Refresh response:", {
          status: refreshRes.status,
          ok: refreshRes.ok,
        });

        // If refresh succeeded, retry original request
        if (refreshRes.ok) {
          console.log("[apiFetch] Retrying original request after refresh");
          res = await fetch(`${BACKEND_BASE_URL}${path}`, {
            ...options,
            headers: baseHeaders,
          });
          console.log("[apiFetch] Retried response:", {
            status: res.status,
            ok: res.ok,
          });
        }
      }

      try {
        const data = await res.clone().json(); // clone so original response can still be used
        console.log("[apiFetch] Response JSON:", data);
      } catch (err) {
        const text = await res.clone().text();
        console.log("[apiFetch] Response text (non-JSON):", text);
      }

      // Return response as-is
      return res;
    };
  },
});
