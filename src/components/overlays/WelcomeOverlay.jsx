import { useState, useEffect } from 'react';

const WelcomeOverlay = ({ isInteracting }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isInteracting) {
      setIsVisible(false);
    }
  }, [isInteracting]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      zIndex: 10,
      fontFamily: 'Arial, sans-serif',
      pointerEvents: 'none'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderRadius: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Welcome to My Interactive Portfolio
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          Click on different items to explore: photo frames, degree certificate, CV on the desk,
          and laptop screen!
        </p>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
