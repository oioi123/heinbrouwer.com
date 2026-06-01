import React from 'react';
import { PHOTOS } from '../scene/constants';

const PhotoNavigationUI = React.memo(({
  currentPhotoIndex,
  totalPhotos,
  onNext,
  onPrev,
  onClose,
  isVisible
}) => {
  if (!isVisible) return null;

  const roundButton = {
    pointerEvents: 'auto',
    padding: '1rem',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 55
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '0 2rem',
      zIndex: 50
    }}>
      <button onClick={onPrev} style={roundButton}>←</button>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          height: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <img
            src={PHOTOS[currentPhotoIndex]}
            alt={`Photo ${currentPhotoIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
        </div>
        <p style={{ color: 'white', marginTop: '1rem', fontSize: '1rem' }}>
          {currentPhotoIndex + 1} / {totalPhotos}
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '4rem',
          right: '2rem',
          pointerEvents: 'auto',
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 55
        }}
      >
        ✕
      </button>

      <button onClick={onNext} style={roundButton}>→</button>
    </div>
  );
});

export default PhotoNavigationUI;
