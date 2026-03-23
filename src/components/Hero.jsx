import './Hero.css';

export default function Hero() {
  const handleScroll = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero__texture" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Est. Alpha Chapter · San Diego State University
        </p>

        <div className="hero__seal fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <img src="/seal.png" alt="Alpha Psi Rho Seal" className="hero__seal-img" />
        </div>

        <div className="hero__crest fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <span className="hero__greek">ΑΨΡ</span>
        </div>

        <h1 className="hero__title fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          Alpha Psi Rho
        </h1>

        <p className="hero__motto fade-up" style={{ animationDelay: '0.55s', opacity: 0 }}>
          Always &nbsp;·&nbsp; Be &nbsp;·&nbsp; Bold &nbsp;·&nbsp; And &nbsp;·&nbsp; Strong
        </p>

        <p className="hero__tagline fade-up" style={{ animationDelay: '0.75s', opacity: 0 }}>
          Brotherhood through service, culture, and scholarship.
        </p>

        <div className="hero__actions fade-up" style={{ animationDelay: '1.0s', opacity: 0 }}>
          <button className="hero__btn hero__btn--primary" onClick={() => handleScroll('#contact')}>
            Rush ΑΨΡ
          </button>
          <div className="hero__divider-vertical" />
          <button className="hero__btn hero__btn--ghost" onClick={() => handleScroll('#about')}>
            Learn More
          </button>
        </div>

      </div>

    </section>
  );
}