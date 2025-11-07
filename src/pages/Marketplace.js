import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckOutPage";
import RestaurantDetail from "./RestaurantDetail";
import "./Marketplace.css";

function Marketplace() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [studentCooks, setStudentCooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch foods & set static categories
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/search.php?s="
        );
        setFoods(res.data.meals || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFoods();

    // Static categories
    setCategories([
      { idCategory: 1, strCategory: "Breakfast" },
      { idCategory: 2, strCategory: "Lunch" },
      { idCategory: 3, strCategory: "Chicken" },
    ]);

    // Sample Restaurants
    setRestaurants([
      {
        id: 1,
        name: "Campus Kitchen",
        specialty: "African Dishes",
        rating: 4.6,
        openingHour: 8,
        closingHour: 18,
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        menu: []
      },
      {
        id: 2,
        name: "Foodie’s Hub",
        specialty: "Fast Food & Burgers",
        rating: 4.3,
        openingHour: 9,
        closingHour: 22,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        menu: []
      }
    ]);

    // Sample Student Cooks
    setStudentCooks([
      {
        id: 1,
        name: "Sarah Nalule",
        dish: "Yummy Meat Stew",
        contact: "0771 234567",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1626108846582-e92033b90b16?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      },
      {
        id: 2,
        name: "Brian Kato",
        dish: "FCI Chapati Combo",
        contact: "0706 998877",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1708782343717-be4ea260249a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      }
    ]);
  }, []);

  // Add to cart
  const addToCart = (food) => {
    const existing = cart.find(item => item.idMeal === food.idMeal);
    if (existing) {
      setCart(cart.map(item =>
        item.idMeal === food.idMeal ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (idMeal) => setCart(cart.filter(item => item.idMeal !== idMeal));

  // Toggle favorites
  const toggleFavorite = (food) => {
    const exists = favorites.find(item => item.idMeal === food.idMeal);
    if (exists) setFavorites(favorites.filter(item => item.idMeal !== food.idMeal));
    else setFavorites([...favorites, food]);
  };

  return (
    <Router>
      <div className="marketplace-app">
        <Navbar cartCount={cart.length} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                foods={foods}
                restaurants={restaurants}
                cooks={studentCooks}
                addToCart={addToCart}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            }
          />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail restaurants={restaurants} addToCart={addToCart} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// =================== Navbar ===================
function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">MUST E-CAFETERIA</Link>
      <Link to="/cart" className="cart-icon">
        🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </Link>
    </nav>
  );
}

// =================== Home with Tabs ===================
function Home({
  foods, restaurants, cooks, addToCart,
  favorites, toggleFavorite, categories,
  selectedCategory, setSelectedCategory
}) {
  const [activeTab, setActiveTab] = React.useState("foods");

  // Filter foods based on selected category
  const filteredFoods = selectedCategory === "All"
    ? foods
    : foods.filter(food => {
        const name = food.strMeal?.toLowerCase() || "";
        const category = food.strCategory?.toLowerCase() || "";

        if (selectedCategory === "Chicken") return category.includes("chicken") || name.includes("chicken");
        if (selectedCategory === "Breakfast") return name.includes("breakfast") || name.includes("egg") || name.includes("toast") || name.includes("pancake");
        if (selectedCategory === "Lunch") return name.includes("rice") || name.includes("chicken") || name.includes("beef") || name.includes("salad") || name.includes("burger");
        return false;
      });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return <span className="stars">{"⭐".repeat(fullStars)}{halfStar && "✨"}</span>;
  };

  const getStatus = (restaurant) => {
    const hour = new Date().getHours();
    return hour >= restaurant.openingHour && hour < restaurant.closingHour ? "Open" : "Closed";
  };

  return (
    <div className="home-container">
      <h1 className="marketplace-title">Discover Campus Meals</h1>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "foods" ? "active" : ""} onClick={() => setActiveTab("foods")}>Foods</button>
        <button className={activeTab === "restaurants" ? "active" : ""} onClick={() => setActiveTab("restaurants")}>Restaurants</button>
        <button className={activeTab === "cooks" ? "active" : ""} onClick={() => setActiveTab("cooks")}>Student Cooks</button>
        <button className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>Favorites</button>
      </div>

      {/* Categories (for foods) */}
      {activeTab === "foods" && (
        <div className="categories">
          <button
            className={selectedCategory === "All" ? "active" : ""}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.idCategory}
              className={selectedCategory === cat.strCategory ? "active" : ""}
              onClick={() => setSelectedCategory(cat.strCategory)}
            >
              {cat.strCategory}
            </button>
          ))}
        </div>
      )}

      {/* Section content */}
      <div className="tab-content">
        {/* Foods */}
        {activeTab === "foods" && (
          <div className="grid-list">
            {filteredFoods.length === 0 ? (
              <p>No meals available under this category.</p>
            ) : (
              filteredFoods.map(food => (
                <div className="food-card" key={food.idMeal}>
                  <img src={food.strMealThumb} alt={food.strMeal} />
                  <h3>{food.strMeal}</h3>
                  <p>{food.strArea}</p>
                  <button onClick={() => addToCart(food)}>Add to Cart</button>
                  <button onClick={() => toggleFavorite(food)}>
                    {favorites.find(item => item.idMeal === food.idMeal) ? "❤️" : "🤍"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === "favorites" && (
          <div className="grid-list">
            {favorites.length === 0 ? <p>No favorites yet!</p> :
              favorites.map(food => (
                <div className="food-card" key={food.idMeal}>
                  <img src={food.strMealThumb} alt={food.strMeal} />
                  <h3>{food.strMeal}</h3>
                  <p>{food.strArea}</p>
                  <button onClick={() => addToCart(food)}>Add to Cart</button>
                  <button onClick={() => toggleFavorite(food)}>❤️</button>
                </div>
              ))
            }
          </div>
        )}

        {/* Restaurants */}
        {activeTab === "restaurants" && (
          <div className="grid-list">
            {restaurants.map(r => (
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
            {cooks.map(cook => (
              <div className="cook-card" key={cook.id}>
                <img src={cook.image} alt={cook.name} />
                <div className="card-body">
                  <h3>{cook.name}</h3>
                  <p>{cook.dish}</p>
                  <p>Contact: {cook.contact}</p>
                  {renderStars(cook.rating)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =================== Footer ===================
function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Made by <a href="https://mubirueltonfelix.site" target="_blank" rel="noopener noreferrer">Mubiru Elton Felix</a>
      </p>
    </footer>
  );
}

export default Marketplace;
