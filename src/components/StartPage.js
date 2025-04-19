import React from 'react';
import './WelcomePage.css';

function StartPage({ onBegin }) {
  return (
    <div className="welcome-page">
      <h1>BOMB SHELTER CRITICAL THINKING ACTIVITY</h1>
      <video src="/opening_video.mp4" width="640" height="360" controls autoPlay muted loop />
      <button onClick={onBegin}>Begin Activity</button>
    </div>
  );
}

export default StartPage;
