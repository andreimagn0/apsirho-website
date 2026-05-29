import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function InquiriesInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState(null);

  useEffect(() => { fetchInquiries(); }, []);

  async function fetchInquiries() {
    setLoading(true);
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setInquiries(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this inquiry?')) return;
    await supabase.from('inquiries').delete().eq('id', id);
    fetchInquiries();
  }

  function formatDate(str) {
    if (!str) return '';
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Rush Inquiries</h2>
      <p className="admin-section__desc">
        All submissions from the Contact / Rush Inquiry form on the public site. Read-only — reach out to rushees directly via email.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span className="admin-count">{inquiries.length} total inquiries</span>
      </div>

      {loading ? <p className="admin-loading">Loading...</p> : inquiries.length === 0 ? (
        <p className="admin-empty">No inquiries yet — they&apos;ll show up here when someone submits the form.</p>
      ) : (
        <div className="admin-inbox">
          {inquiries.map(inq => (
            <div key={inq.id} className="admin-inbox__item">
              <div className="admin-inbox__header" onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}>
                <div className="admin-inbox__meta">
                  <strong className="admin-inbox__name">{inq.first_name} {inq.last_name}</strong>
                  <span className="admin-inbox__info">{inq.year} · {inq.major}</span>
                  <a href={`mailto:${inq.email}`} className="admin-link" onClick={e => e.stopPropagation()}>{inq.email}</a>
                </div>
                <div className="admin-inbox__right">
                  <span className="admin-inbox__date">{formatDate(inq.created_at)}</span>
                  <span className="admin-inbox__chevron">{expanded === inq.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === inq.id && (
                <div className="admin-inbox__body">
                  <div className="admin-inbox__fields">
                    <div className="admin-inbox__field"><span className="admin-inbox__field-label">Phone</span><span>{inq.phone || '—'}</span></div>
                    <div className="admin-inbox__field"><span className="admin-inbox__field-label">Heard From</span><span>{inq.heard_from || '—'}</span></div>
                  </div>
                  {inq.message && (
                    <div className="admin-inbox__message">
                      <span className="admin-inbox__field-label">Message</span>
                      <p>{inq.message}</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <a href={`mailto:${inq.email}`} className="admin-btn">Reply via Email</a>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(inq.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
