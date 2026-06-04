import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const EMPTY = { name: '', role: '', order: 0 };

export default function ExecBoardManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data } = await supabase.from('exec_board').select('*').order('order', { ascending: true });
    setMembers(data || []);
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    if (editing) {
      const { error } = await supabase.from('exec_board').update({
        name:  form.name,
        role:  form.role,
        order: parseInt(form.order),
      }).eq('id', editing);
      if (error) setMsg('Error: ' + error.message);
      else { setMsg('Updated!'); setEditing(null); setForm(EMPTY); fetchMembers(); }
    } else {
      const { error } = await supabase.from('exec_board').insert([{
        name:  form.name,
        role:  form.role,
        order: parseInt(form.order) || members.length + 1,
      }]);
      if (error) setMsg('Error: ' + error.message);
      else { setMsg('Member added!'); setForm(EMPTY); fetchMembers(); }
    }
    setSaving(false);
  }

  async function handleDelete(m) {
    if (!window.confirm(`Remove ${m.name}?`)) return;
    await supabase.from('exec_board').delete().eq('id', m.id);
    fetchMembers();
  }

  function startEdit(m) {
    setEditing(m.id);
    setForm({ name: m.name, role: m.role, order: m.order });
    window.scrollTo(0, 0);
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Executive Board</h2>
      <p className="admin-section__desc">
        Manage the exec board displayed on the About section of the public site. Use the Order field to control the display sequence — lower numbers appear first.
      </p>

      <form onSubmit={handleSave} className="admin-form">
        <h3 className="admin-form__heading">{editing ? 'Edit Member' : 'Add E-Board Member'}</h3>
        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Full Name *</label>
            <input className="admin-form__input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required placeholder="First Last" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Role *</label>
            <input className="admin-form__input" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} required placeholder="e.g. President" />
          </div>
          <div className="admin-form__field admin-form__field--sm">
            <label className="admin-form__label">Order</label>
            <input className="admin-form__input" type="number" min="1" value={form.order} onChange={e => setForm(f => ({...f, order: e.target.value}))} placeholder="1" />
          </div>
        </div>
        {msg && <p className={`admin-form__msg ${msg.includes('Error') ? 'admin-form__msg--err' : 'admin-form__msg--ok'}`}>{msg}</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : '+ Add Member'}</button>
          {editing && <button className="admin-btn admin-btn--ghost" type="button" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      {loading ? <p className="admin-loading">Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Name</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td className="admin-table__muted">{m.order}</td>
                <td><strong>{m.name}</strong></td>
                <td>{m.role}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(m)}>✕</button>
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
