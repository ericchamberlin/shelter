import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { profiles } from '../profiles';

function TeacherDashboard() {
  const [sessionCode, setSessionCode] = useState('');
  const [results, setResults] = useState([]);

  const [sessionId, setSessionId] = useState(null);

  const startSession = async () => {
    // Generate a random session code.
    const code = Math.random().toString(36).substring(2,8).toUpperCase();

    // Retrieve the teacher's user id.
    let teacher;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        teacher = { id: "00000000-0000-0000-0000-000000000001", email: "dummy@dummy.com" };
      } else {
        teacher = authData.user;
      }
    } catch (err) {
      teacher = { id: "00000000-0000-0000-0000-000000000001", email: "dummy@dummy.com" };
    }
    // Ensure the teacher record exists in the "users" table.
    const { data: userData, error: userQueryError } = await supabase
      .from('users')
      .select('id')
      .eq('id', teacher.id)
      .single();
    if (userQueryError || !userData) {
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({ id: teacher.id, email: teacher.email, is_teacher: true })
        .select('id')
        .single();
      if (insertError || !insertData) {
        console.error("Error ensuring teacher record:", insertError);
        alert("Error ensuring teacher record in database.");
        return;
      }
    }

    // Insert a new session record into the "sessions" table.
    const { data: newSessionData, error: newSessionError } = await supabase
      .from('sessions')
      .insert({ session_code: code, teacher_id: teacher.id })
      .select('id')
      .single();
    if (newSessionError || !newSessionData) {
      console.error("Error creating session:", newSessionError);
      alert("Error creating session. Please try again.");
      return;
    }
    setSessionCode(code);
    setSessionId(newSessionData.id);
  };

  const fetchResults = useCallback(async () => {
    if (!sessionId) return;
    const { data, error } = await supabase
      .from('aggregate_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('profile_id', { ascending: true });
    if (error) {
      console.error('Error fetching results:', error);
    } else {
      console.log("Fetched results:", data);
      setResults(data);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionCode) {
      const timer = setInterval(fetchResults, 5000);
      return () => clearInterval(timer);
    }
  }, [sessionCode, fetchResults]);

  const sortedResults = [...results].sort((a, b) => b.save_count - a.save_count);
  const stayGroup = sortedResults.slice(0, 8);
  const leaveGroup = sortedResults.slice(8);
  const tiedGroup = [];

  if (leaveGroup.length > 0 && stayGroup.length > 0) {
    const lastStayCount = stayGroup[stayGroup.length - 1].save_count;
    const firstLeaveCount = leaveGroup[0].save_count;
    if (lastStayCount === firstLeaveCount) {
      while (leaveGroup.length > 0 && leaveGroup[0].save_count === lastStayCount) {
        tiedGroup.push(leaveGroup.shift());
      }
      while (stayGroup.length > 0 && stayGroup[stayGroup.length - 1].save_count === lastStayCount) {
        tiedGroup.push(stayGroup.pop());
      }
    }
  }

  const [showPhotos, setShowPhotos] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher Dashboard</h2>
      {!sessionCode ? (
        <button onClick={startSession}>Start Class Session</button>
      ) : (
        <div>
          <p><strong>Session Code:</strong> {sessionCode}</p>
          <h3>Aggregate Results:</h3>
          <label>
            <input type="checkbox" checked={showPhotos} onChange={() => setShowPhotos(!showPhotos)} />
            Show Photos
          </label>
          <h4>Stay Group</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {stayGroup.map(result => {
              const profile = profiles.find(p => p.id === Number(result.profile_id));
              return (
                <div key={profile.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                  <h4>{profile.name}</h4>
                  <img src={showPhotos ? profile.photo_photo_url : profile.photo_text_url} alt={`Profile for ${profile.name}`} style={{ maxWidth: '100%', height: 'auto' }} />
                  <p><strong>Votes: {result.save_count}</strong></p>
                </div>
              );
            })}
          </div>
          <h4>Leave Group</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {leaveGroup.map(result => {
              const profile = profiles.find(p => p.id === Number(result.profile_id));
              return (
                <div key={profile.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                  <h4>{profile.name}</h4>
                  <img src={showPhotos ? profile.photo_photo_url : profile.photo_text_url} alt={`Profile for ${profile.name}`} style={{ maxWidth: '100%', height: 'auto' }} />
                  <p><strong>Votes: {result.save_count}</strong></p>
                </div>
              );
            })}
          </div>
          {tiedGroup.length > 0 && (
            <>
              <h4>Tied Group</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {tiedGroup.map(result => {
                  const profile = profiles.find(p => p.id === Number(result.profile_id));
                  return (
                    <div key={profile.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                      <h4>{profile.name}</h4>
                      <img src={showPhotos ? profile.photo_photo_url : profile.photo_text_url} alt={`Profile for ${profile.name}`} style={{ maxWidth: '100%', height: 'auto' }} />
                      <p><strong>Votes: {result.save_count}</strong></p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
