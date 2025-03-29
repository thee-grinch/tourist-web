const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectMiddleware } = require('../middleware/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/me',protectMiddleware , authController.getMe);

// Logout user
router.post('/logout', protectMiddleware , authController.logout);

module.exports = router;