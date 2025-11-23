// Quick Firebase Integration Setup
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import MarketplaceModern from './MarketplaceModern';
import { Toaster } from 'react-hot-toast';

// Enhanced App component with all providers
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <MarketplaceModern />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
