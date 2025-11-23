// Enhanced Cart Context with Database Integration
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { orderService } from '../services/databaseService';

const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_DELIVERY_INFO: 'SET_DELIVERY_INFO',
  SET_LOADING: 'SET_LOADING'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...item, quantity }]
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId)
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity }
            : item
        )
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        deliveryInfo: null
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload.items || [],
        deliveryInfo: action.payload.deliveryInfo || null
      };

    case CART_ACTIONS.SET_DELIVERY_INFO:
      return {
        ...state,
        deliveryInfo: action.payload.deliveryInfo
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  deliveryInfo: null,
  loading: false
};

// Enhanced Cart Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart from localStorage when user changes
  useEffect(() => {
    const cartKey = `cart_${user?.uid || 'anonymous'}`;
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: parsedCart
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [user]);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    const cartKey = `cart_${user?.uid || 'anonymous'}`;
    const cartData = {
      items: state.items,
      deliveryInfo: state.deliveryInfo
    };
    localStorage.setItem(cartKey, JSON.stringify(cartData));
  }, [state.items, state.deliveryInfo, user]);

  // Cart Actions
  const addToCart = (item, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { item, quantity }
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { itemId }
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART
    });
  };

  const setDeliveryInfo = (deliveryInfo) => {
    dispatch({
      type: CART_ACTIONS.SET_DELIVERY_INFO,
      payload: { deliveryInfo }
    });
  };

  // Cart Calculations
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryFee = () => {
    const total = getCartTotal();
    if (total >= 50) return 0; // Free delivery over $50
    return 5; // $5 delivery fee
  };

  const getTotalWithDelivery = () => {
    return getCartTotal() + getDeliveryFee();
  };

  // Order Creation
  const createOrder = async (orderType = 'individual') => {
    if (!user) {
      throw new Error('User must be logged in to place an order');
    }

    if (state.items.length === 0) {
      throw new Error('Cart is empty');
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: { loading: true } });

    try {
      const orderData = {
        userId: user.uid,
        items: state.items,
        total: getCartTotal(),
        deliveryFee: getDeliveryFee(),
        finalTotal: getTotalWithDelivery(),
        deliveryInfo: state.deliveryInfo,
        orderType, // 'individual' or 'group'
        status: 'pending',
        createdAt: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes from now
      };

      const orderId = await orderService.create(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: { loading: false } });
    }
  };

  // Group Order Functions
  const createGroupOrder = async (groupDeliveryData) => {
    try {
      const orderId = await createOrder('group');
      
      // Additional group delivery logic can be added here
      // For example, associating the order with a group delivery
      
      return { orderId, groupDeliveryData };
    } catch (error) {
      throw error;
    }
  };

  // Cart Validation
  const validateCart = () => {
    const errors = [];
    
    if (state.items.length === 0) {
      errors.push('Cart is empty');
    }
    
    if (!state.deliveryInfo) {
      errors.push('Delivery information is required');
    } else {
      if (!state.deliveryInfo.address) {
        errors.push('Delivery address is required');
      }
      if (!state.deliveryInfo.phoneNumber) {
        errors.push('Phone number is required');
      }
    }
    
    // Check for unavailable items
    const unavailableItems = state.items.filter(item => !item.available);
    if (unavailableItems.length > 0) {
      errors.push(`Some items are no longer available: ${unavailableItems.map(item => item.name).join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const contextValue = {
    // State
    items: state.items,
    deliveryInfo: state.deliveryInfo,
    loading: state.loading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    
    // Calculations
    getCartTotal,
    getCartCount,
    getDeliveryFee,
    getTotalWithDelivery,
    
    // Order functions
    createOrder,
    createGroupOrder,
    validateCart,
    
    // Utility
    isEmpty: state.items.length === 0,
    hasItems: state.items.length > 0
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
