import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'History', href: '#history' },
  { label: 'Brhothers', href: '#brothers' },
  { label: 'Archive', href: '#archive' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavClick = (href) => {
    setOpen(false);

    if (href === '#archive' || href === '#admin-login' || href === '#admin-upload') {
      window.location.hash = href;
      return;
    }

    if (href === '#home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      window.location.hash === '#archive' ||
      window.location.hash === '#admin-login' ||
      window.location.hash === '#admin-upload'
    ) {
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
    setOpen(false);

    // go to hero page
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a className="navbar__brand" href="#home" onClick={() => handleNavClick('#home')}>
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
                onClick={() => handleNavClick('#admin-login')}
              >
                Login
              </button>
            </li>
          ) : (
            <>
              <li>
                <button
                  className="navbar__link"
                  onClick={() => handleNavClick('#admin-upload')}
                >
                  Admin Upload
                </button>
              </li>
              <li>
                <button
                  className="navbar__link"
                  onClick={handleLogout}
                >
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
          className={`navbar__hamburger ${open ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}