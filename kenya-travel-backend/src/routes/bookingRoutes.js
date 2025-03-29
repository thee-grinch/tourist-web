const express = require('express');
const { createBooking, getAllBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create a new booking
router.post('/', authenticate, createBooking);

// Get all bookings for the logged-in user
router.get('/', authenticate, getAllBookings);

// Get a specific booking by ID
router.get('/:id', authenticate, getBookingById);

// Cancel a booking by ID
router.delete('/:id', authenticate, cancelBooking);

module.exports = router;