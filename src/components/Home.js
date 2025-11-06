import React from "react";

function Home({ foods, addToCart }) {
  return (
    <div className="container">
      <h2>Food Items</h2>
      <div className="food-grid">
        {foods.map(food => (
          <div key={food.idMeal} className="food-card">
            <img src={food.strMealThumb} alt={food.strMeal} className="food-image" />
            <h3>{food.strMeal}</h3>
            <p className="category">{food.strCategory}</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
