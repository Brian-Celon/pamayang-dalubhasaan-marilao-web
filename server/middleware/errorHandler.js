// server/middleware/errorHandler.js
// Centralized error handling middleware

const path = require('path');

// 404 - Not Found handler
const notFound = (req, res, next) => {
    res.status(404).sendFile(
        path.join(__dirname, '..', '..', 'public', 'index.html')
    );
};

// General error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message;

    console.error(`[ERROR] ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode,
        },
    });
};

module.exports = { notFound, errorHandler };
