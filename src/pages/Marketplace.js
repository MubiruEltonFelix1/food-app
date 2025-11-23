import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckOutPage";
import RestaurantDetail from "./RestaurantDetail";
import GroupDelivery from "./GroupDelivery";
import GroupDeliveryConfirmation from "./GroupDeliveryConfirmation";
import UserProfile from "./UserProfile";
import EnhancedSearch from "../components/EnhancedSearch";
import "./MarketplaceModern.css";
import "../contexts/AuthContext.css";

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
        <MobileBottomNav cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} />
      </div>
    </Router>
  );
}

// ===== Navbar =====
function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(null);

  return (
    <>
      <nav className="navbar-fixed">
        <div className="navbar-content">
          <button onClick={() => navigate(-1)} className="back-btn">←</button>
          <h1 className="logo">MUST E-Cafeteria</h1>
          <div className="nav-actions">
            {/* Desktop Login/Signup - Hidden on mobile */}
            <button 
              className="auth-btn login-btn desktop-only"
              onClick={() => setShowAuthModal('login')}
            >
              <span className="auth-text">Login</span>
              <span className="auth-icon">👤</span>
            </button>
            <button 
              className="auth-btn signup-btn desktop-only"
              onClick={() => setShowAuthModal('signup')}
            >
              <span className="auth-text">Sign Up</span>
              <span className="auth-icon">✨</span>
            </button>
            <Link to="/cart" className="cart-btn">
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Auth Modals */}
      {showAuthModal === 'login' && (
        <SimpleLoginModal 
          onClose={() => setShowAuthModal(null)} 
          onSwitchToSignup={() => setShowAuthModal('signup')}
        />
      )}
      {showAuthModal === 'signup' && (
        <SimpleSignupModal 
          onClose={() => setShowAuthModal(null)} 
          onSwitchToLogin={() => setShowAuthModal('login')}
        />
      )}
    </>
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
        <h2 className="hero-title">MUST E-Cafeteria</h2>
        <p className="hero-subtitle">Delicious campus food delivered to your doorstep</p>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search for food, restaurants..." />
          <button className="search-filter-btn" aria-label="Filter search results">
            <span className="filter-icon">⚙️</span>
          </button>
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
        <h3 className="meal-title">{food.strMeal}</h3>
        <p className="cuisine">{food.strArea} • {food.strCategory}</p>
        <div className="meal-actions">
          <div className="price-section">
            <span className="price">UGX {(Math.random() * 20 + 10).toFixed(0)}k</span>
            <span className="rating">★ {(4.0 + Math.random()).toFixed(1)}</span>
          </div>
          <button onClick={() => addToCart(food)} className="add-btn">
            <span className="add-icon">+</span>
          </button>
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

// ===== Mobile Bottom Navigation =====
function MobileBottomNav({ cartCount }) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  
  return (
    <>
      <nav className="mobile-bottom-nav">
        <button 
          className="nav-item active" 
          onClick={() => {
            navigate('/');
            setShowSearch(false);
            setShowOrders(false);
          }}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        
        <button 
          className="nav-item" 
          onClick={() => setShowSearch(!showSearch)}
        >
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Search</span>
        </button>
        
        <button 
          className="nav-item" 
          onClick={() => navigate('/cart')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        
        <button 
          className="nav-item" 
          onClick={() => setShowOrders(!showOrders)}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Orders</span>
        </button>
        
        <button 
          className="nav-item" 
          onClick={() => setShowAuthModal('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <MobileSearchOverlay onClose={() => setShowSearch(false)} />
      )}

      {/* Mobile Orders Overlay */}
      {showOrders && (
        <MobileOrdersOverlay onClose={() => setShowOrders(false)} />
      )}

      {/* Mobile Profile Menu with Auth */}
      {showAuthModal === 'profile' && (
        <MobileProfileMenu 
          onClose={() => setShowAuthModal(null)}
          onLogin={() => setShowAuthModal('login')}
          onSignup={() => setShowAuthModal('signup')}
        />
      )}

      {/* Auth Modals */}
      {showAuthModal === 'login' && (
        <SimpleLoginModal 
          onClose={() => setShowAuthModal(null)} 
          onSwitchToSignup={() => setShowAuthModal('signup')}
        />
      )}
      {showAuthModal === 'signup' && (
        <SimpleSignupModal 
          onClose={() => setShowAuthModal(null)} 
          onSwitchToLogin={() => setShowAuthModal('login')}
        />
      )}
    </>
  );
}

// ===== Mobile Overlay Components =====
function MobileSearchOverlay({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mobile-overlay">
      <div className="mobile-overlay-header">
        <h3>Search Food & Restaurants</h3>
        <button className="overlay-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="mobile-overlay-content">
        <div className="mobile-search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for food, restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="search-suggestions">
          <h4>Popular Searches</h4>
          <div className="suggestion-chips">
            {['Chicken', 'Beef Stew', 'Rice', 'Chapati', 'Samosa', 'Rolex'].map(item => (
              <button key={item} className="suggestion-chip" onClick={() => setSearchQuery(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileOrdersOverlay({ onClose }) {
  const [orders] = useState([
    { id: 1, status: 'Delivered', items: 'Chicken Rice + Drink', date: 'Today, 2:30 PM', total: 'UGX 15,000' },
    { id: 2, status: 'In Progress', items: 'Beef Stew + Chapati', date: 'Today, 1:15 PM', total: 'UGX 12,000' }
  ]);

  return (
    <div className="mobile-overlay">
      <div className="mobile-overlay-header">
        <h3>Your Orders</h3>
        <button className="overlay-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="mobile-overlay-content">
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                  <span className="order-date">{order.date}</span>
                </div>
                <div className="order-items">{order.items}</div>
                <div className="order-total">{order.total}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-icon">📋</div>
            <h4>No Orders Yet</h4>
            <p>Your order history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileProfileMenu({ onClose, onLogin, onSignup }) {
  const [isLoggedIn] = useState(false); // This would come from auth state

  return (
    <div className="mobile-overlay">
      <div className="mobile-overlay-header">
        <h3>{isLoggedIn ? 'Your Profile' : 'Account'}</h3>
        <button className="overlay-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="mobile-overlay-content">
        {isLoggedIn ? (
          <div className="profile-content">
            <div className="profile-info">
              <div className="avatar">👤</div>
              <h4>John Doe</h4>
              <p>john.doe@must.ac.ug</p>
            </div>
            <div className="profile-menu">
              <button className="profile-menu-item">
                <span className="menu-icon">👤</span>
                Edit Profile
              </button>
              <button className="profile-menu-item">
                <span className="menu-icon">🎯</span>
                Preferences
              </button>
              <button className="profile-menu-item">
                <span className="menu-icon">💳</span>
                Payment Methods
              </button>
              <button className="profile-menu-item">
                <span className="menu-icon">📞</span>
                Support
              </button>
              <button className="profile-menu-item logout">
                <span className="menu-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-content">
            <div className="auth-welcome">
              <div className="welcome-icon">🍽️</div>
              <h4>Welcome to MUST E-Cafeteria</h4>
              <p>Sign in to access your orders, favorites, and personalized recommendations</p>
            </div>
            <div className="auth-buttons">
              <button className="mobile-auth-btn login" onClick={onLogin}>
                <span className="auth-icon">👤</span>
                <div className="auth-text">
                  <span className="auth-title">Login</span>
                  <span className="auth-subtitle">Access your account</span>
                </div>
              </button>
              <button className="mobile-auth-btn signup" onClick={onSignup}>
                <span className="auth-icon">✨</span>
                <div className="auth-text">
                  <span className="auth-title">Sign Up</span>
                  <span className="auth-subtitle">Create new account</span>
                </div>
              </button>
            </div>
            <div className="guest-mode">
              <button className="guest-btn" onClick={onClose}>
                <span>Continue as Guest</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Simple Auth Modals (without context) =====
function SimpleLoginModal({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      // Simulate login
      setTimeout(() => {
        alert("Login successful! Welcome back!");
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Welcome Back</h2>
          <button className="auth-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@must.ac.ug"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? 
          <button type="button" onClick={onSwitchToSignup} className="auth-switch-btn">
            Sign up instead
          </button>
        </p>
      </div>
    </div>
  );
}

function SimpleSignupModal({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setLoading(true);
    try {
      // Simulate signup
      setTimeout(() => {
        alert("Account created successfully! Welcome to MUST E-Cafeteria!");
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Join MUST E-Cafeteria</h2>
          <button className="auth-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@must.ac.ug"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account? 
          <button type="button" onClick={onSwitchToLogin} className="auth-switch-btn">
            Login instead
          </button>
        </p>
      </div>
    </div>
  );
}

export default Marketplace;