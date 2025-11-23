// Database Services - Food Management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ===== RESTAURANTS =====
export const restaurantService = {
  // Get all restaurants
  getAll: async () => {
    const querySnapshot = await getDocs(
      query(collection(db, 'restaurants'), where('isActive', '==', true))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get restaurant by ID
  getById: async (id) => {
    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Add new restaurant
  add: async (restaurantData) => {
    const docRef = await addDoc(collection(db, 'restaurants'), {
      ...restaurantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update restaurant
  update: async (id, updateData) => {
    const docRef = doc(db, 'restaurants', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  }
};

// ===== FOOD ITEMS =====
export const foodService = {
  // Get all food items
  getAll: async () => {
    const querySnapshot = await getDocs(
      query(collection(db, 'foods'), where('isAvailable', '==', true))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get foods by restaurant
  getByRestaurant: async (restaurantId) => {
    const q = query(
      collection(db, 'foods'),
      where('restaurantId', '==', restaurantId),
      where('isAvailable', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get foods by category
  getByCategory: async (category) => {
    const q = query(
      collection(db, 'foods'),
      where('category', '==', category),
      where('isAvailable', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Search foods
  search: async (searchTerm) => {
    // Note: For better search, consider using Algolia or implement full-text search
    const q = query(collection(db, 'foods'), where('isAvailable', '==', true));
    const querySnapshot = await getDocs(q);
    const allFoods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return allFoods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Add new food item
  add: async (foodData) => {
    const docRef = await addDoc(collection(db, 'foods'), {
      ...foodData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }
};

// ===== ORDERS =====
export const orderService = {
  // Create new order
  create: async (orderData) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get user orders
  getUserOrders: async (userId) => {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
  },

  // Listen to order updates (real-time)
  listenToOrder: (orderId, callback) => {
    const docRef = doc(db, 'orders', orderId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  }
};

// ===== GROUP DELIVERIES =====
export const groupDeliveryService = {
  // Get available group deliveries
  getAvailable: async (location) => {
    const q = query(
      collection(db, 'groupDeliveries'),
      where('status', '==', 'open'),
      where('targetLocation.campus', '==', location.campus),
      where('closesAt', '>', new Date()),
      orderBy('closesAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Create group delivery
  create: async (groupData) => {
    const docRef = await addDoc(collection(db, 'groupDeliveries'), {
      ...groupData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Join group delivery
  join: async (groupId, userId, orderId, contribution) => {
    const groupRef = doc(db, 'groupDeliveries', groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const updatedParticipants = [...groupData.participants, {
        userId,
        orderId,
        contribution,
        joinedAt: serverTimestamp()
      }];

      await updateDoc(groupRef, {
        participants: updatedParticipants,
        updatedAt: serverTimestamp()
      });
    }
  },

  // Listen to group delivery updates
  listenToGroup: (groupId, callback) => {
    const docRef = doc(db, 'groupDeliveries', groupId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  }
};

// ===== USER PROFILES =====
export const userService = {
  // Create user profile
  create: async (uid, userData) => {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // Get user profile
  get: async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update user profile
  update: async (uid, updateData) => {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  },

  // Add to favorites
  addFavorite: async (uid, foodId) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      if (!favorites.includes(foodId)) {
        await updateDoc(userRef, {
          favorites: [...favorites, foodId],
          updatedAt: serverTimestamp()
        });
      }
    }
  },

  // Remove from favorites
  removeFavorite: async (uid, foodId) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      await updateDoc(userRef, {
        favorites: favorites.filter(id => id !== foodId),
        updatedAt: serverTimestamp()
      });
    }
  }
};

// ===== REVIEWS =====
export const reviewService = {
  // Add review
  add: async (reviewData) => {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
      helpfulVotes: 0
    });
    return docRef.id;
  },

  // Get reviews for restaurant/food
  getByRestaurant: async (restaurantId) => {
    const q = query(
      collection(db, 'reviews'),
      where('restaurantId', '==', restaurantId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
