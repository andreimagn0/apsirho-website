import { useState, useEffect, useRef } from 'react';
import './Brothers.css';

// ─────────────────────────────────────────────
// 🔧 CONFIGURATION
// 1. Paste your Google Sheet ID here
//    URL: https://docs.google.com/spreadsheets/d/THIS_PART/edit
// 2. Share the sheet: "Anyone with the link" → Viewer
//
// Sheet columns (Row 1 = headers, data from Row 2):
//   A: Name | B: PledgeClass | C: Year | D: Major | E: Role | F: Status (Active/Alumni)
// ─────────────────────────────────────────────
const SHEET_ID   = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Sheet1';

const CLASS_ORDER = [
  'Alpha','Beta','Gamma','Delta','Epsilon','Zeta',
  'Eta','Theta','Iota','Kappa','Lambda','Mu',
  'Nu','Xi','Omicron','Pi','Rho','Sigma',
  'Tau','Upsilon','Phi','Chi','Psi','Omega',
];

const GREEK_SYMBOLS = {
  Alpha:'Α',Beta:'Β',Gamma:'Γ',Delta:'Δ',Epsilon:'Ε',Zeta:'Ζ',
  Eta:'Η',Theta:'Θ',Iota:'Ι',Kappa:'Κ',Lambda:'Λ',Mu:'Μ',
  Nu:'Ν',Xi:'Ξ',Omicron:'Ο',Pi:'Π',Rho:'Ρ',Sigma:'Σ',
  Tau:'Τ',Upsilon:'Υ',Phi:'Φ',Chi:'Χ',Psi:'Ψ',Omega:'Ω',
};

// Class name lookup — add your class names here
const CLASS_NAMES = {
  Alpha: 'Alpha Sigma Souljas',
  Beta:  'Beta Class Name Here',
  Gamma: 'Gamma Class Name Here',
  // Add more as needed
};

const DEMO_BROTHERS = [
  { name:'Jordan Louangxaysongkham', nickname:'J.Lou',    pledgeClass:'Alpha',  year:'Senior',    major:'Business Administration', role:'President',        status:'Active', gradYear:'',     job:''                        },
  { name:'Isiah Summerhill',         nickname:'Izzy',     pledgeClass:'Alpha',  year:'Senior',    major:'Kinesiology',             role:'Sergeant At Arms', status:'Active', gradYear:'',     job:''                        },
  { name:'Alumni Brother',           nickname:'A.Bro',    pledgeClass:'Alpha',  year:'',          major:'Engineering',             role:'',                 status:'Alumni', gradYear:'2022', job:'Software Engineer, Google'},
  { name:'Carson Mandigma',          nickname:'C-Man',    pledgeClass:'Beta',   year:'Junior',    major:'Computer Science',        role:'Vice President',   status:'Active', gradYear:'',     job:''                        },
  { name:'Riley Coladilla',          nickname:'Ry',       pledgeClass:'Beta',   year:'Junior',    major:'Communications',          role:'Secretary',        status:'Active', gradYear:'',     job:''                        },
  { name:'Trevor Bananal',           nickname:'Trev',     pledgeClass:'Gamma',  year:'Sophomore', major:'Finance',                 role:'Treasurer',        status:'Active', gradYear:'',     job:''                        },
];

function getInitials(name) {
  const p = name.trim().split(' ');
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length-1][0]).toUpperCase();
}

function parseSheetRows(rows) {
  return rows.slice(1).map(r => ({
    name:        r[0] || '',
    pledgeClass: r[1] || '',
    year:        r[2] || '',
    major:       r[3] || '',
    role:        r[4] || '',
    status:      r[5] || 'Active',
    gradYear:    r[6] || '',
    job:         r[7] || '',
    nickname:    r[8] || '',
  })).filter(b => b.name);
}

// Animated accordion panel
function AccordionPanel({ isOpen, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(isOpen ? ref.current.scrollHeight : 0);
  }, [isOpen, children]);

  return (
    <div
      className="brothers__panel"
      style={{ height: `${height}px` }}
      aria-hidden={!isOpen}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
}

export default function Brothers() {
  const [brothers, setBrothers] = useState(DEMO_BROTHERS);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState('All');
  const [openClass, setOpenClass] = useState(null); // accordion: only one open at a time

  // ── Fetch Google Sheet ──
  useEffect(() => {
    if (SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') return;
    setLoading(true);
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    fetch(url)
      .then(r => r.text())
      .then(text => {
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c ? String(c.v ?? '') : ''));
        setBrothers(parseSheetRows(rows));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load roster — showing demo data.');
        setLoading(false);
      });
  }, []);

  // ── Group + sort by pledge class ──
  const grouped = brothers.reduce((acc, b) => {
    const k = b.pledgeClass || 'Unknown';
    if (!acc[k]) acc[k] = [];
    acc[k].push(b);
    return acc;
  }, {});

  const sortedClasses = Object.keys(grouped).sort((a, b) => {
    const ai = CLASS_ORDER.indexOf(a), bi = CLASS_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1; if (bi === -1) return -1;
    return ai - bi;
  });

  const filteredClasses = sortedClasses.map(cls => ({
    cls,
    members: grouped[cls].filter(b => filter === 'All' || b.status === filter),
  })).filter(({ members }) => members.length > 0);

  const totalVisible = brothers.filter(b => filter === 'All' || b.status === filter).length;

  const handleClassClick = (cls) => {
    setOpenClass(prev => prev === cls ? null : cls);
  };

  return (
    <section id="brothers" className="brothers">

      {/* Navy banner */}
      <div className="brothers__banner">
        <div className="container">
          <p className="section-eyebrow">The Brotherhood</p>
          <h2 className="section-title">Brhothers of Alpha Psi Rho</h2>
          <div className="divider" />
        </div>
      </div>

      <div className="container">

        {error && <p className="brothers__error">{error}</p>}

        {SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE' && (
          <div className="brothers__setup-notice">
            <span className="brothers__setup-icon">⚙</span>
            <p>
              <strong>Connect your roster:</strong> replace <code>YOUR_GOOGLE_SHEET_ID_HERE</code>{' '}
              in <code>Brothers.jsx</code> with your Sheet ID and set sharing to public viewer.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="brothers__filters">
          {['All','Active','Alumni'].map(s => (
            <button
              key={s}
              className={`brothers__filter ${filter === s ? 'brothers__filter--active' : ''}`}
              onClick={() => { setFilter(s); setOpenClass(null); }}
            >
              {s}
            </button>
          ))}
          <span className="brothers__count">{totalVisible} brothers</span>
        </div>

        {loading && (
          <div className="brothers__loading">
            <div className="brothers__spinner" />
            <p>Loading roster…</p>
          </div>
        )}

        {/* Accordion */}
        {!loading && (
          <div className="brothers__accordion">
            {filteredClasses.map(({ cls, members }, idx) => {
              const isOpen   = openClass === cls;
              const symbol   = GREEK_SYMBOLS[cls] || '·';
              const isLast   = idx === filteredClasses.length - 1;

              return (
                <div
                  key={cls}
                  className={`brothers__row ${isOpen ? 'brothers__row--open' : ''} ${isLast ? 'brothers__row--last' : ''}`}
                >
                  {/* ── Header ── */}
                  <button
                    className="brothers__class-btn"
                    onClick={() => handleClassClick(cls)}
                    aria-expanded={isOpen}
                  >
                    {/* Left: symbol + name */}
                    <div className="brothers__class-left">
                      <span className="brothers__class-symbol">{symbol}</span>
                      <div className="brothers__class-labels">
                        <span className="brothers__class-name">{cls} Class</span>
                        {CLASS_NAMES[cls] && (
                          <span className="brothers__class-fullname">{CLASS_NAMES[cls]}</span>
                        )}
                        <span className="brothers__class-sub">
                          {members.length} {members.length === 1 ? 'brother' : 'brothers'}
                        </span>
                      </div>
                    </div>

                    {/* Right: avatar stack + chevron */}
                    <div className="brothers__class-right">
                      <div className="brothers__avatar-stack">
                        {members.slice(0, 4).map((m, i) => (
                          <div
                            key={i}
                            className={`brothers__stack-avatar ${m.status === 'Alumni' ? 'brothers__stack-avatar--alumni' : ''}`}
                            style={{ zIndex: 4 - i }}
                            title={m.name}
                          >
                            {getInitials(m.name)}
                          </div>
                        ))}
                        {members.length > 4 && (
                          <div className="brothers__stack-more">+{members.length - 4}</div>
                        )}
                      </div>
                      <span className={`brothers__chevron ${isOpen ? 'brothers__chevron--open' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </button>

                  {/* ── Animated panel ── */}
                  <AccordionPanel isOpen={isOpen}>
                    <div className="brothers__panel-inner">
                      <div className="brothers__grid">
                        {members.map((b, i) => (
                          <div className="brothers__card" key={i}>

                            <div className="brothers__card-top">
                              <div className={`brothers__avatar ${b.status === 'Alumni' ? 'brothers__avatar--alumni' : ''}`}>
                                {getInitials(b.name)}
                              </div>
                              <div className="brothers__card-header-info">
                                <h3 className="brothers__name">{b.name}</h3>
                                {b.role && (
                                  <span className="brothers__role-badge">{b.role}</span>
                                )}
                              </div>
                            </div>

                            <div className="brothers__card-body">
                              <div className="brothers__detail-row">
                                <span className="brothers__detail-label">Class</span>
                                <span className="brothers__detail-value">{cls} Class</span>
                              </div>
                              {b.year && (
                                <div className="brothers__detail-row">
                                  <span className="brothers__detail-label">Year</span>
                                  <span className="brothers__detail-value">{b.year}</span>
                                </div>
                              )}
                              {b.major && (
                                <div className="brothers__detail-row">
                                  <span className="brothers__detail-label">Major</span>
                                  <span className="brothers__detail-value">{b.major}</span>
                                </div>
                              )}
                              <div className="brothers__detail-row">
                                <span className="brothers__detail-label">Status</span>
                                <span className={`brothers__status-badge brothers__status-badge--${b.status === 'Alumni' ? 'alumni' : 'active'}`}>
                                  {b.status}
                                </span>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionPanel>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
