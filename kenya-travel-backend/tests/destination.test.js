const request = require('supertest');
const { app, createTestAdmin, createTestUser, createTestDestination, generateToken } = require('./setup');

describe('Destination Endpoints', () => {
  describe('GET /api/destinations', () => {
    it('should get all destinations', async () => {
      await createTestDestination();
      await createTestDestination(); // Create a second one
      
      const res = await request(app).get('/api/destinations');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toEqual(2);
    });

    it('should filter destinations by price range', async () => {
      const destination1 = await createTestDestination();
      
      // Create a more expensive destination
      const Destination = require('../src/models/Destination');
      await Destination.create({
        ...destination1.toObject(),
        _id: undefined,
        name: 'Expensive Destination',
        price: 499.99
      });
      
      const res = await request(app).get('/api/destinations?minPrice=300&maxPrice=500');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0].name).toEqual('Expensive Destination');
    });
  });

  describe('GET /api/destinations/:id', () => {
    it('should get a destination by id', async () => {
      const destination = await createTestDestination();
      
      const res = await request(app).get(`/api/destinations/${destination._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('name', 'Maasai Mara National Reserve');
    });

    it('should return 404 for non-existent destination', async () => {
      const res = await request(app).get('/api/destinations/5f8d0e113aad6d001751771a');
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Admin Destination Management', () => {
    describe('POST /api/admin/destinations', () => {
      it('should create a destination when admin is authenticated', async () => {
        const admin = await createTestAdmin();
        const token = generateToken(admin._id);
        
        const res = await request(app)
          .post('/api/admin/destinations')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Lake Nakuru National Park',
            description: 'Famous for its flamingos and other bird species.',
            location: {
              address: 'Nakuru County, Kenya',
              coordinates: [-0.3136, 36.0800]
            },
            price: 149.99,
            images: ['lake-nakuru-1.jpg'],
            featured: false,
            duration: '2 days',
            maxGroupSize: 10,
            difficulty: 'easy'
          });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('name', 'Lake Nakuru National Park');
      });

      it('should not allow regular users to create destinations', async () => {
        const user = await createTestUser();
        const token = generateToken(user._id);
        
        const res = await request(app)
          .post('/api/admin/destinations')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Lake Nakuru National Park',
            description: 'Test description',
            price: 149.99
          });
        
        expect(res.statusCode).toEqual(403);
      });
    });

    describe('PUT /api/admin/destinations/:id', () => {
      it('should update a destination when admin is authenticated', async () => {
        const admin = await createTestAdmin();
        const token = generateToken(admin._id);
        const destination = await createTestDestination();
        
        const res = await request(app)
          .put(`/api/admin/destinations/${destination._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Updated Maasai Mara',
            price: 249.99
          });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('name', 'Updated Maasai Mara');
        expect(res.body.data).toHaveProperty('price', 249.99);
      });
    });

    describe('DELETE /api/admin/destinations/:id', () => {
      it('should delete a destination when admin is authenticated', async () => {
        const admin = await createTestAdmin();
        const token = generateToken(admin._id);
        const destination = await createTestDestination();
        
        const res = await request(app)
          .delete(`/api/admin/destinations/${destination._id}`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        
        // Verify it's deleted
        const getRes = await request(app).get(`/api/destinations/${destination._id}`);
        expect(getRes.statusCode).toEqual(404);
      });
    });
  });
});