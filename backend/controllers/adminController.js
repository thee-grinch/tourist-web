const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// Approve a booking
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'Approved';
    await booking.save();
    res.status(200).json({ message: 'Booking approved', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve booking' });
  }
};

// Reject a booking
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'Rejected';
    await booking.save();
    res.status(200).json({ message: 'Booking rejected', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject booking' });
  }
};

// Add available dates to a destination
const addAvailableDates = async (req, res) => {
  try {
    const { dates } = req.body;
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    destination.availableDates.push(...dates);
    await destination.save();
    res.status(200).json({ message: 'Available dates added', destination });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add available dates' });
  }
};

// Remove available dates from a destination
const removeAvailableDates = async (req, res) => {
  try {
    const { dates } = req.body;
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    destination.availableDates = destination.availableDates.filter(
      (date) => !dates.includes(date.toISOString())
    );
    await destination.save();
    res.status(200).json({ message: 'Available dates removed', destination });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove available dates' });
  }
};

module.exports = { approveBooking, rejectBooking, addAvailableDates, removeAvailableDates };