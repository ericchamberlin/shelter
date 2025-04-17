import React, { useState, useEffect } from 'react';

function Decision({ profile, onSave, onDiscard, isSelected }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const storedImageUrl = sessionStorage.getItem(`profile-${profile.id}-image`);
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
    } else if (profile.photo_text_url && profile.photo_photo_url) {
      const usePhoto = Math.random() < 0.5;
      const selectedImageUrl = usePhoto ? profile.photo_photo_url : profile.photo_text_url;
      setImageUrl(selectedImageUrl);
      sessionStorage.setItem(`profile-${profile.id}-image`, selectedImageUrl);
    }
  }, [profile]);

  let cardStyle = "profile-card";
  if (isSelected === true) {
    cardStyle += " selected-save";
  } else if (isSelected === false) {
    cardStyle += " selected-discard";
  }

  return (
    <div className={cardStyle}>
      <h3>{profile.name}</h3>
      {imageUrl ? (
        <img src={imageUrl} alt={`Profile for ${profile.name}`} style={{ maxWidth: '100%', height: 'auto' }} />
      ) : (
        <p>{profile.description}</p>
      )}
      {onSave && onDiscard && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => onSave(profile)}>Stay</button>
          <button onClick={() => onDiscard(profile)}>Leave</button>
        </div>
      )}
    </div>
  );
}

export default Decision;
