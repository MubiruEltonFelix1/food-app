import React from "react";
import { useParams, Link } from "react-router-dom";
import "./RestaurantDetail.css";

function RestaurantDetail({ restaurants, addToCart }) {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === parseInt(id));
  if (!restaurant) return <p>Restaurant not found</p>;

  const hour = new Date().getHours();
  const status = hour >= restaurant.openingHour && hour < restaurant.closingHour ? "Open" : "Closed";

  // Render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return <span className="stars">{"⭐".repeat(fullStars)}{halfStar && "✨"}</span>;
  };

  return (
    <div className="restaurant-detail">
      <Link to="/">⬅ Back to Marketplace</Link>
      <img src={restaurant.image} alt={restaurant.name} className="banner-img"/>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.specialty}</p>
      <p className={`status ${status}`}>{status}</p>
      {restaurant.rating && <div className="stars">{renderStars(restaurant.rating)}</div>}

      <h3>Menu</h3>
      <div className="grid-list">
        {restaurant.menu && restaurant.menu.length > 0 ? (
          restaurant.menu.map(food => (
            <div className="food-card" key={food.idMeal}>
              <div className="food-badge">
                {food.isSpicy && <span className="badge spicy">🌶️ Spicy</span>}
                {food.isPopular && <span className="badge popular">🔥 Popular</span>}
                {food.isNew && <span className="badge new">🆕 New</span>}
              </div>
              <img src={food.strMealThumb} alt={food.strMeal} />
              <div className="card-body">
                <h3>{food.strMeal}</h3>
                <p>{food.strArea}</p>
                {food.price && <p className="price">UGX {food.price.toLocaleString()}</p>}
                {food.rating && <div className="stars">{renderStars(food.rating)}</div>}
                <button onClick={() => addToCart(food)}>Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>No menu available yet.</p>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;
