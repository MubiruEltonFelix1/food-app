// Enhanced React Hooks for Database Integration
import { useState, useEffect } from 'react';

// Import mock service for testing (will switch to real Firebase later)
import { 
  foodService, 
  restaurantService, 
  orderService, 
  groupDeliveryService,
  userService,
  reviewService 
} from '../services/mockDatabaseService';

// Create a mock auth hook for testing
const useAuth = () => {
  return {
    user: {
      uid: 'test_user_123',
      email: 'test@example.com',
      displayName: 'Test User'
    },
    loading: false
  };
};

// ===== FOOD HOOKS =====
export const useFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const foodData = await foodService.getAll();
        setFoods(foodData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const searchFoods = async (searchTerm) => {
    try {
      setLoading(true);
      const results = await foodService.search(searchTerm);
      setFoods(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category) => {
    try {
      setLoading(true);
      const results = category === 'All' 
        ? await foodService.getAll() 
        : await foodService.getByCategory(category);
      setFoods(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    error,
    searchFoods,
    filterByCategory,
    refetch: () => fetchFoods()
  };
};

// ===== RESTAURANT HOOKS =====
export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getAll();
        setRestaurants(restaurantData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
};

// ===== ORDER HOOKS =====
export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getUserOrders(user.uid);
        setOrders(orderData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const createOrder = async (orderData) => {
    try {
      const orderId = await orderService.create({
        ...orderData,
        userId: user.uid
      });
      
      // Refresh orders
      const updatedOrders = await orderService.getUserOrders(user.uid);
      setOrders(updatedOrders);
      
      return orderId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder
  };
};

// ===== REAL-TIME ORDER TRACKING =====
export const useOrderTracking = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = orderService.listenToOrder(orderId, (orderData) => {
      setOrder(orderData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading };
};

// ===== GROUP DELIVERY HOOKS =====
export const useGroupDeliveries = (location) => {
  const [groupDeliveries, setGroupDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchGroupDeliveries = async () => {
      try {
        setLoading(true);
        const groupData = await groupDeliveryService.getAvailable(location);
        setGroupDeliveries(groupData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching group deliveries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDeliveries();
  }, [location]);

  const createGroupDelivery = async (groupData) => {
    try {
      const groupId = await groupDeliveryService.create(groupData);
      
      // Refresh group deliveries
      const updatedGroups = await groupDeliveryService.getAvailable(location);
      setGroupDeliveries(updatedGroups);
      
      return groupId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const joinGroup = async (groupId, orderId, contribution, userId) => {
    try {
      await groupDeliveryService.join(groupId, userId, orderId, contribution);
      
      // Refresh group deliveries
      const updatedGroups = await groupDeliveryService.getAvailable(location);
      setGroupDeliveries(updatedGroups);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    groupDeliveries,
    loading,
    error,
    createGroupDelivery,
    joinGroup
  };
};

// ===== FAVORITES HOOK =====
export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const userData = await userService.get(user.uid);
        setFavorites(userData?.favorites || []);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const addToFavorites = async (foodId) => {
    try {
      await userService.addFavorite(user.uid, foodId);
      setFavorites(prev => [...prev, foodId]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (foodId) => {
    try {
      await userService.removeFavorite(user.uid, foodId);
      setFavorites(prev => prev.filter(id => id !== foodId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const isFavorite = (foodId) => favorites.includes(foodId);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};

// ===== REVIEWS HOOK =====
export const useReviews = (restaurantId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewData = await reviewService.getByRestaurant(restaurantId);
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  const addReview = async (reviewData) => {
    try {
      await reviewService.add(reviewData);
      // Refresh reviews
      const updatedReviews = await reviewService.getByRestaurant(restaurantId);
      setReviews(updatedReviews);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    reviews,
    loading,
    error,
    addReview
  };
};

// ===== CART HOOK WITH PERSISTENCE =====
export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${user?.uid || 'anonymous'}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [user]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(`cart_${user?.uid || 'anonymous'}`, JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };
};
