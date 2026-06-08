import './AdminLayout.css';

export default function AdminLayout({ children, activePage = 'brothers' }) {
  const links = [
    { id: 'brothers', label: 'Brothers', href: '#admin-brothers' },
    { id: 'classes', label: 'Classes', href: '#admin-classes' },
    { id: 'eboard', label: 'E-board', href: '#admin-eboard' },
    { id: 'archives', label: 'Archives', href: '#admin-archives' },
    { id: 'newsletter', label: 'Newsletter', href: '#admin-newsletter' },
    
  ];

  return (
    <section className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <p>Alpha Psi Rho</p>
          <h1>Admin</h1>
        </div>

        <div className="admin-layout__nav-wrapper">
          <nav className="admin-layout__nav">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`admin-layout__link ${
                  activePage === link.id ? 'admin-layout__link--active' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            className="admin-layout__back-btn"
            onClick={() => {
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ← Back to Site
          </button>
        </div>
      </aside>

      <main className="admin-layout__main">{children}</main>
    </section>
  );
}