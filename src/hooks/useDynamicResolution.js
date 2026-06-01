import { useState, useRef, useEffect } from 'react';
import { DEFAULT_RESOLUTION_SCALE } from '../components/scene/constants';

// Monitors FPS via requestAnimationFrame and scales render resolution
// up or down to keep performance in an acceptable range.
export default function useDynamicResolution(initialScale = DEFAULT_RESOLUTION_SCALE) {
  const [resolutionScale, setResolutionScale] = useState(initialScale);
  const [displayFps, setDisplayFps] = useState(60);

  const fpsRef = useRef(60);
  const frameCountRef = useRef(0);
  const currentScaleRef = useRef(initialScale);
  const fpsUpdateTimerRef = useRef(null);

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
          newScale = Math.min(1.0, newScale + 0.1);
        }

        // Only update state if the scale has changed significantly
        if (Math.abs(newScale - currentScaleRef.current) >= 0.05) {
          currentScaleRef.current = newScale;
          setResolutionScale(newScale);
        }

        frameCountRef.current = 0;
        lastFpsUpdate = time;
      }

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

  return { resolutionScale, displayFps };
}
