// Database Integration Test Component
import React from 'react';
import { useFood, useRestaurants } from '../hooks/useDatabaseHooks';
import './DatabaseTest.css';

const DatabaseTest = () => {
  const { foods, loading: foodLoading, error: foodError, searchFoods, filterByCategory } = useFood();
  const { restaurants, loading: restLoading, error: restError } = useRestaurants();

  if (foodLoading || restLoading) {
    return (
      <div className="database-test-loading">
        <div className="loading-spinner"></div>
        <p>Loading database services...</p>
      </div>
    );
  }

  if (foodError || restError) {
    return (
      <div className="database-test-error">
        <h3>❌ Database Connection Error</h3>
        <p>{foodError || restError}</p>
      </div>
    );
  }

  return (
    <div className="database-test">
      <div className="database-test-header">
        <h2>🔥 Database Integration Test</h2>
        <p>Testing database services with mock data</p>
      </div>

      <div className="test-section">
        <h3>📍 Restaurants ({restaurants.length})</h3>
        <div className="test-grid">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="test-card">
              <img src={restaurant.image} alt={restaurant.name} />
              <h4>{restaurant.name}</h4>
              <p>{restaurant.description}</p>
              <div className="restaurant-info">
                <span className="cuisine">{restaurant.cuisine}</span>
                <span className="rating">⭐ {restaurant.rating}</span>
                <span className="delivery-time">🕒 {restaurant.deliveryTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section">
        <h3>🍕 Foods ({foods.length})</h3>
        <div className="test-controls">
          <button onClick={() => searchFoods('pizza')}>Search Pizza</button>
          <button onClick={() => filterByCategory('Pizza')}>Filter Pizza</button>
          <button onClick={() => filterByCategory('Burgers')}>Filter Burgers</button>
          <button onClick={() => filterByCategory('Sushi')}>Filter Sushi</button>
          <button onClick={() => filterByCategory('All')}>Show All</button>
        </div>
        <div className="test-grid">
          {foods.map(food => (
            <div key={food.id} className="test-card">
              <img src={food.image} alt={food.name} />
              <h4>{food.name}</h4>
              <p>{food.description}</p>
              <div className="food-info">
                <span className="price">${food.price}</span>
                <span className="category">{food.category}</span>
                <span className="prep-time">⏱️ {food.preparationTime} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section">
        <h3>✅ Integration Status</h3>
        <div className="status-grid">
          <div className="status-item success">
            <span className="status-icon">✅</span>
            <span>Food Service Connected</span>
          </div>
          <div className="status-item success">
            <span className="status-icon">✅</span>
            <span>Restaurant Service Connected</span>
          </div>
          <div className="status-item success">
            <span className="status-icon">✅</span>
            <span>Mock Data Loaded</span>
          </div>
          <div className="status-item pending">
            <span className="status-icon">⏳</span>
            <span>Firebase Setup Pending</span>
          </div>
        </div>
      </div>

      <div className="test-footer">
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Set up Firebase project</li>
          <li>Update environment variables</li>
          <li>Switch from mock to real database service</li>
          <li>Add authentication</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseTest;
