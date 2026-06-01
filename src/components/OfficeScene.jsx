import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import ThesisDisplayComponent from './ThesisDisplayComponent';
import CVViewer from './CVViewer';
import Scene from './scene/Scene';
import { PHOTOS, INTERACTION_TYPES, TARGET_POSITIONS } from './scene/constants';
import WelcomeOverlay from './overlays/WelcomeOverlay';
import PhotoNavigationUI from './overlays/PhotoNavigationUI';
import WebsiteDetailUI from './overlays/WebsiteDetailUI';
import useDynamicResolution from '../hooks/useDynamicResolution';

const OfficeScene = () => {
  const [interactionState, setInteractionState] = useState({
    type: INTERACTION_TYPES.NONE,
    index: 0
  });
  const [showCVViewer, setShowCVViewer] = useState(false);
  const [showThesisDisplay, setShowThesisDisplay] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { resolutionScale, displayFps } = useDynamicResolution();

  const handlePhotoClick = useCallback((event) => {
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.PHOTO, index: currentPhotoIndex });
  }, [currentPhotoIndex]);

  const handleDegreeClick = useCallback((event) => {
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.DEGREE, index: 0 });
  }, []);

  const handleCVClick = useCallback((event) => {
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.CV, index: 0 });
  }, []);

  const handleWebsiteClick = useCallback((event) => {
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.WEBSITE, index: 0 });
  }, []);

  const handleClose = () => {
    setInteractionState({ type: INTERACTION_TYPES.NONE, index: 0 });
  };

  const handleNext = () => {
    if (interactionState.type === INTERACTION_TYPES.PHOTO) {
      const nextIndex = (interactionState.index + 1) % PHOTOS.length;
      setCurrentPhotoIndex(nextIndex);
      setInteractionState({ ...interactionState, index: nextIndex });
    }
  };

  const handlePrev = () => {
    if (interactionState.type === INTERACTION_TYPES.PHOTO) {
      const prevIndex = (interactionState.index - 1 + PHOTOS.length) % PHOTOS.length;
      setCurrentPhotoIndex(prevIndex);
      setInteractionState({ ...interactionState, index: prevIndex });
    }
  };

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 4, 6], fov: 60 }}>
        <Scene
          resolutionScale={resolutionScale}
          interactionState={interactionState}
          targetPositions={TARGET_POSITIONS}
          currentPhotoIndex={currentPhotoIndex}
          handlePhotoClick={handlePhotoClick}
          handleDegreeClick={handleDegreeClick}
          handleCVClick={handleCVClick}
          handleWebsiteClick={handleWebsiteClick}
          setShowThesisDisplay={setShowThesisDisplay}
          setShowCVViewer={setShowCVViewer}
        />
      </Canvas>

      {/* Performance monitor */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        FPS: {displayFps} | Resolution: {Math.round(resolutionScale * 100)}%
      </div>

      <WelcomeOverlay isInteracting={interactionState.type !== INTERACTION_TYPES.NONE} />

      <PhotoNavigationUI
        currentPhotoIndex={currentPhotoIndex}
        totalPhotos={PHOTOS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={handleClose}
        isVisible={interactionState.type === INTERACTION_TYPES.PHOTO}
      />

      <ThesisDisplayComponent
        isVisible={showThesisDisplay}
        onClose={() => {
          setShowThesisDisplay(false);
          setInteractionState({ type: INTERACTION_TYPES.NONE, index: 0 });
        }}
      />

      <CVViewer
        isVisible={showCVViewer}
        onClose={() => {
          setShowCVViewer(false);
          setInteractionState({ type: INTERACTION_TYPES.NONE, index: 0 });
        }}
      />

      <WebsiteDetailUI
        onClose={handleClose}
        isVisible={interactionState.type === INTERACTION_TYPES.WEBSITE}
      />
    </>
  );
};

export default OfficeScene;
