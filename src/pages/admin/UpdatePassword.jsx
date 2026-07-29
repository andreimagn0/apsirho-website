import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminLogin.css';

const MIN_PASSWORD_LENGTH = 12;

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    let mounted = true;

    function removeRecoveryParameters() {
      const cleanUrl = `${window.location.pathname}${window.location.search}`.replace(
        /[?&]password-recovery=true/,
        ''
      );

      window.history.replaceState(
        {},
        document.title,
        `${cleanUrl}#update-password`
      );
    }

    async function checkRecoverySession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('Unable to verify recovery session:', error);
        setHasRecoverySession(false);
        setCheckingSession(false);
        return;
      }

      const hasSession = Boolean(data.session);
      setHasRecoverySession(hasSession);
      setCheckingSession(false);

      if (hasSession) removeRecoveryParameters();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setHasRecoverySession(Boolean(session));
        setCheckingSession(false);
        if (session) removeRecoveryParameters();
      }

      if (event === 'SIGNED_OUT') {
        setHasRecoverySession(false);
      }
    });

    checkRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function validatePassword() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Your password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (password !== confirmPassword) {
      return 'The passwords do not match.';
    }

    return '';
  }

  async function handlePasswordUpdate(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('');

    const validationError = validatePassword();

    if (validationError) {
      setMessage(validationError);
      setMessageType('error');
      return;
    }

    if (!hasRecoverySession) {
      setMessage(
        'Your password reset session is invalid or has expired. Request a new reset link.'
      );
      setMessageType('error');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('Password update failed:', error);
      setMessage(
        error.status === 422
          ? 'This password cannot be used. Choose a different password.'
          : 'We could not update your password. Your reset link may have expired.'
      );
      setMessageType('error');
      setLoading(false);
      return;
    }

    setPasswordUpdated(true);
    setMessage('Your password has been updated. Sign in again to continue.');
    setMessageType('success');

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('Password changed, but automatic sign-out failed:', signOutError);
    }

    setLoading(false);
    setHasRecoverySession(false);
  }

  function requestAnotherLink() {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.hash = 'forgot-password';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function returnToLogin() {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.hash = 'admin-login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (checkingSession) {
    return (
      <section className="hero admin-login">
        <div className="hero__texture" />
        <div className="hero__overlay" />
        <div className="admin-login__shell">
          <div className="admin-login__card admin-login__card--compact">
            <p className="admin-login__eyebrow">Alpha Psi Rho</p>
            <h1 className="admin-login__title">Verifying Reset Link</h1>
            <div className="admin-login__divider" />
            <p className="admin-login__subtitle">
              Please wait while we verify your password reset session.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasRecoverySession && !passwordUpdated) {
    return (
      <section className="hero admin-login">
        <div className="hero__texture" />
        <div className="hero__overlay" />
        <div className="admin-login__shell">
          <div className="admin-login__card admin-login__card--compact">
            <p className="admin-login__eyebrow">Alpha Psi Rho</p>
            <h1 className="admin-login__title">Reset Link Expired</h1>
            <div className="admin-login__divider" />
            <p className="admin-login__subtitle">
              This link is invalid, expired, or has already been used.
            </p>
            <div className="admin-login__form">
              <button
                type="button"
                className="admin-login__button"
                onClick={requestAnotherLink}
              >
                Request Another Link
              </button>
              <button
                type="button"
                className="admin-login__text-button admin-login__text-button--back"
                onClick={returnToLogin}
              >
                Return to login
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero admin-login">
      <div className="hero__texture" />
      <div className="hero__overlay" />
      <div className="admin-login__shell">
        <div className="admin-login__card">
          <p className="admin-login__eyebrow">Alpha Psi Rho</p>
          <h1 className="admin-login__title">
            {passwordUpdated ? 'Password Updated' : 'Create a New Password'}
          </h1>
          <div className="admin-login__divider" />
          <p className="admin-login__subtitle">
            {passwordUpdated
              ? 'Your account is ready. Use your new password the next time you sign in.'
              : `Use at least ${MIN_PASSWORD_LENGTH} characters and avoid reusing an old password.`}
          </p>

          {!passwordUpdated ? (
            <form onSubmit={handlePasswordUpdate} className="admin-login__form">
              <label className="admin-login__label">
                New Password
                <input
                  type="password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </label>

              <label className="admin-login__label">
                Confirm New Password
                <input
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="admin-login__button"
              >
                {loading ? 'Updating...' : 'Update Password'}
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
          ) : (
            <div className="admin-login__form">
              <p
                className="admin-login__message admin-login__message--success"
                role="status"
              >
                {message}
              </p>
              <button
                type="button"
                className="admin-login__button"
                onClick={returnToLogin}
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
