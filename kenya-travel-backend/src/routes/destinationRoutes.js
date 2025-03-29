const express = require('express');
const { 
    getAllDestinations, 
    getDestinationById, 
    createDestination, 
    updateDestination, 
    deleteDestination 
} = require('../controllers/destinationController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

// Admin routes
router.post('/', authenticate, authorize('Admin'), createDestination);
router.put('/:id', authenticate, authorize('Admin'), updateDestination);
router.delete('/:id', authenticate, authorize('Admin'), deleteDestination);

module.exports = router;