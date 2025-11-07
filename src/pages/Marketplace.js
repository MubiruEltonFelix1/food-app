import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckOutPage";
import RestaurantDetail from "./RestaurantDetail";
import "./Marketplace.css";

function Marketplace() {
  const [foods, setFoods] = useState([]);
  const [restaurants] = useState([
    { id: 1, name: "Campus Kitchen", specialty: "African Dishes", rating: 4.6, deliveryTime: "20–30 min", fee: "Free", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800" },
    { id: 2, name: "Foodie’s Hub", specialty: "Fast Food & Burgers", rating: 4.3, deliveryTime: "15–25 min", fee: "$0.99", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800" }
  ]);
  const [studentCooks] = useState([
    { id: 1, name: "Sarah Nalule", dish: "Yummy Meat Stew", contact: "0771 234567", rating: 4.7, price: "UGX 12,000", image: "https://images.unsplash.com/photo-1626108846582-e92033b90b16?w=800" },
    { id: 2, name: "Brian Kato", dish: "FCI Chapati Combo", contact: "0706 998877", rating: 4.5, price: "UGX 8,000", image: "https://images.unsplash.com/photo-1708782343717-be4ea260249a?w=800" }
  ]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await res.json();
        setFoods(data.meals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find(i => i.idMeal === item.idMeal);
    if (exists) {
      setCart(cart.map(i => i.idMeal === item.idMeal ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const toggleFavorite = (item) => {
    const exists = favorites.find(i => i.idMeal === item.idMeal);
    if (exists) {
      setFavorites(favorites.filter(i => i.idMeal !== item.idMeal));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} />
        <Routes>
          <Route path="/" element={
            <Home
              foods={foods}
              restaurants={restaurants}
              cooks={studentCooks}
              addToCart={addToCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              loading={loading}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          } />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail restaurants={restaurants} addToCart={addToCart} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// ===== Navbar =====
function Navbar({ cartCount }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar-fixed">
      <div className="navbar-content">
        <button onClick={() => navigate(-1)} className="back-btn">←</button>
        <h1 className="logo">MUST E-Cafeteria</h1>
        <Link to="/cart" className="cart-btn">
          <span className="cart-icon">Cart</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

// ===== Home =====
function Home({ foods, restaurants, cooks, addToCart, favorites, toggleFavorite, loading, selectedCategory, setSelectedCategory }) {
  const filteredFoods = selectedCategory === "All" ? foods : foods.filter(f => f.strCategory === selectedCategory);
  const categories = ["All", "Breakfast", "Lunch", "Chicken", "Dessert", "Beef"];

  const renderStars = (rating) => "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));

  return (
    <div className="home-page">
      {/* Hero Search Bar */}
      <div className="search-hero">
        <div className="search-bar">
          <span className="search-icon">Search</span>
          <input type="text" placeholder="Search for food, restaurants..." />
        </div>
        <p className="delivery-info">Delivering to <strong>Main Campus</strong> ▼</p>
      </div>

      {/* Categories */}
      <div className="categories-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Popular Meals */}
      <section className="section">
        <h2 className="section-title">Popular Right Now</h2>
        <div className="meal-grid">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filteredFoods.slice(0, 12).map(food => (
                <MealCard
                  key={food.idMeal}
                  food={food}
                  addToCart={addToCart}
                  isFavorite={favorites.some(f => f.idMeal === food.idMeal)}
                  toggleFavorite={() => toggleFavorite(food)}
                />
              ))
          }
        </div>
      </section>

      {/* Restaurants */}
      <section className="section">
        <h2 className="section-title">Top Restaurants</h2>
        <div className="restaurant-grid">
          {restaurants.map(r => (
            <Link to={`/restaurant/${r.id}`} key={r.id} className="restaurant-card">
              <img src={r.image} alt={r.name} loading="lazy" />
              <div className="restaurant-info">
                <h3>{r.name}</h3>
                <p className="specialty">{r.specialty}</p>
                <div className="restaurant-meta">
                  <span className="rating">★ {r.rating}</span>
                  <span>• {r.deliveryTime}</span>
                  <span>• {r.fee} delivery</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Student Cooks */}
      <section className="section">
        <h2 className="section-title">Student Chefs Near You</h2>
        <div className="cooks-grid">
          {cooks.map(cook => (
            <div key={cook.id} className="cook-card">
              <img src={cook.image} alt={cook.name} />
              <div className="cook-info">
                <h4>{cook.name}</h4>
                <p className="dish">{cook.dish}</p>
                <div className="cook-meta">
                  <span>★ {cook.rating}</span>
                  <span className="price">{cook.price}</span>
                </div>
                <button className="contact-btn">Message</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MealCard({ food, addToCart, isFavorite, toggleFavorite }) {
  return (
    <div className="meal-card">
      <div className="image-wrapper">
        <img src={food.strMealThumb} alt={food.strMeal} loading="lazy" />
        <button onClick={toggleFavorite} className="fav-btn">
          {isFavorite ? "❤️" : "♡"}
        </button>
      </div>
      <div className="meal-details">
        <h3>{food.strMeal}</h3>
        <p className="cuisine">{food.strArea} • {food.strCategory}</p>
        <div className="meal-actions">
          <span className="price">UGX {(Math.random() * 20 + 10).toFixed(0)}k</span>
          <button onClick={() => addToCart(food)} className="add-btn">+</button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="skeleton-card"></div>;
}

// ===== Footer =====
function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} MUST E-Cafeteria • Made by <a href="https://mubirueltonfelix.com" target="_blank" rel="noreferrer">Mubiru Elton Felix</a></p>
    </footer>
  );
}

export default Marketplace;