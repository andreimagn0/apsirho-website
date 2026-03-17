import './Footer.css';

export default function Footer() {
  const handleNav = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__greek">ΑΨΡ</span>
            <div>
              <p className="footer__name">Alpha Psi Rho</p>
              <p className="footer__chapter">Alpha Chapter · SDSU</p>
            </div>
          </div>

          <div className="footer__links">
            {[
              ['About', '#about'],
              ['History', '#history'],
              ['Brothers', '#brothers'],
              ['Newsletter', '#newsletter'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <button key={href} className="footer__link" onClick={() => handleNav(href)}>
                {label}
              </button>
            ))}
          </div>

          <div className="footer__contact">
            <p className="footer__contact-label">Contact</p>
            <a href="mailto:sdsuapsirho@gmail.com" className="footer__email">
              sdsuapsirho@gmail.com
            </a>
            <p className="footer__location">San Diego, California</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__motto">Always Be Bold And Strong · ABBΣ</p>
          <p className="footer__copy">© {new Date().getFullYear()} Alpha Psi Rho – Alpha Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
