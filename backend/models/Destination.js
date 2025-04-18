const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pictures: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDates: {
      type: [Date],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);