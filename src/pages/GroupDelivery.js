import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupDelivery.css";

const GROUP_DELIVERY_SLOTS = [
  { id: 1, time: "12:00 PM - 12:30 PM", participants: 3, maxParticipants: 8, deliveryFee: 5000 },
  { id: 2, time: "1:00 PM - 1:30 PM", participants: 6, maxParticipants: 8, deliveryFee: 5000 },
  { id: 3, time: "6:00 PM - 6:30 PM", participants: 2, maxParticipants: 10, deliveryFee: 6000 },
  { id: 4, time: "7:00 PM - 7:30 PM", participants: 8, maxParticipants: 12, deliveryFee: 6000 },
  { id: 5, time: "8:00 PM - 8:30 PM", participants: 1, maxParticipants: 6, deliveryFee: 4000 }
];

function GroupDelivery({ cart = [] }) {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [joinedSlots, setJoinedSlots] = useState([]);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    studentId: "",
    phone: "",
    dormLocation: ""
  });

  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.price || 2000) * item.quantity,
    0
  );

  useEffect(() => {
    // Load joined slots from localStorage
    const saved = localStorage.getItem("joinedGroupDeliveries");
    if (saved) {
      setJoinedSlots(JSON.parse(saved));
    }
  }, []);

  const calculateSplitFee = (deliveryFee, participants) => {
    return Math.ceil(deliveryFee / participants);
  };

  const handleJoinGroup = () => {
    if (!selectedSlot) {
      alert("Please select a delivery time slot");
      return;
    }

    if (!studentInfo.name || !studentInfo.studentId || !studentInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const slot = GROUP_DELIVERY_SLOTS.find(s => s.id === selectedSlot);
    if (slot.participants >= slot.maxParticipants) {
      alert("This time slot is full. Please choose another slot.");
      return;
    }

    // Create delivery order
    const deliveryOrder = {
      id: Date.now(),
      slotId: selectedSlot,
      timeSlot: slot.time,
      studentInfo,
      cart: [...cart],
      orderTotal: cartTotal,
      deliveryFee: calculateSplitFee(slot.deliveryFee, slot.participants + 1),
      totalCost: cartTotal + calculateSplitFee(slot.deliveryFee, slot.participants + 1),
      joinedAt: new Date().toISOString(),
      status: "pending"
    };

    // Save to localStorage
    const updatedJoined = [...joinedSlots, deliveryOrder];
    setJoinedSlots(updatedJoined);
    localStorage.setItem("joinedGroupDeliveries", JSON.stringify(updatedJoined));

    // Update slot participants count (in real app this would be backend)
    const slotIndex = GROUP_DELIVERY_SLOTS.findIndex(s => s.id === selectedSlot);
    if (slotIndex !== -1) {
      GROUP_DELIVERY_SLOTS[slotIndex].participants += 1;
    }

    alert(`Successfully joined group delivery for ${slot.time}!\nYour delivery fee: UGX ${calculateSplitFee(slot.deliveryFee, slot.participants).toLocaleString()}`);
    
    // Navigate to success/confirmation page
    navigate("/group-delivery-confirmation", { state: { order: deliveryOrder } });
  };

  const handleInputChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="group-delivery-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">←</button>
        <h1>Group Delivery</h1>
        <div className="savings-badge">Save on delivery fees!</div>
      </header>

      <div className="container">
        {/* Explanation Section */}
        <div className="info-card">
          <h2>💰 How Group Delivery Works</h2>
          <ul>
            <li>Join other students for the same delivery time slot</li>
            <li>One rider delivers all orders at once</li>
            <li>Delivery fee is split among all participants</li>
            <li>The more people join, the cheaper your delivery becomes!</li>
          </ul>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Your Order Summary</h3>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.idMeal} className="cart-item-summary">
                <span>{item.strMeal} x{item.quantity}</span>
                <span>UGX {((item.price || 2000) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Subtotal: UGX {cartTotal.toLocaleString()}</strong>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="time-slots-section">
          <h3>📅 Available Delivery Slots Today</h3>
          <div className="slots-grid">
            {GROUP_DELIVERY_SLOTS.map(slot => {
              const isSelected = selectedSlot === slot.id;
              const isFull = slot.participants >= slot.maxParticipants;
              const splitFee = calculateSplitFee(slot.deliveryFee, slot.participants + 1);
              const originalFee = slot.deliveryFee;
              const savings = originalFee - splitFee;

              return (
                <div
                  key={slot.id}
                  className={`slot-card ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                  onClick={() => !isFull && setSelectedSlot(slot.id)}
                >
                  <div className="slot-time">{slot.time}</div>
                  <div className="slot-participants">
                    👥 {slot.participants}/{slot.maxParticipants} students
                  </div>
                  <div className="fee-info">
                    <div className="split-fee">
                      Your fee: <strong>UGX {splitFee.toLocaleString()}</strong>
                    </div>
                    <div className="savings">
                      Save UGX {savings.toLocaleString()} from UGX {originalFee.toLocaleString()}
                    </div>
                  </div>
                  {isFull && <div className="full-badge">FULL</div>}
                  {slot.participants < 3 && (
                    <div className="waiting-badge">Waiting for more students</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Information Form */}
        {selectedSlot && (
          <div className="student-form">
            <h3>📝 Student Information</h3>
            <form className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={studentInfo.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  value={studentInfo.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g., MUST/2023/1234"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={studentInfo.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 0771234567"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dormitory/Location</label>
                <select
                  name="dormLocation"
                  value={studentInfo.dormLocation}
                  onChange={handleInputChange}
                >
                  <option value="">Select your location</option>
                  <option value="block-a">Block A</option>
                  <option value="block-b">Block B</option>
                  <option value="block-c">Block C</option>
                  <option value="hostel-1">University Hostel 1</option>
                  <option value="hostel-2">University Hostel 2</option>
                  <option value="off-campus">Off-Campus</option>
                </select>
              </div>
            </form>
          </div>
        )}

        {/* Join Button */}
        {selectedSlot && (
          <div className="join-section">
            {(() => {
              const slot = GROUP_DELIVERY_SLOTS.find(s => s.id === selectedSlot);
              const splitFee = calculateSplitFee(slot.deliveryFee, slot.participants + 1);
              const totalCost = cartTotal + splitFee;

              return (
                <div className="final-summary">
                  <div className="cost-breakdown">
                    <div className="cost-line">
                      <span>Food Total:</span>
                      <span>UGX {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="cost-line delivery">
                      <span>Delivery Fee (split):</span>
                      <span>UGX {splitFee.toLocaleString()}</span>
                    </div>
                    <div className="cost-line total">
                      <span><strong>Total Cost:</strong></span>
                      <span><strong>UGX {totalCost.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <button className="join-btn" onClick={handleJoinGroup}>
                    🚀 Join Group Delivery
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* My Group Deliveries */}
        {joinedSlots.length > 0 && (
          <div className="my-deliveries">
            <h3>📦 My Group Deliveries</h3>
            <div className="delivery-list">
              {joinedSlots.map(delivery => (
                <div key={delivery.id} className="delivery-item">
                  <div className="delivery-time">{delivery.timeSlot}</div>
                  <div className="delivery-details">
                    <div>Order Total: UGX {delivery.orderTotal.toLocaleString()}</div>
                    <div>Split Delivery Fee: UGX {delivery.deliveryFee.toLocaleString()}</div>
                    <div><strong>Total: UGX {delivery.totalCost.toLocaleString()}</strong></div>
                  </div>
                  <div className={`status ${delivery.status}`}>
                    {delivery.status === 'pending' ? '⏳ Pending' : 
                     delivery.status === 'confirmed' ? '✅ Confirmed' :
                     delivery.status === 'delivered' ? '📦 Delivered' : delivery.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDelivery;
