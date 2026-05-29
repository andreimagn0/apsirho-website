import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <span className="admin-login__greek">ΑΨΡ</span>
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__sub">Alpha Psi Rho · Alpha Chapter</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label className="admin-login__label">Email</label>
            <input
              className="admin-login__input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@apsirho.org"
              autoComplete="email"
            />
          </div>
          <div className="admin-login__field">
            <label className="admin-login__label">Password</label>
            <input
              className="admin-login__input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <a href="/" className="admin-login__back">← Back to site</a>
      </div>
    </div>
  );
}
