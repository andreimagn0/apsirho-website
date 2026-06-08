import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import './ExecBoardManager.css';

const EMPTY = {
  brother_id: '',
  position_title: '',
  position_description: '',
  term: '2025-2026',
  sort_order: 0,
  is_visible: true,
};

export default function ExecBoardManager() {
  const [positions, setPositions] = useState([]);
  const [brothers, setBrothers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: boardData, error: boardError } = await supabase
      .from('executive_board')
      .select('*')
      .order('sort_order', { ascending: true });

    const { data: brothersData, error: brothersError } = await supabase
      .from('brothers')
      .select('id, bond_no, name')
      .order('sort_order', { ascending: true });

    if (boardError || brothersError) {
      console.error(boardError || brothersError);
      setMessage('Error loading E-board data.');
      return;
    }

    setPositions(boardData || []);
    setBrothers(brothersData || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startEdit(position) {
    setEditing(position.id);
    setForm({
      brother_id: position.brother_id || '',
      position_title: position.position_title || '',
      position_description: position.position_description || '',
      term: position.term || '',
      sort_order: position.sort_order || 0,
      is_visible: position.is_visible ?? true,
    });
    setMessage('');
  }

  function resetForm() {
    setEditing(null);
    setForm(EMPTY);
    setMessage('');
  }

  async function handleSave(e) {
    e.preventDefault();

    const payload = {
      brother_id: form.brother_id || null,
      position_title: form.position_title,
      position_description: form.position_description || null,
      term: form.term || null,
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
    };

    const result = editing
      ? await supabase
          .from('executive_board')
          .update(payload)
          .eq('id', editing)
          .select()
      : await supabase
          .from('executive_board')
          .insert([payload])
          .select();

    if (result.error) {
      console.error(result.error);
      setMessage('Save failed. Check console.');
      return;
    }

    setMessage(editing ? 'Position updated.' : 'Position added.');
    resetForm();
    fetchData();
  }

  async function handleToggleVisible(position) {
    const { error } = await supabase
      .from('executive_board')
      .update({ is_visible: !position.is_visible })
      .eq('id', position.id);

    if (error) {
      console.error(error);
      setMessage('Visibility update failed.');
      return;
    }

    fetchData();
  }

  async function handleDelete(position) {
    if (!window.confirm(`Delete ${position.position_title}?`)) return;

    const { error } = await supabase
      .from('executive_board')
      .delete()
      .eq('id', position.id);

    if (error) {
      console.error(error);
      setMessage('Delete failed.');
      return;
    }

    setMessage('Position deleted.');
    fetchData();
  }

  function getBrotherName(brotherId) {
    return brothers.find((b) => b.id === brotherId)?.name || 'Vacant';
  }

  function getBrotherLabel(brother) {
    return `#${brother.bond_no} — ${brother.name}`;
  }

  return (
    <AdminLayout activePage="eboard">
      <div className="eboard-manager">
        <header className="eboard-manager__header">
          <div>
            <p className="eboard-manager__eyebrow">Manage Content</p>
            <h2>Executive Board</h2>
          </div>

          <button className="eboard-manager__outline-btn" onClick={resetForm}>
            Add New
          </button>
        </header>

        {message && <p className="eboard-manager__message">{message}</p>}

        <div className="eboard-manager__grid">
          <form className="eboard-manager__form" onSubmit={handleSave}>
            <h3>{editing ? 'Edit Position' : 'Add Position'}</h3>

            <label>
              Position Title
              <input
                name="position_title"
                value={form.position_title}
                onChange={handleChange}
                placeholder="President"
                required
              />
            </label>

            <label>
              Brother
              <select
                name="brother_id"
                value={form.brother_id}
                onChange={handleChange}
              >
                <option value="">Vacant</option>
                {brothers.map((brother) => (
                  <option key={brother.id} value={brother.id}>
                    {getBrotherLabel(brother)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Term
              <input
                name="term"
                value={form.term}
                onChange={handleChange}
                placeholder="2025-2026"
              />
            </label>

            <label>
              Description
              <input
                name="position_description"
                value={form.position_description}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>

            <label>
              Sort Order
              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
              />
            </label>

            <div className="eboard-manager__checks">
              <label>
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={form.is_visible}
                  onChange={handleChange}
                />
                Visible
              </label>
            </div>

            <div className="eboard-manager__actions">
              <button type="submit">
                {editing ? 'Save Changes' : 'Add Position'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>

          <div className="eboard-manager__table-wrap">
            <table className="eboard-manager__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Position</th>
                  <th>Brother</th>
                  <th>Term</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td>{position.sort_order}</td>
                    <td>{position.position_title}</td>
                    <td>{getBrotherName(position.brother_id)}</td>
                    <td>{position.term || '-'}</td>
                    <td>{position.is_visible ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => startEdit(position)}>Edit</button>
                      <button onClick={() => handleToggleVisible(position)}>
                        {position.is_visible ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => handleDelete(position)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}