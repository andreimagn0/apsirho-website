import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './ArchiveUpload.css';

const CATEGORIES = ['Rush', 'Events', 'Formals', 'Retreats', 'Pledge Classes', 'Candids'];

export default function ArchiveUpload() {
  const [allowed, setAllowed] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rush');
  const [year, setYear] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [caption, setCaption] = useState('');
  const [tall, setTall] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState('');

  // 🔐 Step 6: Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setAllowed(false);
        setLoadingAccess(false);
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }

      setLoadingAccess(false);
    }

    checkAdmin();
  }, []);

  // 📤 Upload logic
  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingUpload(true);
    setMessage('');

    try {
      if (!file) throw new Error('Please select an image.');

      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      // Upload to bucket
      const { error: uploadError } = await supabase.storage
        .from('archive')
        .upload(safeName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('archive')
        .getPublicUrl(safeName);

      const imageUrl = publicUrlData.publicUrl;

      // Insert into DB
      const { error: insertError } = await supabase
        .from('apsirho')
        .insert([
          {
            title,
            category,
            year,
            event_date: eventDate || null,
            caption: caption || null,
            file_name: file.name,
            image_url: imageUrl,
            tall,
          },
        ]);

      if (insertError) throw insertError;

      setMessage('Upload successful.');

      // Reset form
      setFile(null);
      setTitle('');
      setCategory('Rush');
      setYear('');
      setEventDate('');
      setCaption('');
      setTall(false);
      e.target.reset();

    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Upload failed.');
    } finally {
      setLoadingUpload(false);
    }
  }

  // ⏳ Loading state
  if (loadingAccess) {
    return <p>Checking admin access...</p>;
  }

  // 🚫 Not allowed
  if (!allowed) {
    return <p>Admin access only.</p>;
  }

  // ✅ Allowed → show upload form
  return (
    <div className="archive-upload">
      <div className="container">
        <h1>Archive Upload</h1>

        <form onSubmit={handleSubmit} className="archive-upload__form">

          <label>
            Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label>
            Year
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              required
            />
          </label>

          <label>
            Event Date
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </label>

          <label>
            Caption
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="3"
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={tall}
              onChange={(e) => setTall(e.target.checked)}
            />
            Tall image
          </label>

          <button type="submit" disabled={loadingUpload}>
            {loadingUpload ? 'Uploading...' : 'Upload'}
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}