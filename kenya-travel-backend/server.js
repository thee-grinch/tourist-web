
const dotenv = require('dotenv');
const logger = require('./src/utils/logger');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const destinationRoutes = require('./src/routes/destinationRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const cmsRoutes = require('./src/routes/cmsRoutes');
const connectDB  = require('./src/config/database');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cms', cmsRoutes);

// Error handling middleware
// app.use(errorHandler);

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
        logger.info(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
});