const express = require('express');
const { 
    addReview, 
    getReviewsByDestination, 
    deleteReview 
} = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Add a review for a destination
router.post('/:destinationId', authenticate, addReview);

// Get all reviews for a specific destination
router.get('/:destinationId', getReviewsByDestination);

// Delete a review (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), deleteReview);

module.exports = router;