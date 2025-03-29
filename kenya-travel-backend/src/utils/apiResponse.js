module.exports = {
    successResponse: (res, data, message = 'Request was successful') => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },

    createdResponse: (res, data, message = 'Resource created successfully') => {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    },

    errorResponse: (res, error, message = 'An error occurred') => {
        return res.status(500).json({
            success: false,
            message,
            error: error.message || error
        });
    },

    notFoundResponse: (res, message = 'Resource not found') => {
        return res.status(404).json({
            success: false,
            message
        });
    },

    validationErrorResponse: (res, errors, message = 'Validation error') => {
        return res.status(400).json({
            success: false,
            message,
            errors
        });
    }
};