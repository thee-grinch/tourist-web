const User = require('../models/User');

// Add destination to wishlist
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedDestinations.includes(req.params.id)) {
      user.savedDestinations.push(req.params.id);
      await user.save();
    }
    res.status(200).json({ message: 'Destination added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// Remove destination from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedDestinations = user.savedDestinations.filter(
      (destinationId) => destinationId.toString() !== req.params.id
    );
    await user.save();
    res.status(200).json({ message: 'Destination removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};

module.exports = { addToWishlist, removeFromWishlist };