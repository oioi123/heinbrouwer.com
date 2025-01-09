import React, { useEffect, useRef, useState } from 'react';
import { Scene, WebGLRenderer, Camera, SplatvLoader, BoxGeometry, MeshBasicMaterial, Mesh } from 'gsplat';

const SplatViewer = () => {
  const canvasRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene and renderer
    const scene = new Scene();
    const renderer = new WebGLRenderer(canvasRef.current);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Initialize camera
    const camera = new Camera();
    camera.position.z = 5; // Fixed property naming
    camera.update(); // If necessary
    cameraRef.current = camera;

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (renderer) {
        renderer.setSize(width, height);
      }

      if (camera) {
        camera.aspect = width / height; // Update aspect ratio if supported
        camera.updateProjectionMatrix?.(); // For perspective cameras, if applicable
        camera.update(); // If required
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Load .splat file
    const loadSplat = async () => {
      try {
        setLoading(true);
        const response = await fetch('/models/desk.splat');
        
        if (!response.ok) throw new Error('Failed to load .splat file');
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Create Splat loader and load the data
        const loader = new SplatvLoader();
        
        if (typeof loader.loadFromBuffer !== 'function') {
          throw new Error('SplatvLoader is not initialized correctly');
        }

        const splat = await loader.loadFromBuffer(arrayBuffer);
        scene.addSplat(splat); // Add the loaded splat to the scene
        setLoading(false);
        console.log('Splat loaded successfully:', splat);
      } catch (error) {
        console.error('Error loading splat:', error);
        setLoading(false);
      }
    };

    loadSplat();

    // Test rendering without .splat (optional, for debugging)
    const testGeometry = new BoxGeometry(1, 1, 1);
    const testMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    const testMesh = new Mesh(testGeometry, testMaterial);
    scene.add(testMesh); // Add test mesh to verify renderer is working

    // Animation loop
    let animationFrameId;
    const animate = () => {
      camera.update(); // If required
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

  // Mouse controls
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

      cameraRef.current.rotation.y += deltaX * 0.01;
      cameraRef.current.rotation.x += deltaY * 0.01;
      
      cameraRef.current.update(); // If necessary

      previousX = e.clientX;
      previousY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      if (!cameraRef.current) return;
      const zoomSpeed = 0.001;
      cameraRef.current.position.z += e.deltaY * zoomSpeed;
      cameraRef.current.update(); // If required
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
        </div>
      )}
    </div>
  );
};

export default SplatViewer;