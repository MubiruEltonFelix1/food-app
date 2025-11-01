import React from "react";
import "./SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="logo-section">
        <img src="/images/logo.png" alt="App Logo" className="app-logo" />
        <h1 className="app-title">Campus Food Marketplace</h1>
        <div className="loading-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
