const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateUserLogin = [
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

const validateDestination = [
    body('name')
        .notEmpty().withMessage('Destination name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    body('location')
        .notEmpty().withMessage('Location is required'),
];

const validateBooking = [
    body('destinationId')
        .notEmpty().withMessage('Destination ID is required'),
    body('userId')
        .notEmpty().withMessage('User ID is required'),
    body('dates')
        .isArray().withMessage('Dates must be an array'),
];

const validateReview = [
    body('destinationId')
        .notEmpty().withMessage('Destination ID is required'),
    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .optional()
        .isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'),
];

const validatePost = [
    body('title')
        .notEmpty().withMessage('Title is required'),
    body('content')
        .notEmpty().withMessage('Content is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateDestination,
    validateBooking,
    validateReview,
    validatePost,
    validate,
};