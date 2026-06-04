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
      </aside>

      <main className="admin-layout__main">{children}</main>
    </section>
  );
}