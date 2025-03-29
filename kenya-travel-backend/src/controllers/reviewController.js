const Review = require('../models/Review');
const apiResponse = require('../utils/apiResponse');

// Add a review for a destination
exports.addReview = async (req, res) => {
    try {
        const { destinationId, rating, comment } = req.body;
        const review = new Review({
            user: req.user.id,
            destination: destinationId,
            rating,
            comment
        });
        await review.save();
        return apiResponse.success(res, 'Review added successfully', review);
    } catch (error) {
        return apiResponse.error(res, 'Error adding review', error);
    }
};

// Get all reviews for a destination
exports.getReviewsByDestination = async (req, res) => {
    try {
        const reviews = await Review.find({ destination: req.params.destinationId }).populate('user', 'username');
        return apiResponse.success(res, 'Reviews retrieved successfully', reviews);
    } catch (error) {
        return apiResponse.error(res, 'Error retrieving reviews', error);
    }
};

// Delete a review (Admin only)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return apiResponse.error(res, 'Review not found');
        }
        await review.remove();
        return apiResponse.success(res, 'Review deleted successfully');
    } catch (error) {
        return apiResponse.error(res, 'Error deleting review', error);
    }
};