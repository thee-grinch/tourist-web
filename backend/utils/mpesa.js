const axios = require('axios');

const getMpesaToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  return response.data.access_token;
};

const initiatePayment = async (phone, amount, bookingId) => {
  const token = await getMpesaToken();
  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: '174379',
      Password: Buffer.from('174379' + process.env.MPESA_PASSKEY + new Date().toISOString()).toString('base64'),
      Timestamp: new Date().toISOString(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: '174379',
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
      AccountReference: bookingId,
      TransactionDesc: 'Booking Payment',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

module.exports = { initiatePayment };