const { addToWishlist, removeFromWishlist } = require('../controllers/userController');

// Wishlist support
router.post('/wishlist/:id', protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);