import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import './ArchiveUpload.css';

const CATEGORIES = [
  'Rush',
  'Events',
  'Formals',
  'Retreats',
  'Pledge Classes',
  'Candids',
];

const EMPTY_FORM = {
  title: '',
  category: 'Rush',
  year: '',
  event_date: '',
  caption: '',
  tall: false,
};

export default function ArchiveUpload() {
  const [archives, setArchives] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArchives();
  }, []);

  async function fetchArchives() {
    const { data, error } = await supabase
      .from('apsirho')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error(error);
      setMessage('Error loading archives.');
      return;
    }

    setArchives(data || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function resetForm() {
    setFile(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage('');
  }

  function startEdit(item) {
    setEditingId(item.id);
    setFile(null);
    setForm({
      title: item.title || '',
      category: item.category || 'Rush',
      year: item.year || '',
      event_date: item.event_date || '',
      caption: item.caption || '',
      tall: item.tall ?? false,
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function makeSafeFileName(fileName) {
    return fileName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.\-_]/g, '');
  }

  async function uploadArchiveImage() {
    if (!file) return null;

    const safeName = `${Date.now()}-${makeSafeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from('archive')
      .upload(safeName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('archive')
      .getPublicUrl(safeName);

    return {
      imageUrl: publicUrlData.publicUrl,
      storagePath: safeName,
      fileName: file.name,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingUpload(true);
    setMessage('');

    try {
      const uploadedImage = await uploadArchiveImage();

      if (!editingId && !uploadedImage) {
        throw new Error('Please select an image.');
      }

      const payload = {
        title: form.title,
        category: form.category,
        year: Number(form.year),
        event_date: form.event_date || null,
        caption: form.caption || null,
        tall: form.tall,
      };

      if (uploadedImage) {
        payload.file_name = uploadedImage.fileName;
        payload.image_url = uploadedImage.imageUrl;
        payload.storage_path = uploadedImage.storagePath;
      }

      const result = editingId
        ? await supabase
            .from('apsirho')
            .update(payload)
            .eq('id', editingId)
            .select()
        : await supabase
            .from('apsirho')
            .insert([payload])
            .select();

      console.log('EDITING ID:', editingId);
      console.log('SAVE RESULT:', result);
      console.log('SAVE DATA:', result.data);
      console.log('SAVE ERROR:', result.error);

      if (result.error) throw result.error;

      setMessage(editingId ? 'Archive updated.' : 'Archive uploaded.');
      resetForm();
      e.target.reset();
      fetchArchives();
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Save failed.');
    } finally {
      setLoadingUpload(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('archive')
          .remove([item.storage_path]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('apsirho')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      setMessage('Archive deleted.');
      fetchArchives();
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Delete failed.');
    }
  }

  return (
    <AdminLayout activePage="archives">
      <div className="archive-manager">
        <header className="archive-manager__header">
          <div>
            <p className="archive-manager__eyebrow">Manage Content</p>
            <h2>Archives</h2>
          </div>

          <button className="archive-manager__outline-btn" onClick={resetForm}>
            {editingId ? 'Cancel Edit' : 'Reset'}
          </button>
        </header>

        {message && <p className="archive-manager__message">{message}</p>}

        <div className="archive-manager__grid">
          <form onSubmit={handleSubmit} className="archive-manager__form">
            <h3>{editingId ? 'Edit Archive Item' : 'Add Archive Item'}</h3>

            <label>
              Image {editingId && <span>Optional: upload to replace</span>}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required={!editingId}
              />
            </label>

            <label>
              Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Year
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2025"
                required
              />
            </label>

            <label>
              Event Date
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Caption
              <textarea
                name="caption"
                value={form.caption}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className="archive-manager__checks">
              <label>
                <input
                  type="checkbox"
                  name="tall"
                  checked={form.tall}
                  onChange={handleChange}
                />
                Tall image
              </label>
            </div>

            <div className="archive-manager__actions">
              <button type="submit" disabled={loadingUpload}>
                {loadingUpload
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Upload Archive'}
              </button>

              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>

          <div className="archive-manager__table-wrap">
            <table className="archive-manager__table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Year</th>
                  <th>Tall</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {archives.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="archive-manager__thumb"
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.year}</td>
                    <td>{item.tall ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => startEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item)}>Delete</button>
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