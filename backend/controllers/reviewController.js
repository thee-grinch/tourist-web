const Review = require('../models/Review');
const Destination = require('../models/Destination');

// Add a review
const addReview = async (req, res) => {
  const { destinationId, rating, comment } = req.body;
  try {
    const review = await Review.create({
      user: req.user.id,
      destination: destinationId,
      rating,
      comment,
    });
    const destination = await Destination.findById(destinationId);
    destination.reviews.push(review._id);
    destination.rating =
      (destination.rating * (destination.reviews.length - 1) + rating) / destination.reviews.length;
    await destination.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review' });
  }
};

module.exports = { addReview };