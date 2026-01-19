// actions.js
import { apiFetch } from '../../utils/apiFetch';

/**
 * Fetch logged-in user using cookies
 * Used on app bootstrap / page refresh
 */
export const getUser = () => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });

  try {
    const user = await apiFetch('/api/user');
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  } catch (err) {
    dispatch({ type: 'AUTH_LOGOUT' });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });

  try {
    // backend sets access + refresh cookies
    await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const user = await apiFetch('/api/user');
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  } catch (err) {
    dispatch({
      type: 'AUTH_FAILURE',
      payload: err.message || 'Login failed',
    });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });

  try {
    // backend sets access + refresh cookies
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    const user = await apiFetch('/api/user');
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  } catch (err) {
    dispatch({
      type: 'AUTH_FAILURE',
      payload: err.message || 'Registration failed',
    });
  }
};

export const googleLogin = (token) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });

  try {
    // backend verifies google token & sets cookies
    await apiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    const user = await apiFetch('/api/user');
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  } catch (err) {
    dispatch({
      type: 'AUTH_FAILURE',
      payload: err.message || 'Google login failed',
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (_) {
    console.log(_)
    // ignore
  }

  dispatch({ type: 'AUTH_LOGOUT' });
  // Caller should handle navigation; avoid forcing a full page reload.
};
