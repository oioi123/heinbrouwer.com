import React, { useState, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// A mesh with a hover highlight and optional click handler.
export const ClickableMesh = ({
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
        <mesh position={position} rotation={rotation} renderOrder={1000}>
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

// A GLB model with a wireframe hover box and click handler.
export const ClickableGLBModel = ({ url, position, rotation = [0, 0, 0], scale, onClick }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const modelRef = useRef();

  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

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

// A static GLB model, optionally clickable.
export const GLBModel = ({ url, position, rotation = [0, 0, 0], scale, onClick }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);

  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.position.set(...position);
      clonedScene.scale.set(scale, scale, scale);
      clonedScene.rotation.set(...rotation);

      // Make all meshes in the model interactive
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.userData.clickable = true;
          child.onclick = handleClick;
          child.onpointerover = () => setHovered(true);
          child.onpointerout = () => setHovered(false);
        }
      });
    }

    if (hovered && onClick) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [clonedScene, position, rotation, scale, onClick, hovered]);

  const handleClick = useCallback((event) => {
    if (onClick) {
      event.stopPropagation();
      onClick(event);
    }
  }, [onClick]);

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
