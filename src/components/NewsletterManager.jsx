import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const EMPTY = { title: '', issue_no: '', date: '', file_url: '', pinned: false };

export default function NewsletterManager() {
  const [issues,  setIssues]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => { fetchIssues(); }, []);

  async function fetchIssues() {
    setLoading(true);
    const { data } = await supabase.from('newsletter').select('*').order('date', { ascending: false });
    setIssues(data || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    let fileUrl = form.file_url;

    // If a PDF file was selected, upload it to storage
    if (file) {
      const path = `newsletter/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('newsletter').upload(path, file);
      if (uploadError) { setMsg('Upload failed: ' + uploadError.message); setSaving(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('newsletter').getPublicUrl(path);
      fileUrl = publicUrl;
    }

    const { error } = await supabase.from('newsletter').insert([{
      title:    form.title,
      issue_no: form.issue_no,
      date:     form.date,
      file_url: fileUrl,
      pinned:   form.pinned,
    }]);

    if (error) setMsg('Error: ' + error.message);
    else { setMsg('Issue added!'); setForm(EMPTY); setFile(null); fetchIssues(); }
    setSaving(false);
  }

  async function handleDelete(issue) {
    if (!window.confirm(`Delete "${issue.title}"?`)) return;
    const path = issue.file_url?.split('/newsletter/')[1];
    if (path) await supabase.storage.from('newsletter').remove([`newsletter/${path}`]);
    await supabase.from('newsletter').delete().eq('id', issue.id);
    fetchIssues();
  }

  async function togglePin(issue) {
    await supabase.from('newsletter').update({ pinned: !issue.pinned }).eq('id', issue.id);
    fetchIssues();
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Newsletter</h2>
      <p className="admin-section__desc">
        Add newsletter issues. Pinned issues appear highlighted as "Latest" on the public Newsletter page. Upload a PDF or paste a Google Drive link.
      </p>

      <form onSubmit={handleAdd} className="admin-form">
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Title *</label>
            <input className="admin-form__input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required placeholder="e.g. Spring 2025 Newsletter" />
          </div>
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Issue # *</label>
            <input className="admin-form__input" value={form.issue_no} onChange={e => setForm(f => ({...f, issue_no: e.target.value}))} required placeholder="Vol. 1" />
          </div>
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Date *</label>
            <input className="admin-form__input" type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Upload PDF</label>
            <input className="admin-form__input" type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Or paste link (Google Drive / Canva)</label>
            <input className="admin-form__input" value={form.file_url} onChange={e => setForm(f => ({...f, file_url: e.target.value}))} placeholder="https://drive.google.com/..." />
          </div>
          <div className="admin-form__field admin-form__field--sm admin-form__field--center">
            <label className="admin-form__label">Pin as Latest?</label>
            <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({...f, pinned: e.target.checked}))} />
          </div>
        </div>
        {msg && <p className={`admin-form__msg ${msg.includes('Error') ? 'admin-form__msg--err' : 'admin-form__msg--ok'}`}>{msg}</p>}
        <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : '+ Add Issue'}</button>
      </form>

      {loading ? <p className="admin-loading">Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Issue</th><th>Title</th><th>Date</th><th>Pinned</th><th>Link</th><th></th></tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.issue_no}</td>
                <td><strong>{issue.title}</strong></td>
                <td>{issue.date}</td>
                <td>
                  <button className={`admin-btn admin-btn--sm ${issue.pinned ? '' : 'admin-btn--ghost'}`} onClick={() => togglePin(issue)}>
                    {issue.pinned ? '★ Pinned' : '☆ Pin'}
                  </button>
                </td>
                <td>
                  {issue.file_url
                    ? <a href={issue.file_url} target="_blank" rel="noopener noreferrer" className="admin-link">View</a>
                    : <span className="admin-table__muted">No file</span>
                  }
                </td>
                <td><button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(issue)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
