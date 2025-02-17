// src/App.js
import React, { Suspense } from 'react';
import PortfolioTemplate from './components/portifolio';
import './App.css';

function App() {
  return (
    <div className="app-root">
      <Suspense fallback={
        <div className="loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Portfolio...</div>
          </div>
        </div>
      }>
        <PortfolioTemplate />
      </Suspense>
    </div>
  );
}

export default App;