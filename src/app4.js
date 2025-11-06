import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Marketplace from "./components/Marketplace";
import "./components/Marketplace.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); // 3 seconds splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showSplash ? <SplashScreen /> : <Marketplace />}
    </div>
  );
}

export default App;
