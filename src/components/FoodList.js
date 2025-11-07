import React from "react";
import foods from "../data/foods";
import FoodCard from "./FoodCard";

function FoodList() {
  return (
    <div className="grid-list">
      {foods.map((food) => (
        <FoodCard key={food.id} item={food} />
      ))}
    </div>
  );
}

export default FoodList;
