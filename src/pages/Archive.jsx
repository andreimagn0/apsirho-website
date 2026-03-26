import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Archive.css';

const CATEGORIES = ['All', 'Rush', 'Events', 'Formals', 'Retreats', 'Pledge Classes', 'Candids'];

const CATEGORY_COLORS = {
  Rush:             '#c9a84c',
  Events:           '#6b8cba',
  Formals:          '#9b7bb8',
  Retreats:         '#5a9b6b',
  'Pledge Classes': '#c9784c',
  Candids:          '#7a8aab',
};

export default function Archive() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
  async function fetchItems() {
    setLoading(true);

    const { data, error } = await supabase
    .from('apsirho')
    .select('*')
    .order('event_date', { ascending: false });

    console.log('Fetched archive items:', data);
    console.log('Supabase error:', error);

    if (error) {
      console.error('Supabase error:', error);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }
    fetchItems();
  }, []);

  const filtered = filter === 'All'
    ? items
    : items.filter(i => i.category === filter);

  const handleKey = (e) => {
    if (e.key === 'Escape')     setLightbox(null);
    if (e.key === 'ArrowRight' && lightbox !== null)
      setLightbox(prev => (prev + 1) % filtered.length);
    if (e.key === 'ArrowLeft'  && lightbox !== null)
      setLightbox(prev => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <div className="archive" onKeyDown={handleKey} tabIndex={-1}>

      {/* Banner */}
      <div className="archive__banner">
        <div className="container">
          <p className="section-eyebrow">The Brotherhood</p>
          <h1 className="section-title archive__title">Archive</h1>
          <div className="divider" />
          <p className="archive__subtitle">
            Rush cards, events, formals, retreats, pledge classes — all in one place.
          </p>
        </div>
      </div>

      <div className="container">

        {/* Filter bar */}
        <div className="archive__filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`archive__filter ${filter === cat ? 'archive__filter--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
          <span className="archive__count">{filtered.length} items</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="archive__loading">
            <div className="archive__spinner" />
            <p>Loading archive...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="archive__empty">
            <p>No items yet — upload some in your Supabase dashboard!</p>
            <p className="archive__empty-hint">
              Go to <strong>supabase.com</strong> → your project → Table Editor → archive → Insert row
            </p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && filtered.length > 0 && (
          <div className="archive__masonry">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`archive__card ${item.tall ? 'archive__card--tall' : ''}`}
                onClick={() => setLightbox(i)}
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="archive__img" />
                ) : (
                  <div className="archive__placeholder">
                    <span className="archive__placeholder-icon">+</span>
                    <span className="archive__placeholder-text">No Image</span>
                  </div>
                )}
                <div className="archive__overlay">
                  <span
                    className="archive__category-tag"
                    style={{ background: CATEGORY_COLORS[item.category] || '#c9a84c' }}
                  >
                    {item.category}
                  </span>
                  <h3 className="archive__card-title">{item.title}</h3>
                  <p className="archive__card-year">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="archive__lightbox" onClick={() => setLightbox(null)}>
          <div className="archive__lightbox-inner" onClick={e => e.stopPropagation()}>

            <button className="archive__lb-close" onClick={() => setLightbox(null)}>✕</button>

            <button
              className="archive__lb-arrow archive__lb-arrow--left"
              onClick={() => setLightbox(prev => (prev - 1 + filtered.length) % filtered.length)}
            >‹</button>

            <button
              className="archive__lb-arrow archive__lb-arrow--right"
              onClick={() => setLightbox(prev => (prev + 1) % filtered.length)}
            >›</button>

            {filtered[lightbox].image_url ? (
              <img
                src={filtered[lightbox].image_url}
                alt={filtered[lightbox].title}
                className="archive__lb-img"
              />
            ) : (
              <div className="archive__lb-placeholder">
                <p>No image uploaded yet</p>
              </div>
            )}

            <div className="archive__lb-meta">
              <span
                className="archive__category-tag"
                style={{ background: CATEGORY_COLORS[filtered[lightbox].category] || '#c9a84c' }}
              >
                {filtered[lightbox].category}
              </span>
              <h3 className="archive__lb-title">{filtered[lightbox].title}</h3>
              <p className="archive__lb-year">{filtered[lightbox].year}</p>
              <p className="archive__lb-nav">{lightbox + 1} / {filtered.length}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
