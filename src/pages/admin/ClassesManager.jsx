import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import './ClassesManager.css';

const emptyForm = {
  id: null,
  name: '',
  nickname: '',
  symbol: '',
  crossed_semester: '',
  sort_order: 0,
  is_visible: true,
};

export default function ClassesManager() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    const { data, error } = await supabase
      .from('pledge_classes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      setMessage('Error loading pledge classes.');
      return;
    }

    setClasses(data || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startEdit(cls) {
    setEditingId(cls.id);
    setForm({
      id: cls.id,
      name: cls.name || '',
      nickname: cls.nickname || '',
      symbol: cls.symbol || '',
      crossed_semester: cls.crossed_semester || '',
      sort_order: cls.sort_order || 0,
      is_visible: cls.is_visible ?? true,
    });
    setMessage('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name,
      nickname: form.nickname || null,
      symbol: form.symbol || null,
      crossed_semester: form.crossed_semester || null,
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
    };

    const result = editingId
      ? await supabase
          .from('pledge_classes')
          .update(payload)
          .eq('id', editingId)
          .select()
      : await supabase
          .from('pledge_classes')
          .insert([payload])
          .select();

    if (result.error) {
      console.error(result.error);
      setMessage('Save failed. Check console.');
      return;
    }

    setMessage(editingId ? 'Class updated.' : 'Class added.');
    resetForm();
    fetchClasses();
  }

  async function handleToggleVisible(cls) {
    const { error } = await supabase
      .from('pledge_classes')
      .update({ is_visible: !cls.is_visible })
      .eq('id', cls.id);

    if (error) {
      console.error(error);
      setMessage('Visibility update failed.');
      return;
    }

    fetchClasses();
  }

  return (
    <AdminLayout activePage="classes">
      <div className="classes-manager">
        <header className="classes-manager__header">
          <div>
            <p className="classes-manager__eyebrow">Manage Content</p>
            <h2>Pledge Classes</h2>
          </div>

          <button className="classes-manager__outline-btn" onClick={resetForm}>
            Add New
          </button>
        </header>

        {message && <p className="classes-manager__message">{message}</p>}

        <div className="classes-manager__grid">
          <form className="classes-manager__form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Class' : 'Add Class'}</h3>

            <label>
              Class Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alpha Chi"
                required
              />
            </label>

            <label>
              Class Nickname
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="CR∐$7DERS"
              />
            </label>

            <label>
              Greek Symbol
              <input
                name="symbol"
                value={form.symbol}
                onChange={handleChange}
                placeholder="ΑΧ"
              />
            </label>

            <label>
              Crossed Semester
              <input
                name="crossed_semester"
                value={form.crossed_semester}
                onChange={handleChange}
                placeholder="Spring 2026"
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

            <div className="classes-manager__checks">
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

            <div className="classes-manager__actions">
              <button type="submit">
                {editingId ? 'Save Changes' : 'Add Class'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>

          <div className="classes-manager__table-wrap">
            <table className="classes-manager__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Nickname</th>
                  <th>Symbol</th>
                  <th>Crossed</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.sort_order}</td>
                    <td>{cls.name}</td>
                    <td>{cls.nickname || '-'}</td>
                    <td>{cls.symbol || '-'}</td>
                    <td>{cls.crossed_semester || '-'}</td>
                    <td>{cls.is_visible ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => startEdit(cls)}>Edit</button>
                      <button onClick={() => handleToggleVisible(cls)}>
                        {cls.is_visible ? 'Hide' : 'Show'}
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