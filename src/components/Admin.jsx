
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLogin from './AdminLogin';
import ArchiveManager from '../components/admin/ArchiveManager';
import BrothersManager from '../components/admin/BrothersManager';
import NewsletterManager from '../components/admin/NewsletterManager';
import InquiriesInbox from '../components/admin/InquiriesInbox';
import ExecBoardManager from '../components/admin/ExecBoardManager';
import './Admin.css';

const TABS = [
  { id: 'brothers',   label: 'Brothers'    },
  { id: 'exec',       label: 'Exec Board'  },
  { id: 'archive',    label: 'Archive'     },
  { id: 'newsletter', label: 'Newsletter'  },
  { id: 'inquiries',  label: 'Inquiries'   },
];

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [tab,     setTab]     = useState('brothers');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Still checking auth
  if (session === undefined) {
    return <div className="admin-loading-screen">Loading...</div>;
  }

  // Not logged in — show login
  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  // Logged in — show dashboard
  return (
    <div className="admin">
      {/* Top bar */}
      <div className="admin__topbar">
        <div className="admin__topbar-left">
          <span className="admin__topbar-greek">ΑΨΡ</span>
          <span className="admin__topbar-title">Admin Dashboard</span>
        </div>
        <div className="admin__topbar-right">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin__topbar-link">View Site →</a>
          <button className="admin__logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="admin__layout">
        {/* Sidebar nav */}
        <nav className="admin__nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin__nav-item ${tab === t.id ? 'admin__nav-item--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="admin__main">
          {tab === 'brothers'   && <BrothersManager />}
          {tab === 'exec'       && <ExecBoardManager />}
          {tab === 'archive'    && <ArchiveManager />}
          {tab === 'newsletter' && <NewsletterManager />}
          {tab === 'inquiries'  && <InquiriesInbox />}
        </main>
      </div>
    </div>
  );
}
