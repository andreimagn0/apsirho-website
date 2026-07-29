import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'History', href: '#history' },
  { label: 'Brothers', href: '#brothers' },
  { label: 'Archive', href: '#archive' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' },
];

const PAGE_ROUTES = [
  '#archive',
  '#portal',
  '#admin-login',
  '#admin-brothers',
  '#admin-classes',
  '#admin-eboard',
  '#admin-archives',
  '#admin-newsletter',
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function checkAdmin(currentSession) {
    if (!currentSession?.user) {
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role, is_approved')
      .eq('id', currentSession.user.id)
      .maybeSingle();

    if (error || !data) {
      setIsAdmin(false);
      return;
    }

    setIsAdmin(data.role === 'admin' && data.is_approved === true);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      checkAdmin(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      checkAdmin(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavClick = (href) => {
    setOpen(false);

    if (PAGE_ROUTES.includes(href)) {
      window.location.hash = href;
      return;
    }

    if (href === '#home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (PAGE_ROUTES.includes(window.location.hash)) {
      window.location.hash = '';

      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      return;
    }

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setOpen(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a
          className="navbar__brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
        >
          <span className="navbar__brand-greek">ΑΨΡ</span>
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Alpha Psi Rho</span>
            <span className="navbar__brand-chapter">Alpha Chapter · SDSU</span>
          </span>
        </a>

        <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                className="navbar__link"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </button>
            </li>
          ))}

          {!session ? (
            <li>
              <button
                className="navbar__link"
                onClick={() => handleNavClick('#portal')}
              >
                Login
              </button>
            </li>
          ) : (
            <>
              {isAdmin && (
                <li>
                  <button
                    className="navbar__link"
                    onClick={() => handleNavClick('#admin-brothers')}
                  >
                    Admin
                  </button>
                </li>
              )}

              <li>
                <button className="navbar__link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          <li>
            <button
              className="navbar__cta"
              onClick={() => handleNavClick('#contact')}
            >
              Rush ΑΨΡ
            </button>
          </li>
        </ul>

        <button
          className={`navbar__hamburger ${
            open ? 'navbar__hamburger--open' : ''
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}