// server/app.js
// Main Express application entry point

// Load environment variables first
require('dotenv').config();

const express = require('express');
const path = require('path');

// Import middleware
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Import routes
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

// Request logger (development)
if (process.env.NODE_ENV !== 'production') {
    app.use(logger);
}

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ========== ROUTES ==========

// API routes
app.use('/api', apiRoutes);

// Page routes (clean URLs: /admissions, /courses, etc.)
app.use('/', pageRoutes);

// ========== ERROR HANDLING ==========

// 404 handler (must be after all other routes)
app.use(notFound);

// General error handler
app.use(errorHandler);

// ========== START SERVER ==========
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`  ${process.env.APP_NAME || 'PDM Web'}`);
        console.log(`  Server running on http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`========================================\n`);
    });
}

// Export for Vercel and Supertest
module.exports = app;