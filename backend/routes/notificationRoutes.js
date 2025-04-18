const express = require('express');
const { getNotifications, markAsRead, createNotification } = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, admin, createNotification);

module.exports = router;