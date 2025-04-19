import React from 'react';

function ModeSelect() {
  return (
    <div className="mode-select">
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => window.location.href = '/'}>Student Mode</button>
        <button onClick={() => window.location.href = '/student-session-join'}>Join Session</button>
        <button onClick={() => window.location.href = '/teacher-login'}>Teacher Login</button>
      </nav>
    </div>
  );
}

export default ModeSelect;
