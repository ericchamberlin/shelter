import React, { useState } from 'react';

function StudentSessionJoin({ onJoin }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    if (trimmedCode) {
      onJoin(trimmedCode);
    } else {
      alert("Please enter a valid session code.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Join Class Session</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter session code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Join Session</button>
      </form>
    </div>
  );
}

export default StudentSessionJoin;
