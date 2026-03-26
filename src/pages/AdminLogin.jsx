import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in successfully.');
      window.location.hash = '#admin-upload'; // redirect
    }
  }

  return (
    <div className="archive-upload">
      <div className="container">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin} className="archive-upload__form">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log in</button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}