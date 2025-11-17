import React from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";

function CartPage({ cart, setCart }) {
  const total = cart.reduce((acc, item) => acc + (item.price || 2000) * item.quantity, 0);

  const removeFromCart = (idMeal) => {
    setCart(cart.filter(item => item.idMeal !== idMeal));
  };

  return (
    <div className="cart-container">

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0v6m0-6l-1.5-6M7 19h10m-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
              />
            </svg>
          </div>
          <h2 className="empty-title">Your cart is empty</h2>
          <p className="empty-text">Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <h1 className="cart-title">Shopping Cart</h1>

          <div className="cart-card">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.idMeal} className="cart-item">
                  <img
                    src={item.strMealThumb}
                    alt={item.strMeal}
                    className="cart-image"
                  />
                  <div className="cart-details">
                    <h3 className="item-title">{item.strMeal}</h3>
                    <p className="item-price">
                      Unit Price: UGX {(item.price || 2000).toLocaleString()}
                    </p>
                    <div className="quantity-badge">
                      <span className="quantity-label">Quantity:</span>
                      <span className="quantity-value">{item.quantity}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="item-total">
                      UGX {((item.price || 2000) * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.idMeal)}
                      className="remove-btn"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <h3 className="summary-title">Total</h3>
                <p className="summary-total">UGX {total.toLocaleString()}</p>
              </div>
              <div className="delivery-options">
                <div className="delivery-option-card">
                  <h4>🚗 Regular Delivery</h4>
                  <p>Individual delivery to your location</p>
                  <div className="delivery-fee">Delivery: UGX 5,000</div>
                  <Link to="/checkout" className="btn btn-secondary">
                    Regular Checkout
                  </Link>
                </div>
                <div className="delivery-option-card group-delivery">
                  <h4>👥 Group Delivery</h4>
                  <p>Join other students and split delivery fees!</p>
                  <div className="delivery-savings">Save up to UGX 4,000</div>
                  <Link to="/group-delivery" className="btn btn-primary">
                    Join Group Delivery
                  </Link>
                </div>
              </div>
              <div className="button-group">
                <Link to="/" className="btn btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <p className="trust-line">
            Secure checkout • Fast delivery • Easy returns
          </p>
        </>
      )}
    </div>
  );
}

export default CartPage;