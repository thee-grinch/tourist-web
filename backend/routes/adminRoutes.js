const express = require('express');
const { approveBooking, rejectBooking, addAvailableDates, removeAvailableDates } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Approve or reject bookings
router.put('/bookings/:id/approve', protect, admin, approveBooking);
router.put('/bookings/:id/reject', protect, admin, rejectBooking);

// Manage available dates for destinations
router.put('/destinations/:id/dates/add', protect, admin, addAvailableDates);
router.put('/destinations/:id/dates/remove', protect, admin, removeAvailableDates);

module.exports = router;