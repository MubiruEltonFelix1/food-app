#!/bin/bash

echo "🔥 Firebase Integration Setup Script"
echo "====================================="

# Install Firebase dependencies
echo "📦 Installing Firebase dependencies..."
npm install firebase
npm install firebase-admin --save-dev

# Install additional dependencies for enhanced functionality
echo "📦 Installing additional dependencies..."
npm install uuid
npm install date-fns
npm install react-hot-toast

# Create environment file if it doesn't exist
echo "⚙️ Setting up environment configuration..."
if [ ! -f .env ]; then
  cat > .env << EOF
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here

# Firebase Emulator Configuration (for local development)
REACT_APP_USE_FIREBASE_EMULATOR=true
REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
REACT_APP_AUTH_EMULATOR_HOST=localhost:9099
REACT_APP_STORAGE_EMULATOR_HOST=localhost:9199

# Environment
NODE_ENV=development
EOF
  echo "✅ Created .env file with Firebase configuration template"
else
  echo "ℹ️ .env file already exists"
fi

# Create Firebase configuration files
echo "🔧 Setting up Firebase configuration..."

# Create firebase.json for emulator configuration
cat > firebase.json << EOF
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
EOF

# Create Firestore security rules
cat > firestore.rules << EOF
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read restaurants and foods
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && hasRole('admin');
    }
    
    match /foods/{foodId} {
      allow read: if true;
      allow write: if request.auth != null && hasRole('admin');
    }
    
    // Users can read and write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == get(/databases/\$(database)/documents/orders/\$(orderId)).data.userId ||
         hasRole('admin'));
    }
    
    // Group deliveries are readable by all authenticated users
    match /groupDeliveries/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.creatorId;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.creatorId || 
         request.auth.uid in resource.data.participants);
    }
    
    // Reviews are readable by all, writable by order owners
    match /reviews/{reviewId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Helper function to check user roles
    function hasRole(role) {
      return request.auth != null && 
        get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data.role == role;
    }
  }
}
EOF

# Create Storage security rules
cat > storage.rules << EOF
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Food images - readable by all, writable by admins
    match /food-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && hasRole('admin');
    }
    
    // Restaurant images - readable by all, writable by admins
    match /restaurant-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && hasRole('admin');
    }
    
    // User profile images - readable by all, writable by owner
    match /user-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to check user roles
    function hasRole(role) {
      return request.auth != null && 
        firestore.get(/databases/(default)/documents/users/\$(request.auth.uid)).data.role == role;
    }
  }
}
EOF

# Create Firestore indexes
cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "foods",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "category",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "available",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "foods",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "restaurantId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "available",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "groupDeliveries",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "location",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "isActive",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "scheduledTime",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "restaurantId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

# Create sample data seeder
echo "📊 Creating sample data seeder..."
mkdir -p scripts

cat > scripts/seedData.js << EOF
// Sample Data Seeder for Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../src/services/firebase.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleRestaurants = [
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
    address: '123 Pizza Street, Food City',
    phone: '+1 (555) 123-4567',
    isActive: true,
    openHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' }
    }
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
    address: '456 Burger Ave, Food City',
    phone: '+1 (555) 234-5678',
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
    address: '789 Sushi Lane, Food City',
    phone: '+1 (555) 345-6789',
    isActive: true
  }
];

const sampleFoods = [
  // Pizza Palace items
  {
    restaurantId: 'rest1',
    name: 'Margherita Pizza',
    description: 'Fresh tomato sauce, mozzarella, and basil',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
    available: true,
    preparationTime: 15,
    spicyLevel: 0,
    isVegetarian: true,
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 36,
      fat: 10
    }
  },
  {
    restaurantId: 'rest1',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella cheese',
    price: 16.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
    available: true,
    preparationTime: 15,
    spicyLevel: 1,
    isVegetarian: false
  },
  // Burger Bistro items
  {
    restaurantId: 'rest2',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheese, lettuce, tomato, and onion',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    available: true,
    preparationTime: 12,
    spicyLevel: 0,
    isVegetarian: false
  },
  {
    restaurantId: 'rest2',
    name: 'Crispy Fries',
    description: 'Golden crispy french fries with sea salt',
    price: 4.99,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
    available: true,
    preparationTime: 8,
    spicyLevel: 0,
    isVegetarian: true
  },
  // Sushi Zen items
  {
    restaurantId: 'rest3',
    name: 'Salmon Roll',
    description: 'Fresh salmon with avocado and cucumber',
    price: 8.99,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
    available: true,
    preparationTime: 10,
    spicyLevel: 0,
    isVegetarian: false
  },
  {
    restaurantId: 'rest3',
    name: 'Vegetable Tempura',
    description: 'Crispy battered and fried seasonal vegetables',
    price: 7.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    available: true,
    preparationTime: 12,
    spicyLevel: 0,
    isVegetarian: true
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Seed restaurants
    console.log('📍 Seeding restaurants...');
    for (const restaurant of sampleRestaurants) {
      await setDoc(doc(db, 'restaurants', restaurant.id), {
        ...restaurant,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(\`✅ Added restaurant: \${restaurant.name}\`);
    }
    
    // Seed foods
    console.log('🍕 Seeding foods...');
    for (const food of sampleFoods) {
      await addDoc(collection(db, 'foods'), {
        ...food,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(\`✅ Added food: \${food.name}\`);
    }
    
    console.log('🎉 Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeder
seedData();
EOF

echo "✅ Firebase setup completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Create a Firebase project at https://console.firebase.google.com/"
echo "2. Update the .env file with your Firebase configuration"
echo "3. Install Firebase CLI: npm install -g firebase-tools"
echo "4. Login to Firebase: firebase login"
echo "5. Initialize your project: firebase init"
echo "6. Start the emulators: firebase emulators:start"
echo "7. Run the data seeder: node scripts/seedData.js"
echo ""
echo "📚 Documentation:"
echo "- Firebase Console: https://console.firebase.google.com/"
echo "- Firebase Docs: https://firebase.google.com/docs"
echo "- Emulator Suite: https://firebase.google.com/docs/emulator-suite"
