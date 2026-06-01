import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const Walls = () => {
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

export const Rug = () => {
  const rugTexture = useLoader(TextureLoader, '/Textures/rug.png');

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={[0, 0.01, 1.3]}
      receiveShadow
    >
      <planeGeometry args={[4.5, 3.5]} />
      <meshStandardMaterial map={rugTexture} transparent={true} side={THREE.DoubleSide} />
    </mesh>
  );
};
