import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer, Outline, TiltShift2, ToneMapping } from "@react-three/postprocessing";
import ThesisDisplayComponent from './ThesisDisplayComponent';
import CVViewer from './CVViewer';
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon } from 'lucide-react';

const ResolutionScaler = ({ scale = 0.75 }) => {
  const { gl, size, camera } = useThree();
  const prevSizeRef = useRef({ width: size.width, height: size.height });
  const prevScaleRef = useRef(scale);
  
  useEffect(() => {
    // Only update if scale or size has changed significantly
    const sizeChanged = 
      Math.abs(prevSizeRef.current.width - size.width) > 1 || 
      Math.abs(prevSizeRef.current.height - size.height) > 1;
    
    const scaleChanged = Math.abs(prevScaleRef.current - scale) >= 0.01;
    
    if (!sizeChanged && !scaleChanged) return;
    
    // Store current position and target
    const cameraPosition = camera.position.clone();
    
    // Set renderer's pixel ratio based on the device's pixel ratio and our scale
    const pixelRatio = Math.min(window.devicePixelRatio, 2) * scale;
    gl.setPixelRatio(pixelRatio);
    
    // Adjust the size of the renderer
    const scaledWidth = Math.floor(size.width * scale);
    const scaledHeight = Math.floor(size.height * scale);
    gl.setSize(scaledWidth, scaledHeight, false);
    
    // Update aspect ratio but preserve position
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    
    // Restore camera position
    camera.position.copy(cameraPosition);
    
    // Make sure the canvas still fills the container
    gl.domElement.style.width = '100%';
    gl.domElement.style.height = '100%';
    
    // Update refs
    prevSizeRef.current = { width: size.width, height: size.height };
    prevScaleRef.current = scale;
    
    return () => {
      // No need to reset on cleanup as we'll update again if needed
    };
  }, [gl, size, scale, camera]);
  
  return null;
};

const PHOTOS = [
  '/photos/1690_24.jpg',
  '/photos/1691_16.jpg'
];

// Define interaction types for camera controls
const INTERACTION_TYPES = {
  NONE: 'none',
  PHOTO: 'photo',
  DEGREE: 'degree',
  CV: 'cv',
  WEBSITE: 'website'
};

const HoverEffect = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  const childRef = useRef();
  
  // Get child position
  const [childPosition, setChildPosition] = useState([0, 0, 0]);
  const [childGeometry, setChildGeometry] = useState(null);
  const [childRotation, setChildRotation] = useState([0, 0, 0]);
  
  // Process child to get position and geometry info
  useEffect(() => {
    if (childRef.current) {
      // Store position
      setChildPosition([
        childRef.current.position.x,
        childRef.current.position.y,
        childRef.current.position.z
      ]);
      
      // Store rotation
      if (childRef.current.rotation) {
        setChildRotation([
          childRef.current.rotation.x,
          childRef.current.rotation.y,
          childRef.current.rotation.z
        ]);
      }
      
      // Try to get geometry
      if (childRef.current.geometry) {
        setChildGeometry(childRef.current.geometry.clone());
      }
    }
  }, [childRef.current]);
  
  // Wrap the children with pointer event handlers and ref
  const childrenWithEvents = React.Children.map(children, (child, index) => {
    // Only apply ref to the first child
    if (index === 0) {
      return React.cloneElement(child, {
        ref: childRef,
        onPointerOver: (e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
          // Call the original onPointerOver if it exists
          if (child.props.onPointerOver) child.props.onPointerOver(e);
        },
        onPointerOut: (e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
          // Call the original onPointerOut if it exists
          if (child.props.onPointerOut) child.props.onPointerOut(e);
        }
      });
    }
    return child;
  });
  
  return (
    <group>
      {childrenWithEvents}
      {hovered && (
        <mesh 
          position={childPosition} 
          rotation={childRotation}
          renderOrder={1000}
        >
          {childRef.current && childRef.current.geometry ? (
            // If we can get the actual geometry, use it
            <bufferGeometry attach="geometry" {...childRef.current.geometry} />
          ) : (
            // Otherwise use a plane or box geometry as fallback
            <boxGeometry args={[1, 1, 0.1]} />
          )}
          <meshBasicMaterial 
            color="white" 
            transparent 
            opacity={0.02} 
            depthTest={false} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// IMPROVED CLICKABLE MESH COMPONENT
// This is a simplified approach that works more reliably
const ClickableMesh = ({ 
  geometry, 
  material, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  onClick,
  children,
  ...props 
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        {...props}
      >
        {geometry}
        {material}
        {children}
      </mesh>
      
      {hovered && (
        <mesh
          position={position}
          rotation={rotation}
          renderOrder={1000}
        >
          {geometry}
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.2}
            depthTest={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// IMPROVED GLB MODEL WITH CORRECT HOVER POSITION
const ClickableGLBModel = ({ url, position, rotation = [0, 0, 0], scale, onClick }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const modelRef = useRef();
  
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.position.set(...position);
      clonedScene.scale.set(scale, scale, scale);
      clonedScene.rotation.set(...rotation);
      
      if (onClick) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.userData.clickable = true;
          }
        });
      }
    }
    
    // Update cursor based on hover state
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [clonedScene, position, rotation, scale, onClick, hovered]);

  const handleClick = (event) => {
    if (onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  // For GLB models, create a simple hover box at the right position
  if (onClick) {
    return (
      <group ref={modelRef}>
        <primitive 
          object={clonedScene} 
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
        {hovered && (
          <mesh 
            position={position} 
            rotation={rotation}
            scale={[scale * 1.1, scale * 1.1, scale * 1.1]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="white" transparent opacity={0.15} wireframe />
          </mesh>
        )}
      </group>
    );
  }
  
  return <primitive object={clonedScene} />;
};


const GLBModel = ({ url, position, rotation = [0, 0, 0], scale, onClick }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.position.set(...position);
      clonedScene.scale.set(scale, scale, scale);
      clonedScene.rotation.set(...rotation);
      
      // Make all meshes in the model interactive
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.userData.clickable = true;
          // Add the hover and click handlers to each mesh
          child.onclick = handleClick;
          child.onpointerover = () => setHovered(true);
          child.onpointerout = () => setHovered(false);
        }
      });
    }
    
    // Apply cursor change on hover if clickable
    if (hovered && onClick) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [clonedScene, position, rotation, scale, onClick, hovered]);

  // Add click event handler with debugging
  const handleClick = useCallback((event) => {
    if (onClick) {
      event.stopPropagation();
      console.log('Model clicked:', url);
      onClick(event);
    }
  }, [onClick, url]);

  return (
    <primitive 
      object={clonedScene} 
      onClick={handleClick}
      onPointerOver={() => onClick && setHovered(true)}
      onPointerOut={() => onClick && setHovered(false)}
    />
  );
};

useGLTF.preload('/models/Table.glb');
useGLTF.preload('/models/Lamp.glb');
useGLTF.preload('/models/Stool.glb');
useGLTF.preload('/models/Plant.glb');
useGLTF.preload('/models/Laptop.glb');

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

const Rug = () => {
  const rugTexture = useLoader(TextureLoader, '/Textures/rug.png');
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, Math.PI/2]} 
      position={[0, 0.01, 1.3]} 
      receiveShadow
    >
      <planeGeometry args={[4.5, 3.5]} />
      <meshStandardMaterial 
        map={rugTexture} 
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// New CV component
const CVDocument = ({ onCVClick, setShowCVViewer }) => {
  // Create a canvas for the CV texture
  const cvTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw CV content
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Curriculum Vitae', 20, 40);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Hein Brouwer', 20, 80);
    
    ctx.font = '14px Arial';
    ctx.fillText('Data Scientist & AR Developer', 20, 110);
    
    // Draw some lines
    ctx.fillRect(20, 130, 472, 1);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Experience', 20, 160);
    
    ctx.font = '14px Arial';
    ctx.fillText('• Student Assistant, Utrecht University', 30, 190);
    ctx.fillText('• App Developer, boasmedia', 30, 220);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  const handleClick = (event) => {
    event.stopPropagation();
    onCVClick(event);
    setTimeout(() => setShowCVViewer(true), 1000);
  };
  
  return (
    <group position={[-0.6, 1.11, 0.7]} rotation={[Math.PI/2, Math.PI, Math.PI/0.95]}>
      <ClickableMesh
        onClick={handleClick}
        geometry={<planeGeometry args={[0.4, 0.6]} />}
        material={<meshStandardMaterial map={cvTexture} color="#f5f5f5" />}
      />
    </group>
  );
};

// New Degree component
const DegreeFrame = ({ onDegreeClick, setShowThesisDisplay }) => {
  // Create a canvas for the degree texture
  const degreeTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill background with parchment color
    ctx.fillStyle = '#f5f3e0';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add border
    ctx.strokeStyle = '#8b7d39';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 472, 472);
    
    // Add content
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('THESIS', 256, 80);
    
    ctx.font = 'italic 18px serif';
    ctx.fillText('Elevating User Trust', 256, 140);
    
    ctx.font = 'bold 22px serif';
    ctx.fillText('Hein Brouwer', 256, 200);
    
    ctx.font = 'italic 18px serif';
    ctx.fillText('Utrecht University', 256, 260);
    
    ctx.font = 'bold 22px serif';
    ctx.fillText('Grade: 8.0', 256, 320);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  const handleClick = (event) => {
    event.stopPropagation();
    onDegreeClick(event);
    setTimeout(() => setShowThesisDisplay(true), 1000);
  };
  
  return (
    <group position={[-2.0, 2.5, 0.01]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.1, 1.4, 0.05]} />
        <meshStandardMaterial color="#5e4b2b" />
      </mesh>
      
      {/* Degree certificate with hover effect */}
      <ClickableMesh
        position={[0, 0, 0.03]}
        onClick={handleClick}
        geometry={<planeGeometry args={[1, 1.3]} />}
        material={<meshStandardMaterial map={degreeTexture} />}
      />
    </group>
  );
};

const InteractivePhotoFrame = React.memo(({ onPhotoClick, currentPhotoIndex }) => {
  const textureArray = useLoader(TextureLoader, PHOTOS);
  const currentTexture = textureArray[currentPhotoIndex];
  
  return (
    <Suspense fallback={null}>
      <ClickableMesh
        position={[1.75, 2.5, 0]}
        onClick={onPhotoClick}
        geometry={<boxGeometry args={[1.5, 1.2, 0.05]} />}
        material={<meshStandardMaterial map={currentTexture} />}
      />
    </Suspense>
  );
});

const CameraController = ({ interactionState, targetPosition }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimatingRef = useRef(false);
  const prevInteractionTypeRef = useRef(INTERACTION_TYPES.NONE);
  const userInteractTimeoutRef = useRef(null);

  // Debug function to track camera state
  const logCameraState = useCallback((message) => {
    console.log(
      `${message} - Type: ${interactionState.type}, Position: (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})`
    );
  }, [interactionState.type, camera.position]);

  useEffect(() => {
    // Forcibly end any ongoing animation when the interaction type changes
    if (prevInteractionTypeRef.current !== interactionState.type) {
      logCameraState("Interaction type changed");
      
      // Clear any existing animation
      if (isAnimatingRef.current) {
        gsap.killTweensOf(camera.position);
        gsap.killTweensOf(targetRef.current);
        isAnimatingRef.current = false;
      }
      
      const isZoomed = interactionState.type !== INTERACTION_TYPES.NONE;
      const position = targetPosition[interactionState.type] || { x: 0, y: 3, z: 5 };
      
      const targetLookAt = isZoomed 
        ? new THREE.Vector3(position.lookAt.x, position.lookAt.y, position.lookAt.z) 
        : new THREE.Vector3(0, 0, 0);
      
      // Update the previous interaction type
      prevInteractionTypeRef.current = interactionState.type;
      
      // Force reset userRotate to ensure animation will play
      if (controlsRef.current) {
        controlsRef.current.userRotate = false;
      }
      
      logCameraState("Starting animation");
      isAnimatingRef.current = true;
      
      // Use a single GSAP timeline for better synchronization
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          logCameraState("Animation complete");
        }
      });
      
      // Add camera position animation to timeline
      tl.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0);
      
      // Add target animation to timeline
      tl.to(targetRef.current, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.copy(targetRef.current);
            controlsRef.current.update();
          }
        }
      }, 0);
    }
  }, [interactionState, targetPosition, camera, logCameraState]);

  // Track when user is interacting with controls
  const onStart = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.userRotate = true;
      logCameraState("User started rotating");
    }
  }, [logCameraState]);

  const onEnd = useCallback(() => {
    // Clear any existing timeout
    if (userInteractTimeoutRef.current) {
      clearTimeout(userInteractTimeoutRef.current);
    }
    
    // Add a short delay before allowing automatic camera movements again
    userInteractTimeoutRef.current = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.userRotate = false;
        logCameraState("User rotation ended");
      }
      userInteractTimeoutRef.current = null;
    }, 300);
  }, [logCameraState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userInteractTimeoutRef.current) {
        clearTimeout(userInteractTimeoutRef.current);
      }
    };
  }, []);

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false}
      enableZoom={true} // Enable zoom for better exploration
      minDistance={2} // Set minimum zoom distance 
      maxDistance={10} // Set maximum zoom distance
      enableRotate={interactionState.type === INTERACTION_TYPES.NONE}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minAzimuthAngle={-Math.PI/2 + 0.1}
      maxAzimuthAngle={Math.PI/2 - 0.1}
      target={[0, 0, 0]}
      onStart={onStart}
      onEnd={onEnd}
      // Increase damping to make movements smoother
      dampingFactor={0.1}
      enableDamping={true}
    />
  );
};

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
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem' 
        }}>
          Welcome to My Interactive Portfolio
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          marginBottom: '1.5rem'
        }}>
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

const PhotoNavigationUI = React.memo(({ 
  currentPhotoIndex, 
  totalPhotos, 
  onNext, 
  onPrev, 
  onClose, 
  isVisible
}) => {
  if (!isVisible) return null;

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
          cursor: 'pointer',
          zIndex: 55
        }}
      >
        ←
      </button>
      
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

      <button
        onClick={onNext}
        style={{
          pointerEvents: 'auto',
          padding: '1rem',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 55
        }}
      >
        →
      </button>
    </div>
  );
});

const WebsiteDetailUI = ({ onClose, isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  if (!isVisible) return null;

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission (can be replaced with an actual API call)
    setFormStatus('Thank you for reaching out! We will get back to you shortly.');

    // Clear the form
    setFormData({
      name: '',
      email: '',
      message: '',
    });

    setTimeout(() => setFormStatus(''), 5000); // Clear message after 5 seconds
  };

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
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '2rem',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        pointerEvents: 'auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{
          backgroundColor: '#27445D',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Contact Hein Brouwer</h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B6B'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B6B'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              rows="4"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B6B'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <button type="submit" style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              Send Message
            </button>
          </form>

          <h3 style={{ marginBottom: '1rem' }}>Connect with Me</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <a href="http://www.heinbrouwer.com" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
              <GlobeIcon size={24} />
              <span>Portfolio</span>
            </a>
            <a href="mailto:hein.brouwer@planet.nl" style={styles.contactLink}>
              <MailIcon size={24} />
              <span>Email</span>
            </a>
            <a href="https://github.com/oioi123" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
              <GithubIcon size={24} />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/hein-brouwer-a76793326/" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
              <LinkedinIcon size={24} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the styles object to style the contact links and icons.
const styles = {
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#27445D',
    fontSize: '1.1rem',
    fontWeight: '500',
    padding: '0.5rem 0',
    transition: 'color 0.3s, transform 0.3s',
  },
  contactLinkHover: {
    transform: 'scale(1.05)',
  },
};

const Effects = () => {
  return (
    <EffectComposer stencilBuffer={false} disableNormalPass autoClear={false} multisampling={2}>  
      {/* Reduced to just ToneMapping for better performance */}
      <ToneMapping />
    </EffectComposer>
  );
};


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
  const [hoveredObject, setHoveredObject] = useState(null);
  return (
    <>
      <ResolutionScaler scale={resolutionScale} />
      <PerspectiveCamera makeDefault position={[0, 4, 6]} />
      <CameraController 
        interactionState={interactionState}
        targetPosition={targetPositions}
      />
      <ambientLight intensity={0.8} />
      <Rug />
      <Walls />
      <DegreeFrame 
        onDegreeClick={handleDegreeClick} 
        setShowThesisDisplay={setShowThesisDisplay}
      />
      <CVDocument 
        onCVClick={handleCVClick} 
        setShowCVViewer={setShowCVViewer}
      />
      <InteractivePhotoFrame 
        onPhotoClick={handlePhotoClick}
        currentPhotoIndex={currentPhotoIndex}
      />
      <Suspense fallback={null}>
        <GLBModel 
          url="/models/Table.glb"
          position={[0, -0.4, 0.8]}
          scale={2}
        />
        <GLBModel 
          url="/models/Lamp.glb"
          position={[3, 0, 0.8]}
          rotation={[0,Math.PI,0]}
          scale={2}
        />
        <GLBModel 
          url="/models/Stool.glb"
          position={[-2, 0, 0.8]}
          scale={2}
        />
        <GLBModel 
          url="/models/Plant.glb"
          position={[-2, 0.85, 0.8]}
          scale={0.02}
        />
        <ClickableGLBModel 
          url="/models/Laptop.glb"
          position={[0, 1.1, 0.8]}
          rotation={[0, -Math.PI/2, 0]} 
          scale={0.11}
          onClick={handleWebsiteClick}
        />                        
      </Suspense>
      <Effects />
    </>
  );
};

const OfficeScene = () => {
  // State for different interactions
  const [interactionState, setInteractionState] = useState({
    type: INTERACTION_TYPES.NONE,
    index: 0
  });
  const [showCVViewer, setShowCVViewer] = useState(false);
  const [showThesisDisplay, setShowThesisDisplay] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  // Add state for resolution scaling
  const [resolutionScale, setResolutionScale] = useState(0.75); // Default to 75%
  
  // Performance monitoring with useRef to avoid re-renders
  const fpsRef = useRef(60);
  const [displayFps, setDisplayFps] = useState(60); // Only for display purposes
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const currentScaleRef = useRef(0.75);
  const fpsUpdateTimerRef = useRef(null);
  
  // Dynamic resolution adjustment based on performance
  useEffect(() => {
    let animationFrameId;
    let lastFpsUpdate = 0;
    
    const updateFps = (time) => {
      frameCountRef.current++;
      
      // Update FPS every second
      if (time - lastFpsUpdate >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / (time - lastFpsUpdate));
        fpsRef.current = currentFps;
        
        // Update display FPS less frequently to avoid re-renders
        if (!fpsUpdateTimerRef.current) {
          fpsUpdateTimerRef.current = setTimeout(() => {
            setDisplayFps(fpsRef.current);
            fpsUpdateTimerRef.current = null;
          }, 1000);
        }
        
        // Adjust resolution scale based on performance
        let newScale = currentScaleRef.current;
        if (currentFps < 30 && newScale > 0.5) {
          newScale = Math.max(0.5, newScale - 0.05);
        } else if (currentFps > 55 && newScale < 1) {
          newScale = Math.min(1.0, newScale + 0.10);
        }
        
        // Only update state if the scale has changed significantly
        if (Math.abs(newScale - currentScaleRef.current) >= 0.05) {
          currentScaleRef.current = newScale;
          setResolutionScale(newScale);
        }
        
        frameCountRef.current = 0;
        lastFpsUpdate = time;
      }
      
      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(updateFps);
    };
    
    animationFrameId = requestAnimationFrame(updateFps);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (fpsUpdateTimerRef.current) {
        clearTimeout(fpsUpdateTimerRef.current);
      }
    };
  }, []);
  
  // Camera positions for different interaction targets
  const targetPositions = {
    [INTERACTION_TYPES.NONE]: { x: 0, y: 4, z: 6, lookAt: { x: 0, y: 0, z: 0 } },
    [INTERACTION_TYPES.PHOTO]: { x: 1.8, y: 3.2, z: 2.0, lookAt: { x: 1.8, y: 2.2, z: 0 } },
    [INTERACTION_TYPES.DEGREE]: { x: -2.0, y: 3.2, z: 2.0, lookAt: { x: -2.0, y: 2.5, z: 0 } },
    [INTERACTION_TYPES.CV]: { x: -0.5, y: 2.0, z: 1.7, lookAt: { x: -0.5, y: 1.1, z: 0.7 } },
    [INTERACTION_TYPES.WEBSITE]: { x: 0, y: 2.0, z: 1.5, lookAt: { x: 0, y: 1.1, z: 0.5 } }
  };
  
  // Handlers for different interactions
  const handlePhotoClick = useCallback((event) => {
    console.log("Photo clicked");
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.PHOTO, index: currentPhotoIndex });
  }, [currentPhotoIndex]);
  
  const handleDegreeClick = useCallback((event) => {
    console.log("Degree clicked");
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.DEGREE, index: 0 });
  }, []);
  
  const handleCVClick = useCallback((event) => {
    console.log("CV clicked");
    event.stopPropagation();
    setInteractionState({ type: INTERACTION_TYPES.CV, index: 0 });
  }, []);
  
  const handleWebsiteClick = useCallback((event) => {
    console.log("Laptop clicked");
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
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 4, 6], fov: 60 }}
      >
        <Scene 
          resolutionScale={resolutionScale}
          interactionState={interactionState}
          targetPositions={targetPositions}
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

      {/* Different UIs for each interaction type */}
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

