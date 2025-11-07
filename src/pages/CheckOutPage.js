import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckOutPage.css";

function CheckoutPage({ cart = [] }) {               // ← default empty array
  const total = cart.reduce(
    (acc, item) => acc + (item.price || 2000) * item.quantity,
    0
  );

  /* ────────────────────── DARK MODE ────────────────────── */
  const [isDark, setIsDark] = useState(() => localStorage.getItem("darkMode") === "true");
  useEffect(() => {
    localStorage.setItem("darkMode", isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  /* ────────────────────── FORM STATE ────────────────────── */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Kampala",
    payment: "cash",
    momoNumber: "",
    momoProvider: "mtn",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ────────────────────── MOBILE-MONEY VALIDATION ────────────────────── */
  const normalizePhone = (raw) => raw.replace(/\D/g, ""); // keep digits only

  const isValidMomo = (raw) => {
    const digits = normalizePhone(raw);
    return /^\d{10}$/.test(digits) && /^[078]/.test(digits[1]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.payment === "momo" && !isValidMomo(form.momoNumber)) {
      alert(
        "Invalid Mobile Money number.\n" +
          "Use a 10-digit number starting with 077 or 078.\n" +
          "Examples:\n" +
          "• 0771234567\n" +
          "• 078 987 6543\n" +
          "• +256771234567"
      );
      return;
    }

    const provider = form.momoProvider.toUpperCase();
    alert(
      form.payment === "momo"
        ? `Pay UGX ${total.toLocaleString()} to ${provider} ${form.momoNumber}`
        : "Order placed – Cash on delivery"
    );
  };

  /* ────────────────────── RENDER ────────────────────── */
  return (
    <div className={`checkout-container ${isDark ? "dark" : ""}`}>
      {/* ── HEADER ── */}
      <div className="header">
        <h1 className="checkout-title">Checkout</h1>
        <div className="dark-toggle" onClick={() => setIsDark(!isDark)}>
          <span>{isDark ? "Dark" : "Light"}</span>
          <div className="toggle-switch"></div>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {cart.length === 0 ? (
        <div className="empty-checkout">
          <div className="empty-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0v6m0-6l-1.5-6M7 19h10m-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
              />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add delicious meals first!</p>
          <Link
            to="/"
            className="btn-primary"
            style={{ display: "inline-block", width: "auto", padding: "0.75rem 1.5rem" }}
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="checkout-layout">
            {/* ── ORDER SUMMARY ── */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Order Summary</h3>
              </div>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.idMeal} className="summary-item">
                    <span>
                      {item.strMeal}
                      <small className="quantity-badge">× {item.quantity}</small>
                    </span>
                    <strong>
                      UGX {((item.price || 2000) * item.quantity).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">
                  UGX {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ── CHECKOUT FORM ── */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Delivery & Payment</h3>
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Phone (general) */}
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="077 123 4567"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    name="address"
                    className="form-textarea"
                    rows={3}
                    placeholder="Plot 12, Nakasero Road..."
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* City (read-only) */}
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={form.city}
                    readOnly
                  />
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    name="payment"
                    className="form-select"
                    value={form.payment}
                    onChange={handleChange}
                    required
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="momo">Mobile Money</option>
                  </select>
                </div>

                {/* ── MOBILE MONEY ── */}
                {form.payment === "momo" && (
                  <div className="momo-section">
                    <p className="momo-title">Pay instantly via Mobile Money</p>

                    <div className="provider-buttons">
                      <button
                        type="button"
                        className={`provider-btn mtn ${form.momoProvider === "mtn" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, momoProvider: "mtn" })}
                      >
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        className={`provider-btn airtel ${form.momoProvider === "airtel" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, momoProvider: "airtel" })}
                      >
                        Airtel Money
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {form.momoProvider === "mtn" ? "MTN" : "Airtel"} Number
                      </label>
                      <input
                        type="tel"
                        name="momoNumber"
                        className="form-input"
                        placeholder="077 123 4567"
                        value={form.momoNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <small className="momo-hint">
                      You’ll receive a payment prompt on your phone.
                    </small>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="btn-primary">
                  {form.payment === "momo"
                    ? `Pay UGX ${total.toLocaleString()} Now`
                    : `Place Order – UGX ${total.toLocaleString()}`}
                </button>
              </form>

              <Link to="/cart" className="back-link">
                Back to Cart
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <div className="badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>30-Min Delivery</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;