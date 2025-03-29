const request = require('supertest');
const { app, createTestUser, createTestAdmin, createTestDestination, generateToken } = require('./setup');

describe('Booking Endpoints', () => {
  describe('POST /api/bookings', () => {
    it('should create a booking for an authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      const bookingData = {
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        specialRequests: 'Vegetarian meals, please.'
      };
      
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('destination');
      expect(res.body.data).toHaveProperty('status', 'pending');
      expect(res.body.data).toHaveProperty('user');
    });

    it('should not create a booking without authentication', async () => {
      const destination = await createTestDestination();
      
      const bookingData = {
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2
      };
      
      const res = await request(app)
        .post('/api/bookings')
        .send(bookingData);
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/bookings', () => {
    it('should get all bookings for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toEqual(1);
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should get a specific booking for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('destination');
      expect(res.body.data).toHaveProperty('status', 'pending');
    });

    it('should not allow accessing other users bookings', async () => {
      const user1 = await createTestUser();
      const user2 = await User.create({
        name: 'Another User',
        email: 'another@test.com',
        password: 'password123'
      });
      
      const token2 = generateToken(user2._id);
      const destination = await createTestDestination();
      
      // Create booking for user1
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user1._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      // Try to access with user2
      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token2}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should cancel a booking for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .delete(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Verify status is updated to cancelled
      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking.status).toEqual('cancelled');
    });
  });
  
  describe('Admin Booking Management', () => {
    it('should allow admin to get all bookings', async () => {
      const admin = await createTestAdmin();
      const token = generateToken(admin._id);
      const user = await createTestUser();
      const destination = await createTestDestination();
      
      // Create bookings
      const Booking = require('../src/models/Booking');
      await Booking.create([
        {
          user: user._id,
          destination: destination._id,
          startDate: '2025-04-15T00:00:00.000Z',
          endDate: '2025-04-18T00:00:00.000Z',
          numberOfPeople: 2,
          amount: destination.price * 2,
          status: 'pending'
        },
        {
          user: user._id,
          destination: destination._id,
          startDate: '2025-05-20T00:00:00.000Z',
          endDate: '2025-05-23T00:00:00.000Z',
          numberOfPeople: 1,
          amount: destination.price,
          status: 'confirmed'
        }
      ]);
      
      const res = await request(app)
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toEqual(2);
    });
    
    it('should allow admin to update booking status', async () => {
      const admin = await createTestAdmin();
      const token = generateToken(admin._id);
      const user = await createTestUser();
      const destination = await createTestDestination();
      
      // Create booking// filepath: /workspaces/tourist-web/kenya-travel-backend/tests/booking.test.js
const request = require('supertest');
const { app, createTestUser, createTestAdmin, createTestDestination, generateToken } = require('./setup');

describe('Booking Endpoints', () => {
  describe('POST /api/bookings', () => {
    it('should create a booking for an authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      const bookingData = {
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        specialRequests: 'Vegetarian meals, please.'
      };
      
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('destination');
      expect(res.body.data).toHaveProperty('status', 'pending');
      expect(res.body.data).toHaveProperty('user');
    });

    it('should not create a booking without authentication', async () => {
      const destination = await createTestDestination();
      
      const bookingData = {
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2
      };
      
      const res = await request(app)
        .post('/api/bookings')
        .send(bookingData);
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/bookings', () => {
    it('should get all bookings for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toEqual(1);
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should get a specific booking for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('destination');
      expect(res.body.data).toHaveProperty('status', 'pending');
    });

    it('should not allow accessing other users bookings', async () => {
      const user1 = await createTestUser();
      const user2 = await User.create({
        name: 'Another User',
        email: 'another@test.com',
        password: 'password123'
      });
      
      const token2 = generateToken(user2._id);
      const destination = await createTestDestination();
      
      // Create booking for user1
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user1._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      // Try to access with user2
      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token2}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should cancel a booking for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id);
      const destination = await createTestDestination();
      
      // Create booking in database directly
      const Booking = require('../src/models/Booking');
      const booking = await Booking.create({
        user: user._id,
        destination: destination._id,
        startDate: '2025-04-15T00:00:00.000Z',
        endDate: '2025-04-18T00:00:00.000Z',
        numberOfPeople: 2,
        amount: destination.price * 2,
        status: 'pending'
      });
      
      const res = await request(app)
        .delete(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Verify status is updated to cancelled
      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking.status).toEqual('cancelled');
    });
  });
  
  describe('Admin Booking Management', () => {
    it('should allow admin to get all bookings', async () => {
      const admin = await createTestAdmin();
      const token = generateToken(admin._id);
      const user = await createTestUser();
      const destination = await createTestDestination();
      
      // Create bookings
      const Booking = require('../src/models/Booking');
      await Booking.create([
        {
          user: user._id,
          destination: destination._id,
          startDate: '2025-04-15T00:00:00.000Z',
          endDate: '2025-04-18T00:00:00.000Z',
          numberOfPeople: 2,
          amount: destination.price * 2,
          status: 'pending'
        },
        {
          user: user._id,
          destination: destination._id,
          startDate: '2025-05-20T00:00:00.000Z',
          endDate: '2025-05-23T00:00:00.000Z',
          numberOfPeople: 1,
          amount: destination.price,
          status: 'confirmed'
        }
      ]);
      
      const res = await request(app)
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toEqual(2);
    });
    
    it('should allow admin to update booking status', async () => {
      const admin = await createTestAdmin();
      const token = generateToken(admin._id);
      const user = await createTestUser();
      const destination = await createTestDestination();
      
      // Create booking