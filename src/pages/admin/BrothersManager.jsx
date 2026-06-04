import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import './BrothersManager.css';

const emptyForm = {
  id: null,
  bond_no: '',
  name: '',
  nickname: '',
  pledge_class_id: '',
  status: 'Active',
  profile_image_url: '',
  sort_order: 0,
  is_visible: true,
  is_minimal: false,
};

export default function BrothersManager() {
  const [brothers, setBrothers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: brothersData, error: brothersError } = await supabase
      .from('brothers')
      .select('*')
      .order('sort_order', { ascending: true });

    const { data: classesData, error: classesError } = await supabase
      .from('pledge_classes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (brothersError || classesError) {
      console.error(brothersError || classesError);
      setMessage('Error loading admin data.');
      return;
    }

    setBrothers(brothersData || []);
    setClasses(classesData || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startEdit(brother) {
    setEditingId(brother.id);
    setForm({
      id: brother.id,
      bond_no: brother.bond_no || '',
      name: brother.name || '',
      nickname: brother.nickname || '',
      pledge_class_id: brother.pledge_class_id || '',
      status: brother.status || 'Active',
      profile_image_url: brother.profile_image_url || '',
      sort_order: brother.sort_order || 0,
      is_visible: brother.is_visible ?? true,
      is_minimal: brother.is_minimal ?? false,
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
    console.log('SAVE CLICKED');
    console.log('FORM DATA:', form);
    console.log('EDITING ID:', editingId);

    const payload = {
      bond_no: form.bond_no,
      name: form.name,
      nickname: form.nickname || null,
      pledge_class_id: form.pledge_class_id || null,
      status: form.status,
      profile_image_url: form.profile_image_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
      is_minimal: form.is_minimal,
    };
    console.log('PAYLOAD:', payload);
    const result = editingId
      ? await supabase
          .from('brothers')
          .update(payload)
          .eq('id', editingId)
          .select()
      : await supabase
          .from('brothers')
          .insert([payload])
          .select();

    console.log('SUPABASE SAVE RESULT:', result);
    console.log('SUPABASE SAVE DATA:', result.data);
    console.log('SUPABASE SAVE ERROR:', result.error);

    if (result.error) {
      console.error(result.error);
      setMessage('Save failed. Check console.');
      return;
    }

    setMessage(editingId ? 'Brother updated.' : 'Brother added.');
    resetForm();
    fetchData();
  }

  async function handleToggleVisible(brother) {
    const { error } = await supabase
      .from('brothers')
      .update({ is_visible: !brother.is_visible })
      .eq('id', brother.id);

    if (error) {
      console.error(error);
      setMessage('Visibility update failed.');
      return;
    }

    fetchData();
  }

  function getClassName(classId) {
    return classes.find((c) => c.id === classId)?.name || 'No class';
  }

  return (
    <AdminLayout activePage="brothers">
      <div className="brothers-manager">
        <header className="brothers-manager__header">
          <div>
            <p className="brothers-manager__eyebrow">Manage Content</p>
            <h2>Brothers</h2>
          </div>

          <button className="brothers-manager__outline-btn" onClick={resetForm}>
            Add New
          </button>
        </header>

        {message && <p className="brothers-manager__message">{message}</p>}

        <div className="brothers-manager__grid">
          <form className="brothers-manager__form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Brother' : 'Add Brother'}</h3>

            <label>
              Bond Number
              <input
                name="bond_no"
                value={form.bond_no}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Nickname
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
              />
            </label>

            <label>
              Pledge Class
              <select
                name="pledge_class_id"
                value={form.pledge_class_id}
                onChange={handleChange}
              >
                <option value="">No class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Alumni">Alumni</option>
                <option value="Inactive">Inactive</option>
                <option value="Memorial">Memorial</option>
              </select>
            </label>

            <label>
              Profile Image URL
              <input
                name="profile_image_url"
                value={form.profile_image_url}
                onChange={handleChange}
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

            <div className="brothers-manager__checks">
              <label>
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={form.is_visible}
                  onChange={handleChange}
                />
                Visible
              </label>

              <label>
                <input
                  type="checkbox"
                  name="is_minimal"
                  checked={form.is_minimal}
                  onChange={handleChange}
                />
                Minimal Card
              </label>
            </div>

            <div className="brothers-manager__actions">
              <button type="submit">
                {editingId ? 'Save Changes' : 'Add Brother'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>

          <div className="brothers-manager__table-wrap">
            <table className="brothers-manager__table">
              <thead>
                <tr>
                  <th>Bond</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {brothers.map((brother) => (
                  <tr key={brother.id}>
                    <td>#{brother.bond_no}</td>
                    <td>{brother.name}</td>
                    <td>{getClassName(brother.pledge_class_id)}</td>
                    <td>{brother.status}</td>
                    <td>{brother.is_visible ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => startEdit(brother)}>Edit</button>
                      <button onClick={() => handleToggleVisible(brother)}>
                        {brother.is_visible ? 'Hide' : 'Show'}
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