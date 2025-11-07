import React from "react";
import studentCooks from "../data/studentCooks";
import FoodCard from "./FoodCard";

function StudentCookList() {
  return (
    <div className="grid-list">
      {studentCooks.map((cook) => (
        <FoodCard key={cook.id} item={cook} />
      ))}
    </div>
  );
}

export default StudentCookList;
