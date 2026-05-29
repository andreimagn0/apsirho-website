import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CATEGORIES = ['Rush', 'Events', 'Formals', 'Retreats', 'Pledge Classes', 'Candids'];

const EMPTY = { title: '', category: '', year: new Date().getFullYear().toString(), tall: false };

export default function ArchiveManager() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from('archive').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!file) return setMsg('Please select an image file.');
    setSaving(true);
    setMsg('');

    // Upload image to Supabase Storage
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('archive').upload(path, file);
    if (uploadError) { setMsg('Upload failed: ' + uploadError.message); setSaving(false); return; }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('archive').getPublicUrl(path);

    // Insert row into archive table
    const { error: insertError } = await supabase.from('archive').insert([{
      title:     form.title,
      category:  form.category,
      year:      form.year,
      tall:      form.tall,
      image_url: publicUrl,
    }]);

    if (insertError) {
      setMsg('Save failed: ' + insertError.message);
    } else {
      setMsg('Added successfully!');
      setForm(EMPTY);
      setFile(null);
      fetchItems();
    }
    setSaving(false);
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    // Extract file path from URL and delete from storage
    const path = item.image_url?.split('/archive/')[1];
    if (path) await supabase.storage.from('archive').remove([path]);
    await supabase.from('archive').delete().eq('id', item.id);
    fetchItems();
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Archive</h2>
      <p className="admin-section__desc">
        Upload photos, flyers, and event media. Each item appears in the public Archive page under its category filter.
      </p>

      {/* Add form */}
      <form onSubmit={handleAdd} className="admin-form">
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Title *</label>
            <input className="admin-form__input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required placeholder="e.g. Spring 2025 Rush" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Category *</label>
            <select className="admin-form__input" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} required>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Year *</label>
            <input className="admin-form__input" value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} required placeholder="2025" />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Image *</label>
            <input className="admin-form__input" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required />
          </div>
          <div className="admin-form__field admin-form__field--sm admin-form__field--center">
            <label className="admin-form__label">Portrait / Tall?</label>
            <input type="checkbox" checked={form.tall} onChange={e => setForm(f => ({...f, tall: e.target.checked}))} />
            <span className="admin-form__hint">Check for rush flyers</span>
          </div>
        </div>
        {msg && <p className={`admin-form__msg ${msg.includes('success') ? 'admin-form__msg--ok' : 'admin-form__msg--err'}`}>{msg}</p>}
        <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Uploading...' : '+ Add Item'}</button>
      </form>

      {/* Items table */}
      {loading ? <p className="admin-loading">Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Title</th><th>Category</th><th>Year</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><img src={item.image_url} alt={item.title} className="admin-table__thumb" /></td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.year}</td>
                <td><button className="admin-btn admin-btn--danger" onClick={() => handleDelete(item)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
