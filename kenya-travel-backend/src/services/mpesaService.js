const axios = require('axios');
const { Mpesa_API_URL, Mpesa_CONSUMER_KEY, Mpesa_CONSUMER_SECRET, Mpesa_SHORTCODE, Mpesa_LIVE_URL } = require('../config/mpesa');

const getAccessToken = async () => {
    const auth = Buffer.from(`${Mpesa_CONSUMER_KEY}:${Mpesa_CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(`${Mpesa_API_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${auth}`
        }
    });
    return response.data.access_token;
};

const lipaNaMpesaOnline = async (amount, phoneNumber, callbackUrl) => {
    const accessToken = await getAccessToken();
    const payload = {
        BusinessShortCode: Mpesa_SHORTCODE,
        Password: Buffer.from(`${Mpesa_SHORTCODE}${LIPA_NA_MPESA_SHORTCODE}${new Date().toISOString().slice(0, 19).replace('T', '')}`).toString('base64'),
        Timestamp: new Date().toISOString().slice(0, 19).replace('T', ''),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: Mpesa_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: 'TravelBooking',
        TransactionDesc: 'Payment for travel booking'
    };

    const response = await axios.post(`${Mpesa_LIVE_URL}/payment/request`, payload, {
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