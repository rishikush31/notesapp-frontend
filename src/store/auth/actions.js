/**
 * Fetch logged-in user using cookies
 * Used on app bootstrap / page refresh
 */
export const getUser = () => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  console.log("[getUser] Dispatch AUTH_REQUEST");

  try {
    console.log("[getUser] Calling fetch /api/user with credentials include");
    const res = await fetch('/api/user', {
      credentials: 'include',
    });

    console.log("[getUser] Response status:", res.status, "ok:", res.ok);

    if (!res.ok) throw new Error('Unauthorized');

    const user = await res.json();
    console.log("[getUser] Fetched user:", user);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    console.log("[getUser] Dispatch AUTH_SUCCESS");
  } catch (err) {
    console.error("[getUser] Error:", err.message);
    dispatch({ type: 'AUTH_LOGOUT' });
    console.log("[getUser] Dispatch AUTH_LOGOUT");
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  console.log("[login] Dispatch AUTH_REQUEST");

  try {
    console.log("[login] Calling fetch /auth/login with body:", { email, password });
    const res = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log("[login] /auth/login Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Login failed');

    console.log("[login] Calling fetch /api/user to get logged-in user");
    const userRes = await fetch('/api/user', { credentials: 'include' });
    console.log("[login] /api/user Response status:", userRes.status, "ok:", userRes.ok);

    if (!userRes.ok) throw new Error('User fetch failed');

    const user = await userRes.json();
    console.log("[login] Fetched user:", user);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    console.log("[login] Dispatch AUTH_SUCCESS");
  } catch (err) {
    console.error("[login] Error:", err.message);
    dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Login failed' });
    console.log("[login] Dispatch AUTH_FAILURE");
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  console.log("[register] Dispatch AUTH_REQUEST");

  try {
    console.log("[register] Calling fetch /auth/register with body:", { name, email, password });
    const res = await fetch('/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    console.log("[register] /auth/register Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Registration failed');

    console.log("[register] Calling fetch /api/user to get logged-in user");
    const userRes = await fetch('/api/user', { credentials: 'include' });
    console.log("[register] /api/user Response status:", userRes.status, "ok:", userRes.ok);

    if (!userRes.ok) throw new Error('User fetch failed');

    const user = await userRes.json();
    console.log("[register] Fetched user:", user);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    console.log("[register] Dispatch AUTH_SUCCESS");
  } catch (err) {
    console.error("[register] Error:", err.message);
    dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Registration failed' });
    console.log("[register] Dispatch AUTH_FAILURE");
  }
};

export const googleLogin = (token) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  console.log("[googleLogin] Dispatch AUTH_REQUEST");

  try {
    console.log("[googleLogin] Calling fetch /auth/google with token:", token);
    const res = await fetch('/auth/google', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    console.log("[googleLogin] /auth/google Response status:", res.status, "ok:", res.ok);

    if (!res.ok) throw new Error('Google login failed');

    console.log("[googleLogin] Calling fetch /api/user to get logged-in user");
    const userRes = await fetch('/api/user', { credentials: 'include' });
    console.log("[googleLogin] /api/user Response status:", userRes.status, "ok:", userRes.ok);

    if (!userRes.ok) throw new Error('User fetch failed');

    const user = await userRes.json();
    console.log("[googleLogin] Fetched user:", user);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    console.log("[googleLogin] Dispatch AUTH_SUCCESS");
  } catch (err) {
    console.error("[googleLogin] Error:", err.message);
    dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Google login failed' });
    console.log("[googleLogin] Dispatch AUTH_FAILURE");
  }
};

export const logout = () => async (dispatch) => {
  try {
    console.log("[logout] Calling fetch /auth/logout");
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    console.log("[logout] /auth/logout done");
  } catch (_) {
    console.error("[logout] Error ignored");
  }

  dispatch({ type: 'AUTH_LOGOUT' });
  console.log("[logout] Dispatch AUTH_LOGOUT");
};
