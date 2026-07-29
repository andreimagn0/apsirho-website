import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminLogin.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleResetRequest(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage('Enter the email address associated with your account.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    const redirectUrl =
      `${window.location.origin}${window.location.pathname}` +
      '?password-recovery=true';

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      { redirectTo: redirectUrl }
    );

    setLoading(false);

    if (error) {
      console.error('Password reset request failed:', error);
      setMessage(
        error.status === 429
          ? 'Too many reset requests were submitted. Please wait before trying again.'
          : 'We could not send the reset email. Please try again later.'
      );
      setMessageType('error');
      return;
    }

    setSubmitted(true);
    setMessage(
      'If an account exists for that email, a password reset link has been sent.'
    );
    setMessageType('success');
  }

  function returnToLogin() {
    window.location.hash = 'portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="hero admin-login">
      <div className="hero__texture" />
      <div className="hero__overlay" />

      <div className="admin-login__shell">
        <div className="admin-login__card">
          <p className="admin-login__eyebrow">Alpha Psi Rho</p>
          <h1 className="admin-login__title">Reset Your Password</h1>
          <div className="admin-login__divider" />

          <p className="admin-login__subtitle">
            Enter the email associated with your administrator account. We will
            send a secure link to create a new password.
          </p>

          <form onSubmit={handleResetRequest} className="admin-login__form">
            <label className="admin-login__label">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading || submitted}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading || submitted}
              className="admin-login__button"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

            <button
              type="button"
              className="admin-login__text-button admin-login__text-button--back"
              onClick={returnToLogin}
            >
              Return to login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
