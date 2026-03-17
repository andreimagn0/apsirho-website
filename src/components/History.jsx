import './History.css';

const TIMELINE = [
  {
    year: 'Founded',
    title: 'The Beginning',
    desc: 'Alpha Psi Rho was founded with a vision of creating a brotherhood that celebrates Asian/Pacific Islander culture while fostering leadership and academic excellence.',
  },
  {
    year: 'Alpha Chapter',
    title: 'SDSU Established',
    desc: 'The Alpha Chapter was established at San Diego State University, planting roots at one of California\'s most diverse campuses.',
  },
  {
    year: 'Growth',
    title: 'Expansion & Legacy',
    desc: 'The fraternity expanded its reach, establishing new chapters while the Alpha Chapter continued to grow its presence on campus and in the community.',
  },
  {
    year: 'Today',
    title: 'Carrying the Torch',
    desc: 'Today, the brothers of Alpha Psi Rho continue to uphold the founding pillars — brotherhood, culture, scholarship, and service — with pride and purpose.',
  },
];

export default function History() {
  return (
    <section id="history" className="history">
      <div className="history__bg" />
      <div className="container">
        <p className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Our Story</p>
        <h2 className="section-title" style={{ color: 'var(--white)' }}>History &amp; Legacy</h2>
        <div className="divider" />

        <p className="history__intro">
          "High-caliber men." To truly understand Alpha Psi Rho, you must recognize its roots — and the world that made them necessary.
        </p>

        <div className="history__timeline">
          {TIMELINE.map((item, i) => (
            <div className="history__item" key={i}>
              <div className="history__marker">
                <div className="history__dot" />
                {i < TIMELINE.length - 1 && <div className="history__line" />}
              </div>
              <div className="history__card">
                <span className="history__year">{item.year}</span>
                <h3 className="history__card-title">{item.title}</h3>
                <p className="history__card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="history__placeholder">
          <em>Want to add specific dates and founding stories? Replace the timeline content above with your chapter's actual history.</em>
        </p>
      </div>
    </section>
  );
}
