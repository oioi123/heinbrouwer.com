import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import ResolutionScaler from './ResolutionScaler';
import CameraController from './CameraController';
import Effects from './Effects';
import { Walls, Rug } from './Environment';
import { GLBModel, ClickableGLBModel } from './Models';
import { CVDocument, DegreeFrame, InteractivePhotoFrame } from './InteractiveObjects';

const Scene = ({
  resolutionScale,
  interactionState,
  targetPositions,
  currentPhotoIndex,
  handlePhotoClick,
  handleDegreeClick,
  handleCVClick,
  handleWebsiteClick,
  setShowThesisDisplay,
  setShowCVViewer
}) => {
  return (
    <>
      <ResolutionScaler scale={resolutionScale} />
      <PerspectiveCamera makeDefault position={[0, 4, 6]} />
      <CameraController interactionState={interactionState} targetPosition={targetPositions} />
      <ambientLight intensity={0.8} />
      <Rug />
      <Walls />
      <DegreeFrame onDegreeClick={handleDegreeClick} setShowThesisDisplay={setShowThesisDisplay} />
      <CVDocument onCVClick={handleCVClick} setShowCVViewer={setShowCVViewer} />
      <InteractivePhotoFrame onPhotoClick={handlePhotoClick} currentPhotoIndex={currentPhotoIndex} />
      <Suspense fallback={null}>
        <GLBModel url="/models/Table.glb" position={[0, -0.4, 0.8]} scale={2} />
        <GLBModel url="/models/Lamp.glb" position={[3, 0, 0.8]} rotation={[0, Math.PI, 0]} scale={2} />
        <GLBModel url="/models/Stool.glb" position={[-2, 0, 0.8]} scale={2} />
        <GLBModel url="/models/Plant.glb" position={[-2, 0.85, 0.8]} scale={0.02} />
        <ClickableGLBModel
          url="/models/Laptop.glb"
          position={[0, 1.1, 0.8]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={0.11}
          onClick={handleWebsiteClick}
        />
      </Suspense>
      <Effects />
    </>
  );
};

export default Scene;
