import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

if (error) {
  setMessage(error.message);
} else {
  setMessage('Logged in successfully.');
  window.location.hash = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

    setLoading(false);
  }

  return (
    <section className="hero admin-login">
      <div className="hero__texture" />
      <div className="hero__overlay" />
      <div className="admin-login__shell">
        <div className="admin-login__card">
          <p className="admin-login__eyebrow">Brhother Login</p>
          <h2 className="admin-login__title">Login</h2>
          <div className="admin-login__divider" />
          <p className="admin-login__subtitle">
            Sign in to manage archive uploads and protected site content.
          </p>

          <form onSubmit={handleLogin} className="admin-login__form">
            <label className="admin-login__label">
              Email
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="admin-login__label">
              Password
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={loading} className="admin-login__button">
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            {message && <p className="admin-login__message">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}