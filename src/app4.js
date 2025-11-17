import React, { useState, useEffect } from "react";
import SplashScreen from "./pages/SplashScreen";
import Marketplace from "./pages/MarketplaceModern";
import "./pages/MarketplaceModern.css";

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
