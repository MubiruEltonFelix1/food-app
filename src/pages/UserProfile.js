import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dormLocation: user?.dormLocation || '',
    dietaryPreferences: user?.dietaryPreferences || []
  });

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'No Nuts', 'No Dairy'
  ];

  const handleSave = () => {
    updateProfile(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      dormLocation: user.dormLocation,
      dietaryPreferences: user.dietaryPreferences
    });
    setEditMode(false);
  };

  const handleDietaryChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(option)
        ? prev.dietaryPreferences.filter(item => item !== option)
        : [...prev.dietaryPreferences, option]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'out-for-delivery': return '🚗';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p className="student-id">{user?.studentId}</p>
          <p className="join-date">Member since {formatDate(user?.joinDate)}</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          📋 Profile
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="edit-btn">
                  ✏️ Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-btn">
                    💾 Save
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <p>{user?.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Student ID</label>
                  <p>{user?.studentId}</p>
                  <small>Student ID cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <p>{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Dormitory/Location</label>
                  {editMode ? (
                    <select
                      value={formData.dormLocation}
                      onChange={(e) => setFormData({...formData, dormLocation: e.target.value})}
                    >
                      <option value="">Select location</option>
                      <option value="block-a">Block A</option>
                      <option value="block-b">Block B</option>
                      <option value="block-c">Block C</option>
                      <option value="hostel-1">University Hostel 1</option>
                      <option value="hostel-2">University Hostel 2</option>
                      <option value="off-campus">Off-Campus</option>
                    </select>
                  ) : (
                    <p>{user?.dormLocation || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Dietary Preferences</label>
                {editMode ? (
                  <div className="checkbox-grid">
                    {dietaryOptions.map(option => (
                      <label key={option} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.dietaryPreferences.includes(option)}
                          onChange={() => handleDietaryChange(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="dietary-tags">
                    {user?.dietaryPreferences?.length > 0 ? 
                      user.dietaryPreferences.map(pref => (
                        <span key={pref} className="dietary-tag">{pref}</span>
                      )) : 
                      <p>No dietary preferences specified</p>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            {user?.orderHistory?.length > 0 ? (
              <div className="orders-list">
                {user.orderHistory.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">{formatDate(order.date)}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {getOrderStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items?.map(item => (
                        <div key={item.id} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            UGX {item.total?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-total">
                      <strong>Total: UGX {order.total?.toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <h2>Favorite Items</h2>
            {user?.favorites?.length > 0 ? (
              <div className="favorites-grid">
                {user.favorites.map(item => (
                  <div key={item.idMeal} className="favorite-card">
                    <img src={item.strMealThumb} alt={item.strMeal} />
                    <div className="favorite-info">
                      <h3>{item.strMeal}</h3>
                      <p>{item.strArea} • {item.strCategory}</p>
                      <button className="remove-favorite-btn">
                        💔 Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No favorites yet</h3>
                <p>Add items to your favorites for quick access</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            
            <div className="settings-group">
              <h3>Notifications</h3>
              <label className="setting-item">
                <input type="checkbox" defaultChecked />
                <span>Email notifications for order updates</span>
              </label>
              <label className="setting-item">
                <input type="checkbox" defaultChecked />
                <span>SMS notifications for delivery status</span>
              </label>
              <label className="setting-item">
                <input type="checkbox" />
                <span>Marketing emails and promotions</span>
              </label>
            </div>

            <div className="settings-group">
              <h3>Privacy</h3>
              <label className="setting-item">
                <input type="checkbox" defaultChecked />
                <span>Allow profile visibility to other students</span>
              </label>
              <label className="setting-item">
                <input type="checkbox" />
                <span>Share order data for service improvement</span>
              </label>
            </div>

            <div className="settings-group">
              <h3>Account Actions</h3>
              <button className="danger-btn">Delete Account</button>
              <p className="danger-text">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
