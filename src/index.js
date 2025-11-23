import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Marketplace from "./pages/Marketplace";
import SplashScreen from "./pages/SplashScreen";
import "./index.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // Show splash for 5 seconds - more time to appreciate

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <Marketplace />;
}

// REACT 18 with Database Integration
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// REACT 17
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
