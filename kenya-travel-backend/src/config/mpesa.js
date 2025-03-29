const axios = require('axios');
const qs = require('qs');
const { Mpesa_CONSUMER_KEY, Mpesa_CONSUMER_SECRET, Mpesa_SHORTCODE, Mpesa_LIVE_URL, Mpesa_PASSKEY, Mpesa_PAYBILL } = process.env;

const getAccessToken = async () => {
    const auth = Buffer.from(`${Mpesa_CONSUMER_KEY}:${Mpesa_CONSUMER_SECRET}`).toString('base64');
    const response = await axios({
        method: 'GET',
        url: `${Mpesa_LIVE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
};

const lipaNaMpesaOnline = async (amount, phoneNumber) => {
    const accessToken = await getAccessToken();
    const payload = {
        BusinessShortCode: Mpesa_SHORTCODE,
        Password: Buffer.from(`${Mpesa_SHORTCODE}${Mpesa_PASSKEY}${new Date().toISOString().substring(0, 19).replace('T', '')}`).toString('base64'),
        Timestamp: new Date().toISOString().substring(0, 19).replace('T', ''),
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: Mpesa_PAYBILL,
        PhoneNumber: phoneNumber,
        CallBackURL: 'https://yourcallbackurl.com/callback', // Replace with your callback URL
        AccountReference: 'TravelBooking',
        TransactionDesc: 'Payment for travel booking',
    };

    const response = await axios({
        method: 'POST',
        url: `${Mpesa_LIVE_URL}/payment/request`,
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