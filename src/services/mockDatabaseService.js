// Mock Database Service for Testing (before Firebase setup)
// This provides the same API as the real database service but uses local data

// Sample data for testing
const mockRestaurants = [
  {
    id: 'rest1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizza and pasta',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 3.99,
    minimumOrder: 15,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    isActive: true
  },
  {
    id: 'rest2', 
    name: 'Burger Bistro',
    description: 'Gourmet burgers and crispy fries',
    cuisine: 'American',
    rating: 4.3,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minimumOrder: 12,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
    isActive: true
  },
  {
    id: 'rest3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and Japanese cuisine',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 4.99,
    minimumOrder: 20,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
    isActive: true
  }
];

const mockFoods = [
  {
    id: 'food1',
    restaurantId: 'rest1',
    name: 'Margherita Pizza',
    description: 'Fresh tomato sauce, mozzarella, and basil',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
    available: true,
    preparationTime: 15
  },
  {
    id: 'food2',
    restaurantId: 'rest1',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella cheese',
    price: 16.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
    available: true,
    preparationTime: 15
  },
  {
    id: 'food3',
    restaurantId: 'rest2',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheese, lettuce, tomato, and onion',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    available: true,
    preparationTime: 12
  },
  {
    id: 'food4',
    restaurantId: 'rest2',
    name: 'Crispy Fries',
    description: 'Golden crispy french fries with sea salt',
    price: 4.99,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
    available: true,
    preparationTime: 8
  },
  {
    id: 'food5',
    restaurantId: 'rest3',
    name: 'Salmon Roll',
    description: 'Fresh salmon with avocado and cucumber',
    price: 8.99,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
    available: true,
    preparationTime: 10
  },
  {
    id: 'food6',
    restaurantId: 'rest3',
    name: 'Vegetable Tempura',
    description: 'Crispy battered and fried seasonal vegetables',
    price: 7.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    available: true,
    preparationTime: 12
  }
];

// Simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Food Service
export const foodService = {
  async getAll() {
    await delay(500); // Simulate network delay
    return mockFoods;
  },

  async getById(id) {
    await delay(300);
    return mockFoods.find(food => food.id === id);
  },

  async getByRestaurant(restaurantId) {
    await delay(400);
    return mockFoods.filter(food => food.restaurantId === restaurantId);
  },

  async getByCategory(category) {
    await delay(400);
    return mockFoods.filter(food => food.category === category);
  },

  async search(searchTerm) {
    await delay(600);
    const term = searchTerm.toLowerCase();
    return mockFoods.filter(food => 
      food.name.toLowerCase().includes(term) ||
      food.description.toLowerCase().includes(term) ||
      food.category.toLowerCase().includes(term)
    );
  },

  async create(foodData) {
    await delay(500);
    const newFood = {
      id: `food_${Date.now()}`,
      ...foodData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockFoods.push(newFood);
    return newFood.id;
  }
};

// Mock Restaurant Service
export const restaurantService = {
  async getAll() {
    await delay(500);
    return mockRestaurants;
  },

  async getById(id) {
    await delay(300);
    return mockRestaurants.find(restaurant => restaurant.id === id);
  },

  async search(searchTerm) {
    await delay(600);
    const term = searchTerm.toLowerCase();
    return mockRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(term) ||
      restaurant.cuisine.toLowerCase().includes(term) ||
      restaurant.description.toLowerCase().includes(term)
    );
  }
};

// Mock Order Service
let mockOrders = [];
let orderIdCounter = 1;

export const orderService = {
  async create(orderData) {
    await delay(800);
    const newOrder = {
      id: `order_${orderIdCounter++}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes
    };
    mockOrders.push(newOrder);
    return newOrder.id;
  },

  async getUserOrders(userId) {
    await delay(600);
    return mockOrders.filter(order => order.userId === userId);
  },

  async getById(id) {
    await delay(300);
    return mockOrders.find(order => order.id === id);
  },

  async updateStatus(id, status) {
    await delay(400);
    const order = mockOrders.find(order => order.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
    return order;
  },

  // Mock real-time listener
  listenToOrder(orderId, callback) {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      callback(order);
    }
    
    // Return unsubscribe function
    return () => {};
  }
};

// Mock Group Delivery Service
let mockGroupDeliveries = [];
let groupIdCounter = 1;

export const groupDeliveryService = {
  async create(groupData) {
    await delay(600);
    const newGroup = {
      id: `group_${groupIdCounter++}`,
      ...groupData,
      participants: [],
      isActive: true,
      createdAt: new Date()
    };
    mockGroupDeliveries.push(newGroup);
    return newGroup.id;
  },

  async getAvailable(location) {
    await delay(500);
    return mockGroupDeliveries.filter(group => 
      group.location === location && 
      group.isActive && 
      group.scheduledTime > new Date()
    );
  },

  async join(groupId, userId, orderId, contribution) {
    await delay(400);
    const group = mockGroupDeliveries.find(g => g.id === groupId);
    if (group) {
      group.participants.push({
        userId,
        orderId,
        contribution,
        joinedAt: new Date()
      });
    }
    return group;
  },

  async getById(id) {
    await delay(300);
    return mockGroupDeliveries.find(group => group.id === id);
  }
};

// Mock User Service
let mockUsers = {};

export const userService = {
  async get(userId) {
    await delay(300);
    return mockUsers[userId] || { 
      id: userId, 
      favorites: [],
      profile: {},
      addresses: []
    };
  },

  async update(userId, userData) {
    await delay(500);
    mockUsers[userId] = {
      ...mockUsers[userId],
      ...userData,
      updatedAt: new Date()
    };
    return mockUsers[userId];
  },

  async addFavorite(userId, foodId) {
    await delay(300);
    const user = await this.get(userId);
    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      mockUsers[userId] = user;
    }
  },

  async removeFavorite(userId, foodId) {
    await delay(300);
    const user = await this.get(userId);
    user.favorites = user.favorites.filter(id => id !== foodId);
    mockUsers[userId] = user;
  }
};

// Mock Review Service
let mockReviews = [];
let reviewIdCounter = 1;

export const reviewService = {
  async add(reviewData) {
    await delay(600);
    const newReview = {
      id: `review_${reviewIdCounter++}`,
      ...reviewData,
      createdAt: new Date()
    };
    mockReviews.push(newReview);
    return newReview.id;
  },

  async getByRestaurant(restaurantId) {
    await delay(400);
    return mockReviews.filter(review => review.restaurantId === restaurantId);
  },

  async getByUser(userId) {
    await delay(400);
    return mockReviews.filter(review => review.userId === userId);
  }
};

// Export all services
const mockDatabaseServices = {
  foodService,
  restaurantService,
  orderService,
  groupDeliveryService,
  userService,
  reviewService
};

export default mockDatabaseServices;
