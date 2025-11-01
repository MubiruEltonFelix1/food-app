import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Marketplace.css";

function App() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  // ✅ Fetch food data dynamically from TheMealDB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
        );
        setCategories(["All", ...categoryRes.data.meals.map((c) => c.strCategory)]);

        const foodRes = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        setFoods(foodRes.data.meals);
        setFilteredFoods(foodRes.data.meals);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter and search logic
  useEffect(() => {
    let filtered = foods;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (food) => food.strCategory === selectedCategory
      );
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((food) =>
        food.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredFoods(filtered);
  }, [selectedCategory, searchTerm, foods]);

  // ✅ Add to Cart
  const addToCart = (food) => {
    const existingItem = cart.find((item) => item.idMeal === food.idMeal);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.idMeal === food.idMeal
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = (idMeal) => {
    setCart(cart.filter((item) => item.idMeal !== idMeal));
  };

  // ✅ Handle input change for form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  // ✅ Add new food item
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
      idMeal: Date.now(),
      strMeal: newFood.name,
      strCategory: newFood.category,
      price: parseInt(newFood.price, 10),
      strMealThumb: newFood.image,
    };

    setFoods([newItem, ...foods]);
    setShowForm(false);
    setNewFood({ name: "", price: "", category: "", image: "" });
  };

  return (
    <div className="app">
      <NavBar />

      {/* Search and Filter Section */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        <div className="main-content">
          <h2>Food Items</h2>
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <div key={food.idMeal} className="food-card">
                <img
                  src={food.strMealThumb}
                  alt={food.strMeal}
                  className="food-image"
                />
                <h3>{food.strMeal}</h3>
                <p>{food.strCategory}</p>
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
                {cart.map((item) => (
                  <li key={item.idMeal} className="cart-item">
                    <img
                      src={item.strMealThumb}
                      alt={item.strMeal}
                      className="cart-image"
                    />
                    <div className="cart-details">
                      <h4>{item.strMeal}</h4>
                      <p>
                        UGX {item.price || 2000} × {item.quantity}
                      </p>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.idMeal)}
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
                (acc, item) =>
                  acc + (item.price || 2000) * item.quantity,
                0
              )}
            </h3>
          </div>
        </div>

        {/* Add Food Floating Button */}
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "×" : "+"}
        </button>

        {showForm && (
          <div className="add-food-modal">
            <form onSubmit={handleAddFood} className="add-food-form">
              <h2>Add New Food</h2>
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
                placeholder="Category"
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
          </div>
        )}
      </div>

      <footer className="footer">A product By Mubiru Elton Felix</footer>
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
