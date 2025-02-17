import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"


const PHOTOS = [
  '/photos/1690_24.jpg',
  '/photos/1691_16.jpg'
];

const GLBModel = ({ url, position, scale }) => {
  const { scene } = useGLTF(url);
  
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.position.set(...position);
      clonedScene.scale.set(scale, scale, scale);
    }
  }, [clonedScene, position, scale]);

  return <primitive object={clonedScene} />;
};

useGLTF.preload('/models/Table.glb');

const Walls = () => {
  const wallTexture = useLoader(TextureLoader, '/Textures/wall_basecolor.jpg');
  const floorTexture = useLoader(TextureLoader, '/Textures/floor_basecolor.jpg');

  return (
    <group>
      {/* Main Wall */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[8, 4, 2]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
    </group>
  );
};

const Laptop = () => {
  return (
    <group position={[0, 1.1, 0.5]}>
      <mesh>
        <boxGeometry args={[1, 0.05, 0.8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0, 0.3, -0.3]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
    </group>
  );
};

const InteractivePhotoFrame = React.memo(({ onPhotoClick, currentPhotoIndex }) => {
  const texture = useLoader(TextureLoader, PHOTOS[currentPhotoIndex]);

  return (
    <Suspense fallback={null}>
      <mesh position={[1.8, 2.2, 0]} onClick={onPhotoClick}>
        <boxGeometry args={[1.5, 1.2, 0.05]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </Suspense>
  );
});

const CameraController = ({ isZoomed, framePosition }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (isAnimatingRef.current) return;
  
    const targetPosition = isZoomed
      ? { x: framePosition[0], y: framePosition[1] + 1, z: framePosition[2] + 2 }
      : { x: 0, y: 3, z: 5 };
  
    const targetLookAt = isZoomed ? new THREE.Vector3(...framePosition) : new THREE.Vector3(0, 0, 0);
  
    // Check if the camera is already at the desired position and look-at point
    const currentPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    if (
      currentPosition.equals(new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)) &&
      targetRef.current.equals(targetLookAt)
    ) {
      return; // Skip re-animation
    }
  
    isAnimatingRef.current = true;
  
    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
      }
    });
  
    // Animate camera look-at target
    gsap.to(targetRef.current, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        controlsRef.current.target.copy(targetRef.current);
        controlsRef.current.update();
      }
    });
  }, [isZoomed, framePosition, camera.position]);

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} // Disable panning
      enableZoom={false} // Disable zooming
      enableRotate={!isZoomed}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minAzimuthAngle={-Math.PI/2 + 0.1}
      maxAzimuthAngle={Math.PI/2 - 0.1}
      target={[0, 0, 0]}
    />
  );
};

const WelcomeOverlay = ({ isZoomed }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isZoomed) {
      setIsVisible(false);
    }
  }, [isZoomed]);

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
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem' 
        }}>
          Welcome to My Work in Progress Website
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          marginBottom: '1.5rem'
        }}>
          Try clicking on the photo on the wall to explore!
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

const PhotoNavigationUI = React.memo(({ 
  currentPhotoIndex, 
  totalPhotos, 
  onNext, 
  onPrev, 
  onClose, 
  isZoomed 
}) => {
  if (!isZoomed) return null;

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
      <button 
        onClick={onPrev}
        style={{
          pointerEvents: 'auto',
          padding: '1rem',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        ←
      </button>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        maxHeight: '80%'
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
        <p style={{
          color: 'white',
          marginTop: '1rem',
          fontSize: '1rem'
        }}>
          {currentPhotoIndex + 1} / {totalPhotos}
        </p>
      </div>
      
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          pointerEvents: 'auto',
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>

      <button
        onClick={onNext}
        style={{
          pointerEvents: 'auto',
          padding: '1rem',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        →
      </button>
    </div>
  );
});

const Effects = () => {
  const { size } = useThree();  // Get the size of the viewport (used for the Outline effect)

  return (
    <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>  
      {/* Outline Effect */}
      <Outline
        visibleEdgeColor="white"
        hiddenEdgeColor="white"
        blur
        width={size.width * 1.25}
        edgeStrength={10}
      />
      
      {/* Tilt Shift Effect */}
      <TiltShift2 samples={5} blur={0.1} />
      
      {/* Tone Mapping */}
      <ToneMapping />
    </EffectComposer>
  );
};

const OfficeScene = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const framePosition = [1.8, 2.2, 0];
  
  const handlePhotoClick = () => setIsZoomed(true);
  
  const handleNext = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
  };
  
  const handlePrev = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };
  
  const handleClose = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 4, 6]} />
        <CameraController 
          isZoomed={isZoomed} 
          framePosition={framePosition} 
        />
        <ambientLight intensity={0.8} />
        <spotLight 
          position={[1.8, 3.5, 2]}
          penumbra={0.8}
          angle={0.1}
          intensity={3}
        />

        <Walls />
        <Laptop />
        <InteractivePhotoFrame 
          onPhotoClick={handlePhotoClick}
          currentPhotoIndex={currentPhotoIndex}
          isZoomed={isZoomed}
        />
        <Suspense fallback={null}>
          <GLBModel 
            url="/models/Table.glb"
            position={[0, -0.4, 0.8]}
            scale={2}
          />
        </Suspense>
        <Effects />
      </Canvas>

      <WelcomeOverlay isZoomed={isZoomed} />

      <PhotoNavigationUI
        currentPhotoIndex={currentPhotoIndex}
        totalPhotos={PHOTOS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={handleClose}
        isZoomed={isZoomed}
      />
    </>
  );
};

export default OfficeScene;