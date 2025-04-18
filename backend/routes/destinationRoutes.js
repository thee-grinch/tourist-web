const { getDestinations } = require('../controllers/destinationController');

// Get paginated and filtered destinations
router.get('/', getDestinations);