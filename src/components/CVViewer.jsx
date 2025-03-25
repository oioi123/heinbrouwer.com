import React, { useState, useEffect } from 'react';

const CVViewer = ({ isVisible, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  const pdfPaths = [
    "/cv-hein-brouwer.pdf",
    "./cv-hein-brouwer.pdf",
    "cv-hein-brouwer.pdf",
    "/public/cv-hein-brouwer.pdf",
    process.env.PUBLIC_URL + "/cv-hein-brouwer.pdf"
  ];

  useEffect(() => {
    if (isVisible) {
      console.log("CV Viewer is now visible");
      setIsLoading(true);
      setLoadError(false);
      setCurrentPathIndex(0); // Reset index when reopened
    }
  }, [isVisible]);

  useEffect(() => {
    if (loadError && currentPathIndex < pdfPaths.length - 1) {
      setTimeout(() => {
        console.log(`Trying next PDF path: ${pdfPaths[currentPathIndex + 1]}`);
        setCurrentPathIndex((prevIndex) => prevIndex + 1);
        setLoadError(false);
        setIsLoading(true);
      }, 500); // Prevents rapid re-renders
    }
  }, [loadError, currentPathIndex, pdfPaths]);

  if (!isVisible) return null;

  const handleLoadError = () => {
    console.error("Error loading PDF");
    setLoadError(true);
    setIsLoading(false);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          maxWidth: '900px',
          width: '100%',
          height: '90vh',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div 
          style={{
            padding: '15px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>Curriculum Vitae</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {isLoading && !loadError && (
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 2s linear infinite',
                margin: '0 auto 20px'
              }}
            ></div>
            <p>Loading CV...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: loadError ? '20px' : 0 }}>
          {!loadError ? (
            <iframe 
              src={pdfPaths[currentPathIndex]} 
              title="CV Document"
              style={{
                border: 'none',
                width: '100%',
                height: '100%',
                display: isLoading ? 'none' : 'block'
              }}
              onLoad={() => setIsLoading(false)}
              onError={handleLoadError}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2 style={{ color: '#c0392b' }}>Failed to load CV</h2>
              <p>There was an error loading the document.</p>
            </div>
          )}
        </div>

        {!loadError && (
          <div 
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <a 
              href={pdfPaths[currentPathIndex]} 
              download="cv.pdf"
              style={{
                padding: '8px 15px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Download CV
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVViewer;
