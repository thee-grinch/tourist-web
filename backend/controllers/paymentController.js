const Transaction = require('../models/Transaction');
const { initiatePayment } = require('../utils/mpesa');

// Initiate payment
const createPayment = async (req, res) => {
  const { phone, amount, bookingId } = req.body;
  try {
    const paymentResponse = await initiatePayment(phone, amount, bookingId);
    const transaction = await Transaction.create({
      user: req.user.id,
      booking: bookingId,
      amount,
      mpesaReceipt: paymentResponse.CheckoutRequestID,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

// Handle M-Pesa callback
const handleCallback = async (req, res) => {
  const { Body } = req.body;
  const { CheckoutRequestID, ResultCode } = Body.stkCallback;
  try {
    const transaction = await Transaction.findOne({ mpesaReceipt: CheckoutRequestID });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.status = ResultCode === 0 ? 'Completed' : 'Failed';
    await transaction.save();
    res.status(200).json({ message: 'Callback handled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to handle callback' });
  }
};

module.exports = { createPayment, handleCallback };