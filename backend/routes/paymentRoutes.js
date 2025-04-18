const express = require('express');
const { createPayment, handleCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createPayment);
router.post('/callback', handleCallback);

module.exports = router;