const axios = require('axios');
const qs = require('qs');
const { M-PESA_CONSUMER_KEY, M-PESA_CONSUMER_SECRET, M-PESA_SHORTCODE, M-PESA_LIVE_URL, M-PESA_PASSKEY, M-PESA_PAYBILL } = process.env;

const getAccessToken = async () => {
    const auth = Buffer.from(`${M-PESA_CONSUMER_KEY}:${M-PESA_CONSUMER_SECRET}`).toString('base64');
    const response = await axios({
        method: 'GET',
        url: `${M-PESA_LIVE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
};

const lipaNaMpesaOnline = async (amount, phoneNumber) => {
    const accessToken = await getAccessToken();
    const payload = {
        BusinessShortCode: M-PESA_SHORTCODE,
        Password: Buffer.from(`${M-PESA_SHORTCODE}${M-PESA_PASSKEY}${new Date().toISOString().substring(0, 19).replace('T', '')}`).toString('base64'),
        Timestamp: new Date().toISOString().substring(0, 19).replace('T', ''),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: M-PESA_PAYBILL,
        PhoneNumber: phoneNumber,
        CallBackURL: 'https://yourcallbackurl.com/callback', // Replace with your callback URL
        AccountReference: 'TravelBooking',
        TransactionDesc: 'Payment for travel booking',
    };

    const response = await axios({
        method: 'POST',
        url: `${M-PESA_LIVE_URL}/payment/request`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        data: payload,
    });

    return response.data;
};

module.exports = {
    getAccessToken,
    lipaNaMpesaOnline,
};