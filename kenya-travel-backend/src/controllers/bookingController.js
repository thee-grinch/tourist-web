const Booking = require('../models/Booking');
const User = require('../models/User');
const Destination = require('../models/Destination');
const apiResponse = require('../utils/apiResponse');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { userId, destinationId, bookingDate, numberOfPeople } = req.body;

        const user = await User.findById(userId);
        const destination = await Destination.findById(destinationId);

        if (!user || !destination) {
            return apiResponse.notFound(res, 'User or Destination not found');
        }

        const newBooking = new Booking({
            user: userId,
            destination: destinationId,
            bookingDate,
            numberOfPeople,
        });

        await newBooking.save();
        return apiResponse.success(res, 'Booking created successfully', newBooking);
    } catch (error) {
        return apiResponse.error(res, error.message);
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('destination');
        return apiResponse.success(res, 'Bookings retrieved successfully', bookings);
    } catch (error) {
        return apiResponse.error(res, error.message);
    }
};

// Get booking details by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('destination');
        if (!booking) {
            return apiResponse.notFound(res, 'Booking not found');
        }
        return apiResponse.success(res, 'Booking retrieved successfully', booking);
    } catch (error) {
        return apiResponse.error(res, error.message);
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return apiResponse.notFound(res, 'Booking not found');
        }
        return apiResponse.success(res, 'Booking canceled successfully', booking);
    } catch (error) {
        return apiResponse.error(res, error.message);
    }
};