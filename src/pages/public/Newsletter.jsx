import './Newsletter.css';

// TODO: Replace with actual newsletter issues / links
const ISSUES = [
  {
    title: 'Fall 2025 — Brotherhood Recap',
    date: 'December 2025',
    desc: 'Highlights from our fall semester: events, philanthropy, and new initiates.',
    link: '#',
  },
  {
    title: 'Spring 2025 — Community & Culture',
    date: 'May 2025',
    desc: 'API awareness events, community service spotlights, and brother achievements.',
    link: '#',
  },
  {
    title: 'Fall 2024 — Founding Edition',
    date: 'December 2024',
    desc: 'Our inaugural newsletter — introducing the brotherhood and our goals.',
    link: '#',
  },
];

export default function Newsletter() {
  return (
    <section id="newsletter" className="newsletter">
      <div className="newsletter__bg" />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
          <div className="newsletter__left">
            <p className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Stay Connected</p>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Newsletter</h2>
            <div className="divider" />

            <p className="newsletter__desc">
              Stay up to date with the latest from the Alpha Chapter. From rush events and
              philanthropy to brotherhood moments and alumni spotlights — our newsletter
              covers it all.
            </p>

            <div className="newsletter__signup">
              <p className="newsletter__signup-label">Get notified on new issues</p>
              <div className="newsletter__form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="newsletter__input"
                />
                <button className="newsletter__btn">Subscribe</button>
              </div>
              <p className="newsletter__form-note">No spam. Unsubscribe anytime.</p>
            </div>
          </div>

          <div className="newsletter__right">
            <p className="newsletter__archive-label">Past Issues</p>
            <div className="newsletter__issues">
              {ISSUES.map((issue, i) => (
                <a href={issue.link} className="newsletter__issue" key={i}>
                  <div className="newsletter__issue-number">No. {String(ISSUES.length - i).padStart(2, '0')}</div>
                  <div className="newsletter__issue-info">
                    <p className="newsletter__issue-date">{issue.date}</p>
                    <h3 className="newsletter__issue-title">{issue.title}</h3>
                    <p className="newsletter__issue-desc">{issue.desc}</p>
                  </div>
                  <div className="newsletter__issue-arrow">→</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
