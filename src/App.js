// src/App.js
import React, { Suspense } from 'react';
import OfficeScene from './components/OfficeScene';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Suspense fallback={<div className="loading">Loading 3D Scene...</div>}>
        <OfficeScene />
      </Suspense>
    </div>
  );
}

export default App;