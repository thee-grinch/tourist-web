const express = require('express');
const { processMpesaPayment, processStripePayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// M-Pesa Payment Route
router.post('/mpesa', authenticate, processMpesaPayment);

// Stripe Payment Route
router.post('/stripe', authenticate, processStripePayment);

module.exports = router;