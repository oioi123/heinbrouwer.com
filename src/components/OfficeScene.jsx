import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';

const PHOTOS = [
  '/photos/1690_24.jpg',
  '/photos/1691_16.jpg'
];

// Create a texture loader with a loading manager
const textureLoader = new TextureLoader();
const textures = new Map();

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

// Pre-load the model
useGLTF.preload('/models/Table.glb');

const Walls = () => {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[8, 4, 2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  );
};

const Laptop = () => {
  return (
    <group position={[0, 1.1, 0.5]}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[1, 0.05, 0.8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.3, -0.3]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
    </group>
  );
};

// Preload all textures
PHOTOS.forEach(photo => {
  TextureLoader.prototype.loadAsync(photo);
});

const InteractivePhotoFrame = ({ onPhotoClick, currentPhotoIndex, isZoomed }) => {
  const [currentTexture, setCurrentTexture] = useState(null);
  const previousTexture = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadTexture = async () => {
      try {
        const newTexture = await new TextureLoader().loadAsync(PHOTOS[currentPhotoIndex]);
        if (isMounted) {
          previousTexture.current = currentTexture;
          setCurrentTexture(newTexture);
        }
      } catch (error) {
        console.error('Error loading texture:', error);
      }
    };

    loadTexture();
    
    return () => {
      isMounted = false;
      if (previousTexture.current) {
        previousTexture.current.dispose();
      }
    };
  }, [currentPhotoIndex]);

  return (
    <mesh 
      position={[1.8, 2.2, 0]} 
      onClick={onPhotoClick}
    >
      <boxGeometry args={[1.5, 1.2, 0.05]} />
      <meshStandardMaterial map={currentTexture || previousTexture.current} />
    </mesh>
  );
};

const CameraController = ({ isZoomed, framePosition }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (isZoomed) {
      // Zoom to the photo frame
      const target = new THREE.Vector3(...framePosition);
      
      // Animate camera position
      gsap.to(camera.position, {
        x: target.x,
        y: target.y + 1,
        z: target.z + 2,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // Animate camera look at
      gsap.to(controlsRef.current.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          controlsRef.current.update();
        }
      });
    } else {
      // Reset camera to original position
      gsap.to(camera.position, {
        x: 0,
        y: 3,
        z: 5,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          controlsRef.current.update();
        }
      });
    }
  }, [isZoomed]);

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={!isZoomed} 
      enableZoom={!isZoomed} 
      enableRotate={!isZoomed}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2} 
      minAzimuthAngle={-Math.PI/2} 
      maxAzimuthAngle={Math.PI/2}
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

const PhotoNavigationUI = ({ 
  currentPhotoIndex, 
  totalPhotos, 
  onNext, 
  onPrev, 
  onClose, 
  isZoomed,
  photos
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
      padding: '0 2rem'
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
          src={photos[currentPhotoIndex]} 
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
};

const OfficeScene = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const framePosition = [1.8, 2.2, 0];
  const handlePhotoClick = () => setIsZoomed(true);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 3, 5]} />
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
      </Canvas>

      <WelcomeOverlay isZoomed={isZoomed} />

      <PhotoNavigationUI
        currentPhotoIndex={currentPhotoIndex}
        totalPhotos={PHOTOS.length}
        onNext={() => setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length)}
        onPrev={() => setCurrentPhotoIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length)}
        onClose={() => setIsZoomed(false)}
        isZoomed={isZoomed}
        photos={PHOTOS}
      />
    </>
  );
};

export default OfficeScene;