import React from "react";
import { Link } from "react-router-dom";

function CartPage({ cart, removeFromCart }) {
  const total = cart.reduce((acc, item) => acc + (item.price || 2000) * item.quantity, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.idMeal} className="cart-item">
              <img src={item.strMealThumb} alt={item.strMeal} className="cart-image" />
              <div className="cart-details">
                <h4>{item.strMeal}</h4>
                <p>UGX {item.price || 2000} × {item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.idMeal)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">Total: UGX {total}</h3>
          <Link to="/checkout">
            <button className="checkout-btn">Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartPage;
