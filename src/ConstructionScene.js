// src/ConstructionScene.js
import React, { useState, useEffect } from "react";
import { ReactComponent as CraneSVG } from "./Assets/shovel.svg"; // Import SVG as a React component
import './ConstructionScene.css';

const ConstructionScene = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Building something amazing...",
    "Loading bricks...",
    "Setting up cranes...",
    "Polishing hard hats...",
    "Planting traffic cones...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="construction-wrapper">
      <h1 className="title">🚧 Hein Brouwer is Under Construction 🚧</h1>
      <p className="changing-message">{messages[messageIndex]}</p>

      {/* SVG Crane with a specified size */}
      <div className="crane">
        <CraneSVG style={{ width: '100px', height: 'auto' }} /> 
      </div>

      {/* Traffic Cone */}
      <div className="traffic-cone">
        <div className="cone-body"></div>
        <div className="cone-stripe"></div>
      </div>

      {/* Worker */}
      <div className="worker">
        <span role="img" aria-label="worker">👷‍♂️</span>
        <p className="worker-message">Coming soon!</p>
      </div>
    </div>
  );
};

export default ConstructionScene;
