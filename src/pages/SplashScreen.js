import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('loading'); // loading, revealing, completing

  useEffect(() => {
    // Progress animation - slower and more professional
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setCurrentPhase('revealing');
          return 100;
        }
        return prev + 1.5; // Slower progress increment
      });
    }, 70); // Slower interval

    // Phase transitions
    const revealTimer = setTimeout(() => {
      setCurrentPhase('completing');
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className={`splash-container ${currentPhase}`}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-food food-1">🍕</div>
        <div className="floating-food food-2">🍔</div>
        <div className="floating-food food-3">🍗</div>
        <div className="floating-food food-4">🥗</div>
        <div className="floating-food food-5">🍜</div>
        <div className="floating-food food-6">🌮</div>
      </div>

      {/* Main Content */}
      <div className="splash-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-emoji">🍽️</span>
              <div className="logo-pulse"></div>
            </div>
          </div>
          
          {/* Dynamic Title */}
          <div className="title-container">
            <h1 className="main-title">
              <span className="title-word">MUST</span>
              <span className="title-word highlight">E-Cafeteria</span>
            </h1>
            <p className="subtitle">Delicious campus food at your fingertips</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-shine"></div>
          </div>
          <div className="progress-text">
            {progress < 30 && "Preparing fresh ingredients..."}
            {progress >= 30 && progress < 60 && "Finding the best restaurants..."}
            {progress >= 60 && progress < 90 && "Setting up your experience..."}
            {progress >= 90 && "Almost ready to serve!"}
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Fast Delivery</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏫</span>
            <span className="feature-text">Campus Wide</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💳</span>
            <span className="feature-text">Easy Payment</span>
          </div>
        </div>
      </div>

      {/* Particle System */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
}

export default SplashScreen;
