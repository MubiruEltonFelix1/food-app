import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GroupDeliveryConfirmation.css";

function GroupDeliveryConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="error-container">
          <h2>No order found</h2>
          <button onClick={() => navigate("/")} className="home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewMyDeliveries = () => {
    navigate("/group-delivery");
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark">✓</div>
        </div>

        {/* Confirmation Content */}
        <div className="confirmation-content">
          <h1>🎉 You're in the Group!</h1>
          <p className="success-message">
            Your order has been successfully added to the group delivery for{" "}
            <strong>{order.timeSlot}</strong>
          </p>

          {/* Order Details Card */}
          <div className="order-details-card">
            <h3>📦 Order Details</h3>
            
            <div className="detail-section">
              <h4>Student Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{order.studentInfo.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Student ID:</span>
                  <span className="value">{order.studentInfo.studentId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{order.studentInfo.phone}</span>
                </div>
                {order.studentInfo.dormLocation && (
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{order.studentInfo.dormLocation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>Delivery Information</h4>
              <div className="delivery-info">
                <div className="delivery-time">
                  <span className="time-icon">🕐</span>
                  <div>
                    <div className="time-slot">{order.timeSlot}</div>
                    <div className="time-note">Please be ready 5 minutes before</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Cost Breakdown</h4>
              <div className="cost-summary">
                <div className="cost-row">
                  <span>Food Total:</span>
                  <span>UGX {order.orderTotal.toLocaleString()}</span>
                </div>
                <div className="cost-row highlight">
                  <span>Delivery Fee (Split):</span>
                  <span>UGX {order.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="cost-row total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>UGX {order.totalCost.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Your Food Items</h4>
              <div className="food-items">
                {order.cart.map(item => (
                  <div key={item.idMeal} className="food-item">
                    <img src={item.strMealThumb} alt={item.strMeal} />
                    <div className="food-details">
                      <div className="food-name">{item.strMeal}</div>
                      <div className="food-quantity">Quantity: {item.quantity}</div>
                    </div>
                    <div className="food-price">
                      UGX {((item.price || 2000) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-card">
            <h3>📝 What Happens Next?</h3>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">Wait for Confirmation</div>
                  <div className="step-description">
                    You'll receive a call/SMS 30 minutes before delivery
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Prepare Payment</div>
                  <div className="step-description">
                    Have UGX {order.totalCost.toLocaleString()} ready (cash or mobile money)
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-title">Meet the Delivery Rider</div>
                  <div className="step-description">
                    Be at your specified location during the delivery window
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="notes-card">
            <h3>⚠️ Important Notes</h3>
            <ul className="notes-list">
              <li>Keep your phone accessible for delivery updates</li>
              <li>Group delivery cannot be cancelled once confirmed</li>
              <li>Payment is due upon delivery</li>
              <li>If you're not available, your order may be given to someone else</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleViewMyDeliveries} className="secondary-btn">
              View My Group Deliveries
            </button>
            <button onClick={handleGoHome} className="primary-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDeliveryConfirmation;
