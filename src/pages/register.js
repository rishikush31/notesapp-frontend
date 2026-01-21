import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'fusion-plugin-react-router';
import { useService } from 'fusion-react';
import { LoggerToken } from '../plugins/logger/token';
import { register } from '../store/auth/actions';
import { getUser } from '../store/notes/actions';
import {useToast} from '../ui/toast/ToastContext';

const hoverStyles = `
  .register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

export default function Register() {

  const toast = useToast();

  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, user } = useSelector((state) => state.auth || {});

  // Rehydrate user on mount if not present
  useEffect(() => {
    if (!user) dispatch(getUser());
  }, [dispatch, user]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (user) history.push('/');
  }, [user, history]);

  useEffect(()=>{
    if (error) toast.showToast(error);
  },[error])


  const logger = useService(LoggerToken);

  // --- Email/Password Registration ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      logger && logger.log && logger.log({ message: 'Register: attempt', meta: { email, name } });
      await dispatch(register({ name, email, password }));
      history.push('/');
    } catch (err) {
      // error is already handled in reducer, optional logging
      logger && logger.log && logger.log({ message: 'Register: failed', meta: { error: err.message }, level: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <style>{hoverStyles}</style>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        {/* Email/Password Form */}
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.submitBtn} className="register-btn">
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.footer}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fef6e4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fffbea',
    padding: 32,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #f0e5a9',
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#3e3b39',
    margin: 0,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 16,
  },
  input: {
    padding: 12,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #e8ddb5',
    backgroundColor: '#fff',
    color: '#3e3b39',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    padding: '12px 16px',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#fabd2f',
    color: '#5a4a42',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  error: {
    color: '#d83f31',
    backgroundColor: '#ffe4e1',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 500,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#5a4a42',
  },
  link: {
    color: '#fabd2f',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
};
