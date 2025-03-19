import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing";

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

const GLBModel = ({ url, position, rotation = [0, 0, 0], scale, onClick }) => {
  const { scene } = useGLTF(url);
  
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.position.set(...position);
      clonedScene.scale.set(scale, scale, scale);
      clonedScene.rotation.set(...rotation);
      
      // Make the model interactive if onClick is provided
      if (onClick) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.userData.clickable = true;
          }
        });
      }
    }
  }, [clonedScene, position, rotation, scale, onClick]);

  // Add click event handler
  const handleClick = (event) => {
    if (onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  return <primitive object={clonedScene} onClick={handleClick} />;
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
const CVDocument = ({ onCVClick }) => {
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
    ctx.fillText('Developer & 3D Designer', 20, 110);
    
    // Draw some lines
    ctx.fillRect(20, 130, 472, 1);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Experience', 20, 160);
    
    ctx.font = '14px Arial';
    ctx.fillText('• Interactive Web Developer', 30, 190);
    ctx.fillText('• 3D Application Design', 30, 220);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  return (
    <group position={[-0.5, 1.1, 0.7]} rotation={[Math.PI / 2, 0, Math.PI / 12]}>
      <mesh onClick={onCVClick}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial 
          map={cvTexture}
          color="#f5f5f5"
        />
      </mesh>
    </group>
  );
};

// New Degree component
const DegreeFrame = ({ onDegreeClick }) => {
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
    ctx.fillText('CERTIFICATE', 256, 80);
    
    ctx.font = 'italic 18px serif';
    ctx.fillText('This certifies that', 256, 140);
    
    ctx.font = 'bold 28px serif';
    ctx.fillText('Hein Brouwer', 256, 200);
    
    ctx.font = 'italic 18px serif';
    ctx.fillText('has successfully completed the degree of', 256, 260);
    
    ctx.font = 'bold 22px serif';
    ctx.fillText('Master of Computer Science', 256, 320);
    
    ctx.font = '16px serif';
    ctx.fillText('with honors', 256, 360);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  return (
    <group position={[-2.5, 2.2, 0.01]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.1, 1.4, 0.05]} />
        <meshStandardMaterial color="#5e4b2b" />
      </mesh>
      
      {/* Degree certificate */}
      <mesh position={[0, 0, 0.03]} onClick={onDegreeClick}>
        <planeGeometry args={[1, 1.3]} />
        <meshStandardMaterial
          map={degreeTexture}
        />
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

const CameraController = ({ interactionState, targetPosition }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (isAnimatingRef.current) return;
  
    const isZoomed = interactionState.type !== INTERACTION_TYPES.NONE;
    const position = targetPosition[interactionState.type] || { x: 0, y: 3, z: 5 };
    
    const targetLookAt = isZoomed 
      ? new THREE.Vector3(position.lookAt.x, position.lookAt.y, position.lookAt.z) 
      : new THREE.Vector3(0, 0, 0);
  
    // Check if the camera is already at the desired position and look-at point
    const currentPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    if (
      currentPosition.equals(new THREE.Vector3(position.x, position.y, position.z)) &&
      targetRef.current.equals(targetLookAt)
    ) {
      return; // Skip re-animation
    }
  
    isAnimatingRef.current = true;
  
    // Animate camera position
    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
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
  }, [interactionState, targetPosition, camera.position]);

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} // Disable panning
      enableZoom={false} // Disable zooming
      enableRotate={interactionState.type === INTERACTION_TYPES.NONE}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minAzimuthAngle={-Math.PI/2 + 0.1}
      maxAzimuthAngle={Math.PI/2 - 0.1}
      target={[0, 0, 0]}
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

// New component for displaying degree details
const DegreeDetailUI = ({ onClose, isVisible }) => {
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
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '2rem',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '10px',
        padding: '2rem',
        maxWidth: '700px',
        width: '100%',
        position: 'relative',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Master of Computer Science
        </h2>
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Awarded to <strong>Hein Brouwer</strong>
          </p>
          <p style={{ fontSize: '1rem', color: '#555' }}>
            Graduated with honors, 2023
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Key Courses</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Advanced Computer Graphics</li>
            <li>Artificial Intelligence & Machine Learning</li>
            <li>Web Development with React</li>
            <li>3D Modeling and Animation</li>
            <li>Interactive Application Design</li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Thesis</h3>
          <p style={{ fontStyle: 'italic' }}>
            "Advanced Techniques for Interactive 3D Web Experiences"
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Explored methods of creating engaging, performance-optimized 3D environments for the web
            using Three.js and React Three Fiber.
          </p>
        </div>
      </div>
    </div>
  );
};

// New component for displaying CV details
const CVDetailUI = ({ onClose, isVisible }) => {
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
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '2rem',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '10px',
        padding: '2rem',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1Srem',
            right: '1rem',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Curriculum Vitae
        </h2>
        
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Hein Brouwer
        </h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p>Web Developer & 3D Designer</p>
          <p>hein.brouwer@example.com | (123) 456-7890</p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Professional Experience
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ fontWeight: 'bold' }}>Senior Web Developer</h5>
            <p style={{ fontStyle: 'italic' }}>Interactive Studios, 2020 - Present</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Developed interactive 3D web experiences using Three.js and React</li>
              <li>Created responsive websites with focus on performance and usability</li>
              <li>Led a team of 4 developers on client projects</li>
            </ul>
          </div>
          
          <div>
            <h5 style={{ fontWeight: 'bold' }}>3D Designer</h5>
            <p style={{ fontStyle: 'italic' }}>Digital Creations, 2018 - 2020</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Designed 3D models and environments for web and mobile applications</li>
              <li>Optimized 3D assets for web deployment</li>
              <li>Collaborated with developers to implement 3D experiences</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Education
          </h4>
          
          <div>
            <h5 style={{ fontWeight: 'bold' }}>Master of Computer Science</h5>
            <p style={{ fontStyle: 'italic' }}>University of Technology, 2023</p>
            <p>Graduated with honors</p>
          </div>
        </div>
        
        <div>
          <h4 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Skills
          </h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['JavaScript', 'React', 'Three.js', 'HTML/CSS', 'WebGL', 'Python', 'R', 'SQL', 'Unity', '3D Modeling', 'UI/UX Design'].map(skill => (
              <span key={skill} style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '0.3rem 0.6rem', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// New component for displaying website details
const WebsiteDetailUI = ({ onClose, isVisible }) => {
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
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '2rem',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        pointerEvents: 'auto'
      }}>
        <div style={{ backgroundColor: '#27445D', color: 'white', padding: '1rem', borderRadius: '10px 10px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Portfolio Website</h2>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>About Me</h3>
            <p>
              I'm Hein Brouwer, a web developer and 3D designer specializing in creating immersive digital experiences.
              With a background in computer science and a passion for interactive design, I build applications that
              combine functionality with engaging user experiences.
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Featured Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '120px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Project {i} Preview
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Project {i}</h4>
                    <p style={{ fontSize: '0.9rem' }}>
                      A description of this amazing interactive project with cutting-edge technology.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Contact</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1rem' 
            }}>
              <input 
                type="text" 
                placeholder="Name" 
                style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }} 
              />
              <input 
                type="email" 
                placeholder="Email" 
                style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            <textarea 
              placeholder="Message" 
              rows="4" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                marginBottom: '1rem'
              }} 
            />
            <button style={{ 
              backgroundColor: '#27445D', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Effects = () => {
  const { size } = useThree();

  return (
    <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>  
      <Outline
        visibleEdgeColor="white"
        hiddenEdgeColor="white"
        blur
        width={size.width * 1.25}
        edgeStrength={10}
      />
      <TiltShift2 samples={5} blur={0.1} />
      <ToneMapping />
    </EffectComposer>
  );
};

const OfficeScene = () => {
  // State for different interactions
  const [interactionState, setInteractionState] = useState({
    type: INTERACTION_TYPES.NONE,
    index: 0
  });
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Camera positions for different interaction targets
  const targetPositions = {
    [INTERACTION_TYPES.NONE]: { x: 0, y: 4, z: 6, lookAt: { x: 0, y: 0, z: 0 } },
    [INTERACTION_TYPES.PHOTO]: { x: 1.8, y: 3.2, z: 2.0, lookAt: { x: 1.8, y: 2.2, z: 0 } },
    [INTERACTION_TYPES.DEGREE]: { x: -2.5, y: 3.2, z: 2.0, lookAt: { x: -2.5, y: 2.2, z: 0 } },
    [INTERACTION_TYPES.CV]: { x: -0.5, y: 2.0, z: 1.7, lookAt: { x: -0.5, y: 1.1, z: 0.7 } },
    [INTERACTION_TYPES.WEBSITE]: { x: 0, y: 2.0, z: 1.5, lookAt: { x: 0, y: 1.1, z: 0.5 } }
  };
  
  // Handlers for different interactions
  const handlePhotoClick = () => {
    setInteractionState({ type: INTERACTION_TYPES.PHOTO, index: currentPhotoIndex });
  };
  
  const handleDegreeClick = () => {
    setInteractionState({ type: INTERACTION_TYPES.DEGREE, index: 0 });
  };
  
  const handleCVClick = () => {
    setInteractionState({ type: INTERACTION_TYPES.CV, index: 0 });
  };
  
  const handleWebsiteClick = useCallback((event) => {
    // Stop event propagation to prevent other objects from receiving the click
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
      <Canvas style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 4, 6]} />
        <CameraController 
          interactionState={interactionState}
          targetPosition={targetPositions}
        />
        <ambientLight intensity={0.8} />
        <Rug />
        <Walls />
        <DegreeFrame onDegreeClick={handleDegreeClick} />
        <CVDocument onCVClick={handleCVClick} />
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
          <GLBModel 
            url="/models/Laptop.glb"
            position={[0, 1.1, 0.8]}
            rotation={[0, -Math.PI/2, 0]} 
            scale={0.11}
            onClick={handleWebsiteClick} // This won't work directly with GLBModel
          />                              
        </Suspense>
        <Effects />
      </Canvas>

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
      
      <DegreeDetailUI
        onClose={handleClose}
        isVisible={interactionState.type === INTERACTION_TYPES.DEGREE}
      />
      
      <CVDetailUI
        onClose={handleClose}
        isVisible={interactionState.type === INTERACTION_TYPES.CV}
      />
      
      <WebsiteDetailUI
        onClose={handleClose}
        isVisible={interactionState.type === INTERACTION_TYPES.WEBSITE}
      />
    </>
  );
};

export default OfficeScene;