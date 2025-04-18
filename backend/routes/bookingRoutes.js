const { getCurrentBookings, getPastBookings } = require('../controllers/bookingController');

// User: View bookings
router.get('/current', protect, getCurrentBookings);
router.get('/past', protect, getPastBookings);