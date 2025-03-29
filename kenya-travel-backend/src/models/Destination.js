const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'Point' for GeoJSON
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a geospatial index on the location field
destinationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Destination', destinationSchema);