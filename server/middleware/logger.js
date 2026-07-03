// server/middleware/logger.js
// Simple request logger middleware for development

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;

    // Log when response finishes to capture status code
    res.on('finish', () => {
        const statusCode = res.statusCode;
        const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
        const reset = '\x1b[0m';

        console.log(
            `[${timestamp}] ${method} ${url} ${statusColor}${statusCode}${reset}`
        );
    });

    next();
};

module.exports = logger;
