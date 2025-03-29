const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Destination = require('../src/models/Destination');
const Booking = require('../src/models/Booking');
const Post = require('../src/models/Post');
const Review = require('../src/models/Review');

let mongoServer;

// Connect to in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect and stop mongodb server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Create a test user with admin privileges
const createTestAdmin = async () => {
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });
  
  return adminUser;
};

// Create a regular test user
const createTestUser = async () => {
  const regularUser = await User.create({
    name: 'Regular User',
    email: 'user@test.com',
    password: 'password123',
    role: 'user'
  });
  
  return regularUser;
};

// Create a test destination
const createTestDestination = async () => {
  const destination = await Destination.create({
    name: 'Maasai Mara National Reserve',
    description: 'Famous for its exceptional population of lions, leopards and cheetahs, and the annual migration of zebra, thomson's gazelle, and wildebeest.',
    location: {
      address: 'Narok County, Kenya',
      coordinates: [
        -1.5005922,
        35.1433854
      ]
    },
    price: 199.99,
    images: [
      'maasai-mara-1.jpg',
      'maasai-mara-2.jpg'
    ],
    featured: true,
    duration: '3 days',
    maxGroupSize: 15,
    difficulty: 'medium',
    ratingsAverage: 4.7,
    ratingsQuantity: 23
  });
  
  return destination;
};

// Generate JWT token for testing auth routes
const generateToken = (userId) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: userId }, 'test-secret-key', { expiresIn: '1h' });
};

module.exports = {
  app,
  createTestUser,
  createTestAdmin,
  createTestDestination,
  generateToken
};