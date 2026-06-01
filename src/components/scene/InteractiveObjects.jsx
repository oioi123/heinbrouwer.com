import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { ClickableMesh } from './Models';
import { PHOTOS } from './constants';

// CV document lying on the desk; opens the CV viewer when clicked.
export const CVDocument = ({ onCVClick, setShowCVViewer }) => {
  const cvTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Curriculum Vitae', 20, 40);

    ctx.font = 'bold 18px Arial';
    ctx.fillText('Hein Brouwer', 20, 80);

    ctx.font = '14px Arial';
    ctx.fillText('Data Scientist & AR Developer', 20, 110);

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
    <group position={[-0.6, 1.11, 0.7]} rotation={[Math.PI / 2, Math.PI, Math.PI / 0.95]}>
      <ClickableMesh
        onClick={handleClick}
        geometry={<planeGeometry args={[0.4, 0.6]} />}
        material={<meshStandardMaterial map={cvTexture} color="#f5f5f5" />}
      />
    </group>
  );
};

// Framed thesis certificate on the wall; opens the thesis display when clicked.
export const DegreeFrame = ({ onDegreeClick, setShowThesisDisplay }) => {
  const degreeTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f5f3e0';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#8b7d39';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 472, 472);

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

      {/* Certificate with hover effect */}
      <ClickableMesh
        position={[0, 0, 0.03]}
        onClick={handleClick}
        geometry={<planeGeometry args={[1, 1.3]} />}
        material={<meshStandardMaterial map={degreeTexture} />}
      />
    </group>
  );
};

// Photo frame on the wall; opens the photo navigation overlay when clicked.
export const InteractivePhotoFrame = React.memo(({ onPhotoClick, currentPhotoIndex }) => {
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
