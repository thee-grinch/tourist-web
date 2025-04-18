const Destination = require('../models/Destination');

// Get paginated and filtered destinations
const getDestinations = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, priceMin, priceMax } = req.query;

    const query = {};
    if (location) query.location = { $regex: location, $options: 'i' };
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const destinations = await Destination.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Destination.countDocuments(query);

    res.status(200).json({
      data: destinations,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch destinations' });
  }
};

module.exports = { getDestinations };