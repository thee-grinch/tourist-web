const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Post = require('../models/Post');
const logger = require('../utils/logger');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get various counts for dashboard statistics
    const userCount = await User.countDocuments();
    const destinationCount = await Destination.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const reviewCount = await Review.countDocuments();
    const postCount = await Post.countDocuments();

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('destination', 'name');

    // Get revenue statistics
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          status: 'paid',
          createdAt: { 
            $gte: new Date(`${currentYear}-01-01`), 
            $lte: new Date(`${currentYear}-12-31`) 
          } 
        } 
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format monthly revenue data for chart display
    const monthlyRevenueData = Array(12).fill(0);
    monthlyRevenue.forEach(item => {
      monthlyRevenueData[item._id - 1] = item.revenue;
    });

    res.status(200).json({
      status: 'success',
      data: {
        counts: {
          users: userCount,
          destinations: destinationCount,
          bookings: bookingCount,
          reviews: reviewCount,
          posts: postCount
        },
        recentBookings,
        revenue: {
          total: totalRevenue.length ? totalRevenue[0].total : 0,
          monthly: monthlyRevenueData
        }
      }
    });
  } catch (error) {
    logger.error(`Error getting dashboard stats: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving dashboard statistics'
    });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Add search functionality
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: users.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: users
    });
  } catch (error) {
    logger.error(`Error getting all users: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving users'
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Get user's bookings
    const bookings = await Booking.find({ user: req.params.id })
      .populate('destination', 'name images price')
      .sort({ createdAt: -1 });
    
    // Get user's reviews
    const reviews = await Review.find({ user: req.params.id })
      .populate('destination', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        bookings,
        reviews
      }
    });
  } catch (error) {
    logger.error(`Error getting user by ID: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving user'
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Find user
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Save user
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error updating user'
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot delete your own account'
      });
    }

    // Delete user
    await user.deleteOne();

    // Optionally: Delete related user data like reviews
    await Review.deleteMany({ user: req.params.id });

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user'
    });
  }
};

/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Add filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Add date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('destination', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: bookings
    });
  } catch (error) {
    logger.error(`Error getting all bookings: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving bookings'
    });
  }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/admin/bookings/:id
 * @access  Private/Admin
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'paid', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    logger.error(`Error updating booking status: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error updating booking status'
    });
  }
};

/**
 * @desc    System maintenance functions
 * @route   POST /api/admin/maintenance/:function
 * @access  Private/Admin
 */
exports.performMaintenance = async (req, res) => {
  try {
    const { function: maintenanceFunction } = req.params;
    
    switch (maintenanceFunction) {
      case 'clean-expired-bookings':
        // Clean up expired bookings older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const result = await Booking.updateMany(
          { 
            status: 'pending', 
            createdAt: { $lt: thirtyDaysAgo } 
          },
          { 
            status: 'expired' 
          }
        );
        
        return res.status(200).json({
          status: 'success',
          message: `${result.modifiedCount} expired bookings cleaned up`,
        });
        
      case 'backup-database':
        // This would typically involve more complex backup logic
        return res.status(200).json({
          status: 'success',
          message: 'Database backup initiated',
        });
        
      default:
        return res.status(400).json({
          status: 'fail',
          message: 'Unknown maintenance function'
        });
    }
  } catch (error) {
    logger.error(`Error performing maintenance: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error performing maintenance operation'
    });
  }
};

/**
 * @desc    Get system logs
 * @route   GET /api/admin/logs
 * @access  Private/Admin
 */
exports.getSystemLogs = async (req, res) => {
  try {
    // This would typically involve reading actual log files
    // For demo purposes, we're returning a mock response
    
    const mockLogs = [
      { timestamp: new Date(), level: 'info', message: 'User login successful' },
      { timestamp: new Date(), level: 'error', message: 'Payment processing failed' },
      { timestamp: new Date(), level: 'warn', message: 'Rate limit approached' }
    ];
    
    res.status(200).json({
      status: 'success',
      data: mockLogs
    });
  } catch (error) {
    logger.error(`Error retrieving system logs: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving system logs'
    });
  }
};

/**
 * @desc    Get analytics data
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Popular destinations
    const popularDestinations = await Booking.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'destinations', localField: '_id', foreignField: '_id', as: 'destination' } },
      { $unwind: '$destination' },
      { $project: { name: '$destination.name', count: 1, _id: 0 } }
    ]);

    // User registration over time
    const userRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Payment method distribution
    const paymentMethods = await Booking.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        popularDestinations,
        userRegistrations,
        paymentMethods
      }
    });
  } catch (error) {
    logger.error(`Error getting analytics: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving analytics data'
    });
  }
};

module.exports = exports;