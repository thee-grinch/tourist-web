const express = require('express');
const { 
    getAllUsers, 
    deleteUser, 
    getAllBookings 
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// User Management
router.get('/users', authenticate, authorize('Admin'), getAllUsers);
router.delete('/users/:id', authenticate, authorize('Admin'), deleteUser);

// Booking Management
router.get('/bookings', authenticate, authorize('Admin'), getAllBookings);

module.exports = router;