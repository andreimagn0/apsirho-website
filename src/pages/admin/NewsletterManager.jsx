import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../layouts/AdminLayout';
import './NewsletterManager.css';

const CATEGORIES = [
  'Chapter Update',
  'Event Recap',
  'Alumni Spotlight',
  'Brother Spotlight',
  'Announcement',
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Chapter Update',
  author: '',
  cover_image_url: '',
  published_date: '',
  is_published: false,
  sort_order: 0,
};

export default function NewsletterManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.error(error);
      setMessage('Error loading newsletter posts.');
      return;
    }

    setPosts(data || []);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !editingId ? { slug: slugify(value) } : {}),
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setFile(null);
    setEditingId(null);
    setMessage('');
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Chapter Update',
      author: post.author || '',
      cover_image_url: post.cover_image_url || '',
      published_date: post.published_date || '',
      is_published: post.is_published ?? false,
      sort_order: post.sort_order || 0,
    });
    setFile(null);
    setMessage('');
  }

  function makeSafeFileName(fileName) {
    return fileName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.\-_]/g, '');
  }

  async function uploadCoverImage() {
    if (!file) return form.cover_image_url || null;

    const safeName = `${Date.now()}-${makeSafeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from('newsletter-images')
      .upload(safeName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('newsletter-images')
      .getPublicUrl(safeName);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const coverImageUrl = await uploadCoverImage();

      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content || null,
        category: form.category,
        author: form.author || null,
        cover_image_url: coverImageUrl,
        published_date: form.published_date || null,
        is_published: form.is_published,
        sort_order: Number(form.sort_order) || 0,
      };

      const result = editingId
        ? await supabase
            .from('newsletters')
            .update(payload)
            .eq('id', editingId)
            .select()
        : await supabase
            .from('newsletters')
            .insert([payload])
            .select();

      if (result.error) throw result.error;

      setMessage(editingId ? 'Newsletter updated.' : 'Newsletter created.');
      resetForm();
      fetchPosts();
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Save failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleTogglePublished(post) {
    const { error } = await supabase
      .from('newsletters')
      .update({ is_published: !post.is_published })
      .eq('id', post.id);

    if (error) {
      console.error(error);
      setMessage('Publish update failed.');
      return;
    }

    fetchPosts();
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;

    const { error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', post.id);

    if (error) {
      console.error(error);
      setMessage('Delete failed.');
      return;
    }

    setMessage('Newsletter deleted.');
    fetchPosts();
  }

  return (
    <AdminLayout activePage="newsletter">
      <div className="newsletter-manager">
        <header className="newsletter-manager__header">
          <div>
            <p className="newsletter-manager__eyebrow">Manage Content</p>
            <h2>Newsletter</h2>
          </div>

          <button className="newsletter-manager__outline-btn" onClick={resetForm}>
            Add New
          </button>
        </header>

        {message && <p className="newsletter-manager__message">{message}</p>}

        <div className="newsletter-manager__grid">
          <form className="newsletter-manager__form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Post' : 'Create Post'}</h3>

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
              Slug
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="spring-rush-recap"
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
              Author
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Alpha Psi Rho"
              />
            </label>

            <label>
              Published Date
              <input
                type="date"
                name="published_date"
                value={form.published_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Cover Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <label>
              Cover Image URL
              <input
                name="cover_image_url"
                value={form.cover_image_url}
                onChange={handleChange}
                placeholder="Optional manual URL"
              />
            </label>

            <label>
              Excerpt
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <label>
              Content
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="8"
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

            <div className="newsletter-manager__checks">
              <label>
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                Published
              </label>
            </div>

            <div className="newsletter-manager__actions">
              <button type="submit" disabled={uploading}>
                {uploading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Post'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>

          <div className="newsletter-manager__table-wrap">
            <table className="newsletter-manager__table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="newsletter-manager__thumb"
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{post.title}</td>
                    <td>{post.category}</td>
                    <td>{post.published_date || '-'}</td>
                    <td>{post.is_published ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => startEdit(post)}>Edit</button>
                      <button onClick={() => handleTogglePublished(post)}>
                        {post.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => handleDelete(post)}>Delete</button>
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