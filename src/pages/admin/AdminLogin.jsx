import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setMessageType('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('Login failed:', error);
      setMessage(
        error.status === 429
          ? 'Too many login attempts. Please wait before trying again.'
          : 'Invalid email or password.'
      );
      setMessageType('error');
      setLoading(false);
      return;
    }

    setMessage('Logged in successfully.');
    setMessageType('success');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(false);
  }

  function openForgotPassword() {
    window.location.hash = 'forgot-password';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="hero admin-login">
      <div className="hero__texture" />
      <div className="hero__overlay" />

      <div className="admin-login__shell">
        <div className="admin-login__card">
          <p className="admin-login__eyebrow">Alpha Psi Rho</p>
          <h2 className="admin-login__title">Brother Portal</h2>
          <div className="admin-login__divider" />

          <p className="admin-login__subtitle">
            Authorized members can sign in to manage protected chapter content.
          </p>

          <form onSubmit={handleLogin} className="admin-login__form">
            <label className="admin-login__label">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="admin-login__label">
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="admin-login__button"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <button
              type="button"
              className="admin-login__text-button"
              onClick={openForgotPassword}
            >
              Forgot your password?
            </button>

            {message && (
              <p
                className={`admin-login__message ${
                  messageType ? `admin-login__message--${messageType}` : ''
                }`}
                role={messageType === 'error' ? 'alert' : 'status'}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
