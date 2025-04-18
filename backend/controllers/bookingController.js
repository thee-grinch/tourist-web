const Booking = require('../models/Booking');

// Get current bookings
const getCurrentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: { $in: ['Pending', 'Approved'] },
    }).populate('destination');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch current bookings' });
  }
};

// Get past bookings
const getPastBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: { $in: ['Rejected', 'Completed'] },
    }).populate('destination');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch past bookings' });
  }
};

module.exports = { getCurrentBookings, getPastBookings };