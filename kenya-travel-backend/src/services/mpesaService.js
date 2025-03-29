const axios = require('axios');
const { M-PESA_API_URL, M-PESA_CONSUMER_KEY, M-PESA_CONSUMER_SECRET, M-PESA_SHORTCODE, M-PESA_LIVE_URL } = require('../config/mpesa');

const getAccessToken = async () => {
    const auth = Buffer.from(`${M-PESA_CONSUMER_KEY}:${M-PESA_CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(`${M-PESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${auth}`
        }
    });
    return response.data.access_token;
};

const lipaNaMpesaOnline = async (amount, phoneNumber, callbackUrl) => {
    const accessToken = await getAccessToken();
    const payload = {
        BusinessShortCode: M-PESA_SHORTCODE,
        Password: Buffer.from(`${M-PESA_SHORTCODE}${LIPA_NA_MPESA_SHORTCODE}${new Date().toISOString().slice(0, 19).replace('T', '')}`).toString('base64'),
        Timestamp: new Date().toISOString().slice(0, 19).replace('T', ''),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: M-PESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: 'TravelBooking',
        TransactionDesc: 'Payment for travel booking'
    };

    const response = await axios.post(`${M-PESA_LIVE_URL}/payment/request`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
};

module.exports = {
    lipaNaMpesaOnline
};