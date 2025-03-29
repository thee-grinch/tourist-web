const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Destination = require('../src/models/Destination');
const Booking = require('../src/models/Booking');
const Post = require('../src/models/Post');

let adminToken;
let userToken;
let testDestinationId;
let testBookingId;
let testPostId;

beforeAll(async () => {
  // Connect to the in-memory MongoDB
  const mongoUri = 'mongodb://127.0.0.1:27017/kenya-travel-test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create test admin and user accounts
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const user = await User.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  });

  // Generate tokens for admin and user
  adminToken = `Bearer ${admin.generateAuthToken()}`;
  userToken = `Bearer ${user.generateAuthToken()}`;
});

afterAll(async () => {
  // Clean up the database and close the connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.email).toBe('testuser@example.com');
  });

  it('should log in a user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should get the logged-in user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe('user@example.com');
  });
});

describe('Destination Endpoints', () => {
  it('should create a new destination (admin only)', async () => {
    const res = await request(app)
      .post('/api/admin/destinations')
      .set('Authorization', adminToken)
      .send({
        name: 'Nairobi National Park',
        description: 'A beautiful park in Nairobi.',
        price: 100,
        images: ['image1.jpg', 'image2.jpg']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Nairobi National Park');
    testDestinationId = res.body.data._id;
  });

  it('should get all destinations', async () => {
    const res = await request(app).get('/api/destinations');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a single destination by ID', async () => {
    const res = await request(app).get(`/api/destinations/${testDestinationId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Nairobi National Park');
  });
});

describe('Booking Endpoints', () => {
  it('should create a new booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', userToken)
      .send({
        destination: testDestinationId,
        amount: 100
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.amount).toBe(100);
    testBookingId = res.body.data._id;
  });

  it('should get all bookings for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a single booking by ID', async () => {
    const res = await request(app)
      .get(`/api/bookings/${testBookingId}`)
      .set('Authorization', userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(testBookingId);
  });
});

describe('CMS Endpoints', () => {
  it('should create a new blog post (admin only)', async () => {
    const res = await request(app)
      .post('/api/admin/cms/posts')
      .set('Authorization', adminToken)
      .send({
        title: 'Top 10 Destinations in Kenya',
        content: 'Here are the top 10 destinations to visit in Kenya.',
        images: ['image1.jpg', 'image2.jpg']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Top 10 Destinations in Kenya');
    testPostId = res.body.data._id;
  });

  it('should get all blog posts', async () => {
    const res = await request(app).get('/api/cms/posts');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a single blog post by ID', async () => {
    const res = await request(app).get(`/api/cms/posts/${testPostId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Top 10 Destinations in Kenya');
  });
});

describe('Admin Endpoints', () => {
  it('should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should delete a user (admin only)', async () => {
    const user = await User.create({
      name: 'Delete Me',
      email: 'deleteme@example.com',
      password: 'password123',
      role: 'user'
    });

    const res = await request(app)
      .delete(`/api/admin/users/${user._id}`)
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});