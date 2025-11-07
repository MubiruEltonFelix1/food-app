import React from "react";
import { Link } from "react-router-dom";

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
    <div className="container">
      <h2>Campus Marketplace</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab("restaurants")} className={activeTab === "restaurants" ? "active" : ""}>
          Restaurants
        </button>
        <button onClick={() => setActiveTab("cooks")} className={activeTab === "cooks" ? "active" : ""}>
          Student Cooks
        </button>
      </div>

      <div className="sort-container">
        <label>Sort by: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="default">Default</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
      </div>

      {/* Restaurants */}
      {activeTab === "restaurants" && (
        <div className="grid-list">
          {sortedRestaurants.map(r => (
            <Link key={r.id} to={`/restaurant/${r.id}`} className="restaurant-card-link">
              <div className="restaurant-card">
                <img src={r.image} alt={r.name} />
                <div className="card-body">
                  <h3>{r.name}</h3>
                  <p>{r.specialty}</p>
                  <span className={`status ${getStatus(r)}`}>{getStatus(r)}</span>
                  <span>{renderStars(r.rating)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Student Cooks */}
      {activeTab === "cooks" && (
        <div className="grid-list">
          {sortedCooks.map(cook => (
            <div key={cook.id} className="cook-card">
              <img src={cook.image} alt={cook.name} />
              <div className="card-body">
                <h3>{cook.name}</h3>
                <p>{cook.dish}</p>
                <span>{renderStars(cook.rating)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
