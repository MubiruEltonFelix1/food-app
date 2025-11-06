import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckOutPage";
import "./Marketplace.css";

function Marketplace() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch food data
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        setFoods(res.data.meals || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFoods();
  }, []);

  // Add to cart
  const addToCart = (food) => {
    const existing = cart.find(item => item.idMeal === food.idMeal);
    if (existing) {
      setCart(
        cart.map(item =>
          item.idMeal === food.idMeal
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (idMeal) => {
    setCart(cart.filter(item => item.idMeal !== idMeal));
  };

  return (
    <Router>
      <div className="marketplace-app">
        <Navbar cartCount={cart.length} />

        <Routes>
          <Route
            path="/"
            element={<Home foods={foods} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={<CartPage cart={cart} removeFromCart={removeFromCart} />}
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cart={cart} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

// Navbar with cart badge
function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Campus Food Marketplace</Link>
      <Link to="/cart" className="cart-icon">
        🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </Link>
    </nav>
  );
}

export default Marketplace;
