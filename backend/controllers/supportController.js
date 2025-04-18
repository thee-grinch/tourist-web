const SupportInquiry = require('../models/SupportInquiry');

// Submit an inquiry
const submitInquiry = async (req, res) => {
  const { subject, message } = req.body;
  try {
    const inquiry = await SupportInquiry.create({
      user: req.user.id,
      subject,
      message,
    });
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit inquiry' });
  }
};

module.exports = { submitInquiry };