import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import BrotherPhotoEditor from './BrotherPhotoEditor';
import './BrothersManager.css';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const emptyForm = {
  id: null,
  bond_no: '',
  name: '',
  nickname: '',
  pledge_class_id: '',
  status: 'Active',
  profile_image_url: '',
  profile_storage_path: '',
  sort_order: 0,
  is_visible: true,
  is_minimal: false,
  profile_image_x: 50,
  profile_image_y: 50,
  profile_image_scale: 1,
};

export default function BrothersManager() {
  const [brothers, setBrothers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [photoFile, setPhotoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPreviewImage(form.profile_image_url || '');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile, form.profile_image_url]);

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
      showMessage('Error loading admin data.', 'error');
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
    setPhotoFile(null);
    setPhotoEditorOpen(false);

    setForm({
      id: brother.id,
      bond_no: brother.bond_no || '',
      name: brother.name || '',
      nickname: brother.nickname || '',
      pledge_class_id: brother.pledge_class_id || '',
      status: brother.status || 'Active',
      profile_image_url: brother.profile_image_url || '',
      profile_storage_path: brother.profile_storage_path || '',
      profile_image_x: brother.profile_image_x ?? 50,
      profile_image_y: brother.profile_image_y ?? 50,
      profile_image_scale: brother.profile_image_scale ?? 1,
      sort_order: brother.sort_order || 0,
      is_visible: brother.is_visible ?? true,
      is_minimal: brother.is_minimal ?? false,
    });

    setMessage('');
    setMessageType('info');
  }
  function resetForm({ keepMessage = false } = {}) {
  setEditingId(null);
  setPhotoFile(null);
  setPhotoEditorOpen(false);
  setForm(emptyForm);

  if (!keepMessage) {
    setMessage('');
    setMessageType('info');
  }
  }

  function makeSafeFileName(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9._]/g, '');
  }

  function getSelectedClassName() {
    const selectedClass = classes.find(
      (cls) => cls.id === form.pledge_class_id
    );

    return selectedClass?.name || 'uncategorized';
  }

  async function uploadBrotherPhoto() {
    if (!photoFile) {
      return {
        photoUrl: form.profile_image_url || null,
        storagePath: form.profile_storage_path || null,
      };
    }

    const extension = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const classFolder = makeSafeFileName(getSelectedClassName());
    const safeBondNo = makeSafeFileName(form.bond_no || 'unknown');
    const safeBrotherName = makeSafeFileName(form.name || 'brother');
    const timestamp = Date.now();

    const storagePath = `${classFolder}/${safeBondNo}_${safeBrotherName}_${timestamp}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('brother-photos')
      .upload(storagePath, photoFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('brother-photos')
      .getPublicUrl(storagePath);

    return {
      photoUrl: data.publicUrl,
      storagePath,
    };
  }

  function validatePhoto(file) {
  if (!file) return true;

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    showMessage('Only JPG, PNG, and WebP images are allowed.', 'error');
    return false;
  }

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    showMessage('Unsupported image extension.', 'error');
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    showMessage('Image must be smaller than 10 MB.', 'error');
    return false;
  }

  return true;
  }

  function showMessage(text, type = 'info') {
  setMessage(text);
  setMessageType(type);
  }   

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const oldStoragePath = form.profile_storage_path;
      const uploadedPhoto = await uploadBrotherPhoto();

      const payload = {
        bond_no: form.bond_no,
        name: form.name,
        nickname: form.nickname || null,
        pledge_class_id: form.pledge_class_id || null,
        status: form.status,
        profile_image_url: uploadedPhoto.photoUrl,
        profile_storage_path: uploadedPhoto.storagePath,
        profile_image_x: Number(form.profile_image_x ?? 50),
        profile_image_y: Number(form.profile_image_y ?? 50),
        profile_image_scale: Number(form.profile_image_scale ?? 1),
        sort_order: Number(form.sort_order) || 0,
        is_visible: form.is_visible,
        is_minimal: form.is_minimal,
      };

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

      if (result.error) {
        console.error(result.error);
        showMessage('Save failed. Check console.', 'error');
        return;
      }

      if (
        photoFile &&
        oldStoragePath &&
        oldStoragePath !== uploadedPhoto.storagePath
      ) {
        const { error: removeError } = await supabase.storage
          .from('brother-photos')
          .remove([oldStoragePath]);

        if (removeError) {
          console.error('Old brother photo delete failed:', removeError);
        }
      }

      showMessage(
        editingId ? 'Brother updated.' : 'Brother added.',
        'success'
      );

      resetForm({ keepMessage: true });
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage('Save failed. Check console.');
    }
  }

  async function handleToggleVisible(brother) {
    const { error } = await supabase
      .from('brothers')
      .update({ is_visible: !brother.is_visible })
      .eq('id', brother.id);

    if (error) {
      console.error(error);
      showMessage('Visibility update failed.', 'error');
      return;
    }

    fetchData();
  }

  function getClassName(classId) {
    return classes.find((c) => c.id === classId)?.name || 'No class';
  }
  
  async function handleDeleteBrother(brother) {
  const confirmed = window.confirm(
    `Delete ${brother.name}? This will also remove their E-board role and profile image.`
  );

  if (!confirmed) return;

  try {
    const { error: eboardError } = await supabase
      .from('executive_board')
      .delete()
      .eq('brother_id', brother.id);

    if (eboardError) throw eboardError;

    const { error: brotherError } = await supabase
      .from('brothers')
      .delete()
      .eq('id', brother.id);

    if (brotherError) throw brotherError;

    if (brother.profile_storage_path) {
      const { error: storageError } = await supabase.storage
        .from('brother-photos')
        .remove([brother.profile_storage_path]);

      if (storageError) {
        console.error('Profile photo delete failed:', storageError);
      }
    }

    if (editingId === brother.id) resetForm();

    showMessage('Brother deleted.', 'success');
    fetchData();
  } catch (error) {
    console.error(error);
    showMessage('Delete failed. Check console.', 'error');
  }
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

        {message && (
          <p
            className={`brothers-manager__message brothers-manager__message--${messageType}`}
          >
            {message}
          </p>
        )}

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
              Upload Profile Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  if (!validatePhoto(file)) {
                    e.target.value = '';
                    setPhotoFile(null);
                    return;
                  }

                  setMessage('');
                  setMessageType('info');
                  setPhotoFile(file);
                }}
              />
            </label>

            <button
              type="button"
              className="brothers-manager__outline-btn"
              onClick={() => setPhotoEditorOpen(true)}
              disabled={!previewImage}
            >
              Edit Photo
            </button>

            {previewImage && (
              <div className="brothers-manager__photo-preview">
                <img
                  src={previewImage}
                  alt="Profile preview"
                  style={{
                    transform: `translate(${(form.profile_image_x ?? 50) - 50}%, ${
                      (form.profile_image_y ?? 50) - 50
                    }%) scale(${form.profile_image_scale ?? 1})`,
                  }}
                />
              </div>
            )}

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
              <button type="button" onClick={() => resetForm()}>
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
                    <button onClick={() => handleDeleteBrother(brother)}>
                      Delete
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {photoEditorOpen && (
          <BrotherPhotoEditor
            imageSrc={previewImage}
            x={Number(form.profile_image_x ?? 50)}
            y={Number(form.profile_image_y ?? 50)}
            scale={Number(form.profile_image_scale ?? 1)}
            onClose={() => setPhotoEditorOpen(false)}
            onChange={(updates) =>
              setForm((prev) => ({
                ...prev,
                profile_image_x: updates.x ?? prev.profile_image_x,
                profile_image_y: updates.y ?? prev.profile_image_y,
                profile_image_scale:
                  updates.scale ?? prev.profile_image_scale,
              }))
            }
          />
        )}
      </div>
    </AdminLayout>
  );
}