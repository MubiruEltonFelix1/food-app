import React, { useState, useContext, createContext, useEffect } from 'react';
import './AuthContext.css';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const userData = {
        id: Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        studentId: `MUST/2024/${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        phone: '',
        dormLocation: '',
        orderHistory: [],
        favorites: [],
        savedAddresses: [],
        dietaryPreferences: [],
        joinDate: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // Validate university email
      if (!userData.email.endsWith('@must.ac.ug') && !userData.email.endsWith('@students.must.ac.ug')) {
        throw new Error('Please use your university email address');
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        studentId: userData.studentId,
        phone: userData.phone,
        dormLocation: userData.dormLocation,
        orderHistory: [],
        favorites: [],
        savedAddresses: [],
        dietaryPreferences: userData.dietaryPreferences || [],
        joinDate: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addToOrderHistory = (order) => {
    const updatedUser = {
      ...user,
      orderHistory: [order, ...user.orderHistory]
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addToFavorites = (item) => {
    const updatedUser = {
      ...user,
      favorites: [...user.favorites, item]
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const removeFromFavorites = (itemId) => {
    const updatedUser = {
      ...user,
      favorites: user.favorites.filter(item => item.idMeal !== itemId)
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    addToOrderHistory,
    addToFavorites,
    removeFromFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
export const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      onClose();
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Welcome Back!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <div className="form-group">
            <label>University Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="yourname@must.ac.ug"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? 
            <button onClick={onSwitchToSignup} className="link-btn">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup Component
export const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    dormLocation: '',
    password: '',
    confirmPassword: '',
    dietaryPreferences: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'No Nuts', 'No Dairy'
  ];

  const handleDietaryChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(option)
        ? prev.dietaryPreferences.filter(item => item !== option)
        : [...prev.dietaryPreferences, option]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const result = await signup(formData);
    
    if (result.success) {
      onClose();
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Join MUST E-Cafeteria</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label>University Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="yourname@must.ac.ug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                placeholder="MUST/2024/1234"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="0771234567"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Dormitory/Location</label>
            <select
              value={formData.dormLocation}
              onChange={(e) => setFormData({...formData, dormLocation: e.target.value})}
              required
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
          
          <div className="form-group">
            <label>Dietary Preferences (Optional)</label>
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
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? 
            <button onClick={onSwitchToLogin} className="link-btn">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
