// server/routes/api.js
// Handles all API endpoints

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { body } = require('express-validator');

const { submitContactForm } = require('../controllers/contactController');

// GET /api/courses
// Returns the list of academic programs
router.get('/courses', (req, res) => {
    try {
        const coursesPath = path.join(__dirname, '..', 'data', 'courses.json');
        const coursesData = fs.readFileSync(coursesPath, 'utf-8');
        const courses = JSON.parse(coursesData);
        res.json(courses);
    } catch (error) {
        console.error('Error reading courses data:', error);
        res.status(500).json({ error: 'Failed to retrieve courses data' });
    }
});

// POST /api/contact
// Submits a contact form inquiry
router.post('/contact', [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('subject').notEmpty().withMessage('Subject is required').trim().escape(),
    body('message').notEmpty().withMessage('Message is required').trim().escape()
], submitContactForm);

module.exports = router;
