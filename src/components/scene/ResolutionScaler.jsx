import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DEFAULT_RESOLUTION_SCALE } from './constants';

const ResolutionScaler = ({ scale = DEFAULT_RESOLUTION_SCALE }) => {
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
  }, [gl, size, scale, camera]);

  return null;
};

export default ResolutionScaler;
