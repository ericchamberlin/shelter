import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Scenario from './components/Scenario';
import Decision from './components/Decision';
import Tally from './components/Tally';
import TeacherLogin from './components/TeacherLogin';
import StudentSessionJoin from './components/StudentSessionJoin';
import StartPage from './components/StartPage';
import './App.css';

import { profiles } from './profiles';

function StudentVotingInterface({ sessionCode }) {
  // Student mode state and functions
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [reviewingAll, setReviewingAll] = useState(false);

  const handleNext = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setReviewingAll(true);
    }
  };

  const handleSave = (profile) => {
    if (selectedProfiles.length < 8) {
      if (!selectedProfiles.includes(profile.id)) {
        setSelectedProfiles([...selectedProfiles, profile.id]);
      }
    } else {
      alert('You can only save 8 people.');
    }
  };

  const handleDiscard = (profile) => {
    const newSelectedProfiles = selectedProfiles.filter(id => id !== profile.id);
    setSelectedProfiles(newSelectedProfiles);
  };

  const results = profiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    votes: selectedProfiles.filter(id => id === profile.id).length,
  }));

  const currentProfile = profiles[currentProfileIndex];

  const handleSubmitVotes = async () => {
    if (!sessionCode) {
      alert("Session code not provided.");
      return;
    }
    // Look up session id using session code from the sessions table
    // Look up session id using session code from the sessions table.
    // The session record must be pre-created by the teacher.
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('id')
      .eq('session_code', sessionCode)
      .single();
    if (sessionError || !sessionData) {
      console.error("Session lookup error:", sessionError);
      alert("Session not found. Please ask your teacher to start a session.");
      return;
    }
    const session_id = sessionData.id;

    // Get current user; for testing, use a dummy user if not available
    let user;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        user = { id: "00000000-0000-0000-0000-000000000001" };
      } else {
        user = authData.user;
      }
    } catch (err) {
      user = { id: "00000000-0000-0000-0000-000000000001" };
    }

    // For each selected profile, create an aggregate update record
    const aggregateUpdates = selectedProfiles.map(pid => ({
      session_id: session_id,
      profile_id: pid,
      save_count: 1,      // Each vote increments the save count by 1
      discard_count: 0 // Note: discard_count is not handled by the increment_vote function
    }));

    // Call the increment_vote function for each selected profile
    const votePromises = selectedProfiles.map(pid =>
      supabase.rpc('increment_vote', { _session_id: session_id, _profile_id: pid })
    );

    try {
      const results = await Promise.all(votePromises);
      // Check if any RPC call resulted in an error
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error("Error submitting votes via RPC:", errors);
        alert("Error submitting some votes.");
      } else {
        alert("Votes submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting votes:", error);
      alert("Error submitting votes.");
    }
  };

  return (
    <div className="app-container">
      <Tally results={results} />
      <div className="main-content">
        <Scenario />
        {!reviewingAll ? (
          <div>
            <Decision key={currentProfile.id} profile={currentProfile} />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleNext}>Next</button>
              <button onClick={() => setReviewingAll(true)} style={{ marginLeft: '10px' }}>
                Finalize Selection
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="decision-grid">
              {profiles.map(profile => (
                <Decision
                  key={profile.id}
                  profile={profile}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                  isSelected={selectedProfiles.includes(profile.id)}
                />
              ))}
            </div>
            <button onClick={handleSubmitVotes}>Submit Votes</button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState('start'); // modes: 'start', 'student', 'teacher', or 'join'
  const [studentSessionCode, setStudentSessionCode] = useState('');

  const handleSessionJoin = (code) => {
    setStudentSessionCode(code);
    // Optionally, you could verify the code against your backend here.
  };

  return (
    <div className="App">
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => { setMode('student'); setStudentSessionCode(''); }}>Student Mode</button>
        <button onClick={() => { setMode('join'); setStudentSessionCode(''); }}>Join Session</button>
        <button onClick={() => setMode('teacher')}>Teacher Login</button>
      </nav>
      <a href="https://www.lessonresources.org/wiki/images/archive/7/74/20220909003539!FallOutBombShelterPeopleList.pdf" target="_blank" rel="noopener noreferrer">
        Original Activity
      </a>
      {mode === 'start' ? (
        <StartPage onBegin={() => setMode('student')} />
      ) : mode === 'teacher' ? (
        <TeacherLogin />
      ) : mode === 'join' ? (
        studentSessionCode ? (
          <StudentVotingInterface sessionCode={studentSessionCode} />
        ) : (
          <StudentSessionJoin onJoin={handleSessionJoin} />
        )
      ) : (
        <StudentVotingInterface sessionCode={studentSessionCode} />
      )}
    </div>
  );
}

export default App;
