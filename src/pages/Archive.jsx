import { useState } from 'react';
import './Archive.css';

// ─────────────────────────────────────────────
// 🔧 ADD YOUR ARCHIVE ITEMS HERE
// Each item needs:
//   src       — path to image (put images in /public/archive/)
//   title     — event or flyer name
//   year      — e.g. '2023'
//   category  — 'Rush' | 'Events' | 'Formals' | 'Retreats' | 'Pledge Classes' | 'Candids'
//   tall      — true if the image is portrait/tall (rush cards, flyers), false if landscape
//
// Example:
//   { src: '/archive/rush-spring-2024.jpg', title: 'Spring 2024 Rush', year: '2024', category: 'Rush', tall: true },
// ─────────────────────────────────────────────
const ARCHIVE_ITEMS = [
  { src: '', title: 'Spring 2024 Rush', year: '2024', category: 'Rush', tall: true },
  { src: '', title: 'Spring Formals 2024', year: '2024', category: 'Formals', tall: false },
  { src: '', title: 'Alpha Class Photo', year: '2023', category: 'Pledge Classes', tall: false },
  { src: '', title: 'Fall 2023 Retreat', year: '2023', category: 'Retreats', tall: false },
  { src: '', title: 'Fall 2023 Rush', year: '2023', category: 'Rush', tall: true },
  { src: '', title: 'Community Service 2023', year: '2023', category: 'Events', tall: false },
  { src: '', title: 'Beta Class Photo', year: '2022', category: 'Pledge Classes', tall: false },
  { src: '', title: 'Spring Formals 2023', year: '2023', category: 'Formals', tall: false },
  { src: '', title: 'Spring 2023 Rush', year: '2023', category: 'Rush', tall: true },
  { src: '', title: 'Alumni Reunion 2022', year: '2022', category: 'Events', tall: false },
  { src: '', title: 'Fall 2022 Retreat', year: '2022', category: 'Retreats', tall: false },
  { src: '', title: 'Spring Formals 2022', year: '2022', category: 'Formals', tall: false },
];

const CATEGORIES = ['All', 'Rush', 'Events', 'Formals', 'Retreats', 'Pledge Classes', 'Candids'];

const CATEGORY_COLORS = {
  Rush:            '#c9a84c',
  Events:          '#6b8cba',
  Formals:         '#9b7bb8',
  Retreats:        '#5a9b6b',
  'Pledge Classes':'#c9784c',
  Candids:         '#7a8aab',
};

export default function Archive() {
  const [filter, setFilter]       = useState('All');
  const [lightbox, setLightbox]   = useState(null);

  const filtered = filter === 'All'
    ? ARCHIVE_ITEMS
    : ARCHIVE_ITEMS.filter(i => i.category === filter);

  const handleKey = (e) => {
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowRight' && lightbox !== null) {
      setLightbox(prev => (prev + 1) % filtered.length);
    }
    if (e.key === 'ArrowLeft' && lightbox !== null) {
      setLightbox(prev => (prev - 1 + filtered.length) % filtered.length);
    }
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="archive__empty">
            <p>No items in this category yet.</p>
          </div>
        )}

        {/* Masonry grid */}
        <div className="archive__masonry">
          {filtered.map((item, i) => (
            <div
              key={i}
              className={`archive__card ${item.tall ? 'archive__card--tall' : ''}`}
              onClick={() => setLightbox(i)}
            >
              {/* Image or placeholder */}
              {item.src ? (
                <img src={item.src} alt={item.title} className="archive__img" />
              ) : (
                <div className="archive__placeholder">
                  <span className="archive__placeholder-icon">+</span>
                  <span className="archive__placeholder-text">Add Image</span>
                </div>
              )}

              {/* Hover overlay */}
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

      </div>

      {/* Lightbox */}
      {lightbox !== null && (
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

            {filtered[lightbox].src ? (
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="archive__lb-img"
              />
            ) : (
              <div className="archive__lb-placeholder">
                <p>Image not yet uploaded</p>
                <p className="archive__lb-hint">Add it to <code>/public/archive/</code></p>
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
