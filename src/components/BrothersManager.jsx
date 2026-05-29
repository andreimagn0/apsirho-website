import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const EMPTY = {
  bond_no: '', name: '', nickname: '', pledge_class: '',
  crossed: '', status: 'Active', major: '', role: ''
};

export default function BrothersManager() {
  const [brothers, setBrothers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [editing,  setEditing]  = useState(null); // id of row being edited
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');

  useEffect(() => { fetchBrothers(); }, []);

  async function fetchBrothers() {
    setLoading(true);
    const { data } = await supabase.from('brothers').select('*').order('bond_no', { ascending: true });
    setBrothers(data || []);
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    if (editing) {
      const { error } = await supabase.from('brothers').update({
        bond_no:      form.bond_no,
        name:         form.name,
        nickname:     form.nickname,
        pledge_class: form.pledge_class,
        crossed:      form.crossed,
        status:       form.status,
        major:        form.major,
        role:         form.role,
      }).eq('id', editing);
      if (error) setMsg('Error: ' + error.message);
      else { setMsg('Updated!'); setEditing(null); setForm(EMPTY); fetchBrothers(); }
    } else {
      const { error } = await supabase.from('brothers').insert([{
        bond_no:      form.bond_no,
        name:         form.name,
        nickname:     form.nickname,
        pledge_class: form.pledge_class,
        crossed:      form.crossed,
        status:       form.status,
        major:        form.major,
        role:         form.role,
      }]);
      if (error) setMsg('Error: ' + error.message);
      else { setMsg('Brother added!'); setForm(EMPTY); fetchBrothers(); }
    }
    setSaving(false);
  }

  function startEdit(b) {
    setEditing(b.id);
    setForm({
      bond_no: b.bond_no || '', name: b.name || '', nickname: b.nickname || '',
      pledge_class: b.pledge_class || '', crossed: b.crossed || '',
      status: b.status || 'Active', major: b.major || '', role: b.role || ''
    });
    window.scrollTo(0, 0);
  }

  async function handleDelete(b) {
    if (!window.confirm(`Remove ${b.name}?`)) return;
    await supabase.from('brothers').delete().eq('id', b.id);
    fetchBrothers();
  }

  async function toggleStatus(b) {
    const newStatus = b.status === 'Active' ? 'Alumni' : 'Active';
    await supabase.from('brothers').update({ status: newStatus }).eq('id', b.id);
    fetchBrothers();
  }

  const displayed = brothers.filter(b => {
    const matchFilter = filter === 'All' || b.status === filter;
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase()) ||
                        b.pledge_class?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Brothers</h2>
      <p className="admin-section__desc">
        Add new brothers, edit info, or mark as Alumni. Changes appear immediately on the public Brothers page.
      </p>

      {/* Add / Edit form */}
      <form onSubmit={handleSave} className="admin-form">
        <h3 className="admin-form__heading">{editing ? 'Edit Brother' : 'Add New Brother'}</h3>
        <div className="admin-form__row">
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Bond # *</label>
            <input className="admin-form__input" value={form.bond_no} onChange={e => setForm(f => ({...f, bond_no: e.target.value}))} required placeholder="315" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Full Name *</label>
            <input className="admin-form__input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required placeholder="First Last" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Nickname / Line Name *</label>
            <input className="admin-form__input" value={form.nickname} onChange={e => setForm(f => ({...f, nickname: e.target.value}))} required placeholder="e.g. The Doggfather" />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Pledge Class *</label>
            <input className="admin-form__input" value={form.pledge_class} onChange={e => setForm(f => ({...f, pledge_class: e.target.value}))} required placeholder="e.g. Alpha Phi" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Crossed *</label>
            <input className="admin-form__input" value={form.crossed} onChange={e => setForm(f => ({...f, crossed: e.target.value}))} required placeholder="e.g. Fall 2025" />
          </div>
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Status</label>
            <select className="admin-form__input" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
              <option>Active</option>
              <option>Alumni</option>
            </select>
          </div>
        </div>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Major</label>
            <input className="admin-form__input" value={form.major} onChange={e => setForm(f => ({...f, major: e.target.value}))} placeholder="e.g. Business Administration" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Role (if e-board)</label>
            <input className="admin-form__input" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} placeholder="e.g. President" />
          </div>
        </div>
        {msg && <p className={`admin-form__msg ${msg.includes('Error') ? 'admin-form__msg--err' : 'admin-form__msg--ok'}`}>{msg}</p>}
        <div style={{display:'flex',gap:'0.75rem'}}>
          <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : '+ Add Brother'}</button>
          {editing && <button className="admin-btn admin-btn--ghost" type="button" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      {/* Filters + search */}
      <div className="admin-toolbar">
        <input className="admin-search" placeholder="Search by name or class..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="admin-filters">
          {['All','Active','Alumni'].map(f => (
            <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <span className="admin-count">{displayed.length} brothers</span>
      </div>

      {/* Table */}
      {loading ? <p className="admin-loading">Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Nickname</th><th>Class</th><th>Crossed</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {displayed.map(b => (
              <tr key={b.id}>
                <td className="admin-table__muted">{b.bond_no}</td>
                <td><strong>{b.name}</strong></td>
                <td className="admin-table__muted">{b.nickname}</td>
                <td>{b.pledge_class}</td>
                <td>{b.crossed}</td>
                <td>
                  <span className={`admin-badge ${b.status === 'Active' ? 'admin-badge--active' : 'admin-badge--alumni'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                    <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => toggleStatus(b)}>
                      {b.status === 'Active' ? '→ Alumni' : '→ Active'}
                    </button>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(b)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
