import React from "react";
import { Link } from "react-router-dom";
import "./MarketplaceModern.css";

function Home({
  restaurants,
  cooks,
  activeTab,
  setActiveTab,
  getStatus,
  renderStars
}) {
  // State for sorting
  const [sortOption, setSortOption] = React.useState("default");

  // Sorting function
  const sortByRating = (items) => {
    if (sortOption === "rating") {
      return [...items].sort((a, b) => b.rating - a.rating);
    }
    return items;
  };

  // Sorted lists
  const sortedRestaurants = sortByRating(restaurants);
  const sortedCooks = sortByRating(cooks);

  return (
    <div className="home-page">
      {/* Modern Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Campus Marketplace</h1>
          <p className="hero-subtitle">Discover amazing food from restaurants and student chefs</p>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="categories-scroll">
        <button 
          onClick={() => setActiveTab("restaurants")} 
          className={`cat-chip ${activeTab === "restaurants" ? "active" : ""}`}
        >
          🏪 Restaurants
        </button>
        <button 
          onClick={() => setActiveTab("cooks")} 
          className={`cat-chip ${activeTab === "cooks" ? "active" : ""}`}
        >
          👨‍🍳 Student Cooks
        </button>
      </div>

      {/* Modern Sort Control */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 className="section-title">
            {activeTab === "restaurants" ? "Top Restaurants" : "Student Chefs Near You"}
          </h2>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-select"
            style={{ maxWidth: '200px' }}
          >
            <option value="default">Default Order</option>
            <option value="rating">⭐ Rating (High to Low)</option>
          </select>
        </div>

      {/* Modern Restaurants Grid */}
      {activeTab === "restaurants" && (
        <div className="restaurant-grid">
          {sortedRestaurants.map(r => (
            <Link key={r.id} to={`/restaurant/${r.id}`} className="restaurant-card">
              <img src={r.image} alt={r.name} loading="lazy" />
              <div className="restaurant-info">
                <h3>{r.name}</h3>
                <p className="specialty">{r.specialty}</p>
                <div className="restaurant-meta">
                  <span className="rating">★ {r.rating}</span>
                  <span className={`status ${getStatus(r)}`}>• {getStatus(r)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modern Student Cooks Grid */}
      {activeTab === "cooks" && (
        <div className="cooks-grid">
          {sortedCooks.map(cook => (
            <div key={cook.id} className="cook-card">
              <img src={cook.image} alt={cook.name} />
              <div className="cook-info">
                <h4>{cook.name}</h4>
                <p className="dish">{cook.dish}</p>
                <div className="cook-meta">
                  <span>★ {cook.rating}</span>
                  <span className="price">Available Now</span>
                </div>
                <button className="btn btn-primary contact-btn">📱 Message</button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Home;
