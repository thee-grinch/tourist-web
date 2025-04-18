const express = require('express');
const { submitInquiry } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, submitInquiry);

module.exports = router;