import React, { useState } from 'react';
import TeacherDashboard from './TeacherDashboard';
import { supabase } from '../supabaseClient';

function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Ensure the teacher record exists in the users table.
      const { data: userData, error: userQueryError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();
      if (userQueryError || !userData) {
      // Insert the teacher record if not found.
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({ id: data.user.id, email: data.user.email, is_teacher: true, password: "dummy_password" })
        .select('id')
        .single();
        if (insertError || !insertData) {
          setError(insertError.message);
          return;
        }
      }
      setLoggedIn(true);
    }
  };

  if (loggedIn) {
    return <TeacherDashboard />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher Login</h2>
      <form onSubmit={handleLogin}>
        <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '300px', height: '40px', fontSize: '18px', padding: '10px' }}
        />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '300px', height: '40px', fontSize: '18px', padding: '10px' }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TeacherLogin;
