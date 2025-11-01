import React from "react";

function Friend({ name, age, onIncrease, onDelete }) {
  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <button onClick={onIncrease} style={{ marginRight: "10px" }}>
        Increase Age 🎂
      </button>
      <button onClick={onDelete} style={{ background: "red", color: "white" }}>
        Delete ❌
      </button>
    </div>
  );
}

export default Friend;
