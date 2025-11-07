import React from "react";

function CheckoutPage({ cart }) {
  const total = cart.reduce((acc, item) => acc + (item.price || 2000) * item.quantity, 0);

  return (
    <div className="container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="checkout-details">
          {cart.map(item => (
            <div key={item.idMeal} className="checkout-item">
              <span>{item.strMeal}</span>
              <span>UGX {item.price || 2000} × {item.quantity}</span>
            </div>
          ))}
          <h3>Total: UGX {total}</h3>
          <button className="checkout-btn">Place Order</button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
