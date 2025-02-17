import React, { useEffect, useRef, useState } from 'react';
import { Scene, WebGLRenderer, Camera, SplatvLoader } from 'gsplat';

const SplatViewer = () => {
  const canvasRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene and renderer
    const scene = new Scene();
    const renderer = new WebGLRenderer(canvasRef.current);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Initialize camera
    const camera = new Camera();
    camera._position.z = 5;
    camera.update();
    cameraRef.current = camera;

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (renderer) {
        renderer.setSize(width, height);
      }

      if (camera) {
        camera.update();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Load .splat file
    const loadSplat = async () => {
      try {
        setLoading(true);
        const response = await fetch('/models/desk.splat');
        const arrayBuffer = await response.arrayBuffer();
        
        // Create Splat loader and load the data
        const loader = new SplatvLoader();
        const splat = await loader.loadFromBuffer(arrayBuffer);
        
        scene.addSplat(splat);
        setLoading(false);
        console.log('Splat loaded successfully');
      } catch (error) {
        console.error('Error loading splat:', error);
        setLoading(false);
      }
    };

    loadSplat();

    // Animation loop
    let animationFrameId;
    const animate = () => {
      camera.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
      if (scene) scene.dispose();
    };
  }, []);

  // Mouse controls remain the same...
  useEffect(() => {
    if (!canvasRef.current || !cameraRef.current) return;

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !cameraRef.current) return;

      const deltaX = e.clientX - previousX;
      const deltaY = e.clientY - previousY;

      cameraRef.current._rotation.y += deltaX * 0.01;
      cameraRef.current._rotation.x += deltaY * 0.01;
      
      cameraRef.current.update();

      previousX = e.clientX;
      previousY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      if (!cameraRef.current) return;
      const zoomSpeed = 0.001;
      cameraRef.current._position.z += e.deltaY * zoomSpeed;
      cameraRef.current.update();
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div>Loading Splat...</div>
          <div>{progress}%</div>
        </div>
      )}
    </div>
  );
};

export default SplatViewer;