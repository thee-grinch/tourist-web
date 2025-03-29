const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const environment = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/kenya-travel',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    M_PESA_CONSUMER_KEY: process.env.M_PESA_CONSUMER_KEY || 'your_mpesa_consumer_key',
    M_PESA_CONSUMER_SECRET: process.env.M_PESA_CONSUMER_SECRET || 'your_mpesa_consumer_secret',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
    EMAIL_USER: process.env.EMAIL_USER || 'your_email_user',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
};

module.exports = environment;