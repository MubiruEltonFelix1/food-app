import React, { useState } from "react";
import "./Marketplace.css";

function App() {
  const [foods, setFoods] = useState([
    {
      id: 1,
      name: "FCI Pizza",
      price: 30000,
      category: "Breakfast",
      image: "./images/download (1).jpg",},
    {
      id: 2,
      name: "Ugandan Spaghetti",
      price: 5000,
      category: "Lunch",
      image: "./images/download (3).jpg",
    },
    {
      id: 3,
      name: "Chips, Chicken & Burger",
      price: 100,
      category: "Snack",
      image: "./images/download (2).jpg",
    },
  ]);

  const [cart, setCart] = useState([]);
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("");

  const addToCart = (food) => {
    const existingItem = cart.find((item) => item.id === food.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const removeFromCart = (indexToRemove) => {
    const item = cart[indexToRemove];
    if (item.quantity > 1) {
      setCart(
        cart.map((c, idx) =>
          idx === indexToRemove
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
      );
    } else {
      setCart(cart.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (
      !newFood.name ||
      !newFood.price ||
      !newFood.category ||
      !newFood.image
    )
      return;

    const newItem = {
      id: Date.now(),
      name: newFood.name,
      price: parseInt(newFood.price, 10),
      category: newFood.category,
      image: newFood.image,
    };

    setFoods([...foods, newItem]);
    setNewFood({ name: "", price: "", category: "", image: "" });
  };

  const filteredFoods = categoryFilter
    ? foods.filter((food) => food.category === categoryFilter)
    : foods;

  return (
    <div className="app">
      <NavBar />
      <div className="container">
        <div className="sidebar">
          <h2>Add New Food Item</h2>
          <form onSubmit={handleAddFood} className="add‐food-form">
            <input
              type="text"
              name="name"
              placeholder="Food Name"
              value={newFood.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price (UGX)"
              value={newFood.price}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category (e.g. Lunch)"
              value={newFood.category}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newFood.image}
              onChange={handleChange}
            />
            <button type="submit">Add Food</button>
          </form>

          <div className="filter-section">
            <h2>Filter by Category</h2>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              {[...new Set(foods.map((f) => f.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="main-content">
          <h2>Food Items</h2>
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <div key={food.id} className="food-card">
                <img
                  src={food.image}
                  alt={food.name}
                  className="food-image"
                />
                <h3>{food.name}</h3>
                <p>UGX {food.price}</p>
                <button onClick={() => addToCart(food)}>Add to Cart</button>
              </div>
            ))}
          </div>

          <div className="cart-section">
            <h2>Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item, index) => (
                  <li key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-image"
                    />
                    <div className="cart-details">
                      <h4>{item.name}</h4>
                      <p>
                        UGX {item.price} × {item.quantity}
                      </p>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="cart-total">
              Total: UGX{" "}
              {cart.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <div className="navbar">
      <h1>Campus Food Marketplace</h1>
    </div>
  );
}

export default App;
