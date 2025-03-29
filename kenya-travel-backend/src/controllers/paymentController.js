const Payment = require('../models/Payment');
const mpesaService = require('../services/mpesaService');
const stripeService = require('../services/stripeService');
const apiResponse = require('../utils/apiResponse');

// Process M-Pesa payment
exports.processMpesaPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        const response = await mpesaService.initiatePayment(paymentData);
        
        // Save payment record to the database
        const payment = new Payment({
            userId: req.user.id,
            amount: paymentData.amount,
            paymentMethod: 'M-Pesa',
            status: response.status,
            transactionId: response.transactionId,
        });
        await payment.save();

        return apiResponse.success(res, 'Payment processed successfully', response);
    } catch (error) {
        return apiResponse.error(res, 'Payment processing failed', error);
    }
};

// Process Stripe payment
exports.processStripePayment = async (req, res) => {
    try {
        const paymentData = req.body;
        const response = await stripeService.processPayment(paymentData);
        
        // Save payment record to the database
        const payment = new Payment({
            userId: req.user.id,
            amount: paymentData.amount,
            paymentMethod: 'Stripe',
            status: response.status,
            transactionId: response.id,
        });
        await payment.save();

        return apiResponse.success(res, 'Payment processed successfully', response);
    } catch (error) {
        return apiResponse.error(res, 'Payment processing failed', error);
    }
};