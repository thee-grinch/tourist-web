const express = require('express');
const { 
    getAllUsers, 
    deleteUser, 
    getAllBookings 
} = require('../controllers/adminController');
const { authenticate, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// User Management
router.get('/users', authenticate, adminMiddleware, getAllUsers);
router.delete('/users/:id', authenticate, adminMiddleware, deleteUser);

// Booking Management
router.get('/bookings', authenticate, adminMiddleware, getAllBookings);

module.exports = router;