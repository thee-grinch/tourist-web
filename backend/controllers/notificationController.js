const Notification = require('../models/Notification');

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Create a notification (Admin)
const createNotification = async (req, res) => {
  try {
    const { user, message, type } = req.body;
    const notification = await Notification.create({ user, message, type });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

module.exports = { getNotifications, markAsRead, createNotification };