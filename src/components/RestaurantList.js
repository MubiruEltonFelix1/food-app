import React from "react";
import restaurants from "../data/restaurants";
import FoodCard from "./FoodCard";

function RestaurantList() {
  return (
    <div className="grid-list">
      {restaurants.map((restaurant) => (
        <FoodCard key={restaurant.id} item={restaurant} />
      ))}
    </div>
  );
}

export default RestaurantList;
