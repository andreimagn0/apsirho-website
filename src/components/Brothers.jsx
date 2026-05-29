import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Brothers.css';

export default function Brothers() {
  const [brothers, setBrothers] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [classOrder, setClassOrder] = useState([]);
  const [filter, setFilter] = useState('All');
  const [openClass, setOpenClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchBrothers() {
    setLoading(true);

    const { data: brothersData, error: brothersError } = await supabase
      .from('brothers')
      .select('*')
      .order('sort_order', { ascending: true });

    const { data: classesData, error: classesError } = await supabase
      .from('pledge_classes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (brothersError || classesError) {
      console.error('Error fetching brothers/classes:', brothersError || classesError);
      setLoading(false);
      return;
    }

    const classesById = {};

    classesData.forEach(cls => {
      classesById[cls.id] = cls;
    });

    const mappedBrothers = brothersData.map(row => {
      const pledgeClass = classesById[row.pledge_class_id];

      return {
        id: row.id,
        bondNo: row.bond_no,
        name: row.name,
        nickname: row.nickname,
        pledgeClass: pledgeClass?.name || 'Unknown',
        crossed: pledgeClass?.crossed_semester || '',
        status: row.status,
        minimal: row.is_minimal,
        profileImageUrl: row.profile_image_url,
        classNickname: pledgeClass?.nickname || '',
        classSymbol: pledgeClass?.symbol || '',
        classSortOrder: pledgeClass?.sort_order ?? 999
      };
    });

    const classMap = {};
    const orderedClasses = classesData.map(cls => {
      classMap[cls.name] = {
        nickname: cls.nickname,
        symbol: cls.symbol,
        crossed: cls.crossed_semester,
        sortOrder: cls.sort_order
      };

      return cls.name;
    });

    setBrothers(mappedBrothers);
    setClassInfo(classMap);
    setClassOrder(orderedClasses);
    setLoading(false);
  }
    fetchBrothers();
  }, []);

  const filtered =
    filter === 'All'
      ? brothers
      : brothers.filter(b => b.status === filter);

  const grouped = {};
  for (const cls of classOrder) {
    const members = filtered.filter(b => b.pledgeClass === cls);
    if (members.length > 0) grouped[cls] = members;
  }

  const initials = name =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getGreekSymbol = cls => {
    if (classInfo[cls]?.symbol) return classInfo[cls].symbol;

    const map = {
      Founding: '✦',
      Charter: '✦',
      Alpha: 'Α',
      Beta: 'Β',
      Gamma: 'Γ',
      Delta: 'Δ',
      Epsilon: 'Ε',
      Zeta: 'Ζ',
      Eta: 'Η',
      Theta: 'Θ',
      Iota: 'Ι',
      Kappa: 'Κ',
      Lambda: 'Λ',
      Mu: 'Μ',
      Nu: 'Ν',
      Xi: 'Ξ',
      Omicron: 'Ο',
      Pi: 'Π',
      Rho: 'Ρ',
      Sigma: 'Σ',
      Tau: 'Τ',
      Upsilon: 'Υ',
      Phi: 'Φ',
      Chi: 'Χ',
      Psi: 'Ψ'
    };

    return cls
      .split(' ')
      .map(w => map[w] || '')
      .filter(Boolean)
      .join('');
  };

  return (
    <section className="brothers" id="brothers">
      <div className="brothers__banner">
        <div className="container">
          <p className="section-eyebrow">The Brhotherhood</p>
          <h2 className="section-title">Brhothers of Alpha Psi Rho</h2>
          <div className="divider" />
        </div>
      </div>

      <div className="container brothers__body">
        <div className="brothers__filters">
          {['All', 'Active', 'Alumni'].map(f => (
            <button
              key={f}
              className={`brothers__filter-btn ${
                filter === f ? 'brothers__filter-btn--active' : ''
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}

          <span className="brothers__total">
            {loading ? 'Loading brhothers...' : `${filtered.length} brothers`}
          </span>
        </div>

        <div className="brothers__accordion">
          {Object.entries(grouped).map(([cls, members]) => {
            const isOpen = openClass === cls;
            const greekSymbol = getGreekSymbol(cls);
            const info = classInfo[cls];

            return (
              <div
                key={cls}
                className={`brothers__row ${
                  isOpen ? 'brothers__row--open' : ''
                }`}
              >
                <button
                  className="brothers__class-btn"
                  onClick={() => setOpenClass(isOpen ? null : cls)}
                >
                  <div className="brothers__class-left">
                    <span
                      className={`brothers__class-symbol ${
                        (greekSymbol || cls[0]).length > 1
                          ? 'brothers__class-symbol--double'
                          : ''
                      }`}
                    >
                      {greekSymbol || cls[0]}
                    </span>

                    <div className="brothers__class-labels">
                      <span className="brothers__class-name">{cls} Class</span>

                      {info?.nickname && info.nickname !== `${cls} Class` && (
                        <span className="brothers__class-fullname">
                          {info.nickname}
                        </span>
                      )}

                      {info?.crossed && (
                        <span className="brothers__class-crossed">
                          Crossed {info.crossed}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="brothers__class-right">
                    <span className="brothers__class-count">
                      {members.length}{' '}
                      {members.length === 1 ? 'brhother' : 'brhothers'}
                    </span>

                    <div className="brothers__avatar-stack">
                      {members.slice(0, 4).map(b => (
                        <div
                          key={b.id}
                          className={`brothers__stack-av ${
                            b.status === 'Alumni'
                              ? 'brothers__stack-av--alum'
                              : ''
                          }`}
                        >
                          {initials(b.name)}
                        </div>
                      ))}

                      {members.length > 4 && (
                        <div className="brothers__stack-av brothers__stack-av--more">
                          +{members.length - 4}
                        </div>
                      )}
                    </div>

                    <span className="brothers__chevron">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="brothers__panel">
                    <div className="brothers__cards-grid">
                      {members.map(b => (
                        <div
                          key={b.id}
                          className={`brothers__card ${
                            b.status === 'Alumni'
                              ? 'brothers__card--alumni'
                              : ''
                          }`}
                        >
                          <div className="brothers__card-top">
                            <div className="brothers__card-avatar">
                              {b.profileImageUrl ? (
                                <img
                                  src={b.profileImageUrl}
                                  alt={b.name}
                                  className="brothers__card-avatar-img"
                                />
                              ) : (
                                initials(b.name)
                              )}
                            </div>

                            <div className="brothers__card-info">
                              <p className="brothers__card-name">{b.name}</p>
                              <span className="brothers__card-bond">
                                #{b.bondNo}
                              </span>
                            </div>
                          </div>

                          <div className="brothers__card-body">
                            {!b.minimal && (
                              <>
                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">
                                    Nickname
                                  </span>
                                  <span className="brothers__card-nick">
                                    &ldquo;{b.nickname}&rdquo;
                                  </span>
                                </div>

                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">
                                    Crossed
                                  </span>
                                  <span className="brothers__card-val">
                                    {b.crossed}
                                  </span>
                                </div>

                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">
                                    Status
                                  </span>
                                  <span className="brothers__card-val">
                                    {b.status}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}