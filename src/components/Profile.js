import React from 'react';

function Profile({ profile }) {
  return (
    <div>
      <h3>{profile.name}</h3>
      <p>{profile.description}</p>
    </div>
  );
}

export default Profile;
