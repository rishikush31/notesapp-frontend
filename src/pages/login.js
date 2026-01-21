import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'fusion-plugin-react-router';
import { useService } from 'fusion-react';
import { LoggerToken } from '../plugins/logger/token';
import GoogleLoginButton from '../components/googleLoginButton';
import { login, googleLogin } from '../store/auth/actions';
import { getUser } from '../store/notes/actions';
import {useToast} from '../ui/toast/ToastContext';

const hoverStyles = `
  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;


export default function Login() {

  const toast = useToast();

  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, user } = useSelector((state) => state.auth || {});

  // Rehydrate user on mount if not present
  useEffect(() => {
  if (!user) {
    dispatch(getUser());
  }
}, [dispatch, user]);


  // SSR + client mount logging
  const logger = useService(LoggerToken);
  useEffect(() => {
    if (__NODE__) {
      logger && logger.log && logger.log({ message: 'Login SSR render' });
    } else if (__BROWSER__) {
      logger && logger.log && logger.log({ message: 'Login mounted (client)' });
    }
  }, [logger]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (user) history.push('/');
  }, [user, history]);

  useEffect(()=>{
    if (error) toast.showToast(error);
  },[error])

  // --- Email/Password login ---
  const handleEmailLogin = (e) => {
    e.preventDefault();
    logger && logger.log && logger.log({ message: 'Login: email attempt', meta: { email } });
    dispatch(login({ email, password }));
  };

  // --- Google OAuth login ---
  const handleGoogleSuccess = (response) => {
    logger && logger.log && logger.log({ message: 'Login: google attempt', meta: { response } });
    dispatch(googleLogin(response.credential));
  };

  const handleGoogleError = () => {
    dispatch({ type: 'AUTH_FAILURE', payload: 'Google login failed' });
  };

  return (
    <div style={styles.container}>
      <style>{hoverStyles}</style>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} style={styles.form}>
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
          <button type="submit" disabled={loading} style={styles.submitBtn} className="login-btn">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}>or</div>

        {/* Google Login Button */}
        {__BROWSER__ && (<GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />)}

        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.footer}>
          Don't have an account? <a href="/register" style={styles.link}>Register here</a>
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
    marginBottom: 24,
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
  divider: {
    textAlign: 'center',
    color: '#8b7355',
    fontSize: 14,
    margin: '24px 0 16px 0',
    fontWeight: 500,
  },
  error: {
    color: '#d83f31',
    backgroundColor: '#ffe4e1',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    marginTop: 16,
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
