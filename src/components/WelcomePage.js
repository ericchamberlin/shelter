import React from 'react';
import './WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-page">
      <h1>BOMB SHELTER CRITICAL THINKING ACTIVITY</h1>
      <video src="/opening_video.mp4" autoPlay loop width="800" height="450" />
      <button onClick={() => window.location.href = '/student-voting/'}>Begin Activity</button>
    </div>
  );
}

export default WelcomePage;
