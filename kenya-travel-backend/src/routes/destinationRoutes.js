const express = require('express');
const { 
    getAllDestinations, 
    getDestinationById, 
    createDestination, 
    updateDestination, 
    deleteDestination 
} = require('../controllers/destinationController');
const { authenticate, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

// Admin routes
router.post('/', authenticate, adminMiddleware, createDestination);
router.put('/:id', authenticate, adminMiddleware, updateDestination);
router.delete('/:id', authenticate, adminMiddleware, deleteDestination);

module.exports = router;