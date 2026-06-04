import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setLoggedIn(false);
        setAllowed(false);
        setLoading(false);
        window.location.hash = '#admin-login';
        return;
      }

      setLoggedIn(true);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const isAdmin = profile.role === 'admin' && profile.is_approved === true;

      setAllowed(isAdmin);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '4rem', textAlign: 'center' }}>
        <p>Checking admin access...</p>
      </section>
    );
  }

  if (!loggedIn) return null;

  if (!allowed) {
    return (
      <section style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You are logged in, but this account does not have admin access.</p>
        <button onClick={() => (window.location.hash = '')}>
          Return to Site
        </button>
      </section>
    );
  }

  return children;
}