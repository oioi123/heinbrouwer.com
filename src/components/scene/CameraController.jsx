import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { INTERACTION_TYPES } from './constants';

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
      enableZoom={true}
      minDistance={2}
      maxDistance={10}
      enableRotate={interactionState.type === INTERACTION_TYPES.NONE}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minAzimuthAngle={-Math.PI / 2 + 0.1}
      maxAzimuthAngle={Math.PI / 2 - 0.1}
      target={[0, 0, 0]}
      onStart={onStart}
      onEnd={onEnd}
      dampingFactor={0.1}
      enableDamping={true}
    />
  );
};

export default CameraController;
