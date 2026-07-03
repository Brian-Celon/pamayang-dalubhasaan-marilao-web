// server/routes/pages.js
// Handles routing for all static HTML pages

const express = require('express');
const path = require('path');
const router = express.Router();

const publicDir = path.join(__dirname, '..', '..', 'public');

// Home / About page
router.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Academic Programs page
router.get('/courses', (req, res) => {
    res.sendFile(path.join(publicDir, 'courses.html'));
});

// Admissions & Enrollment page
router.get('/admissions', (req, res) => {
    res.sendFile(path.join(publicDir, 'admissions.html'));
});

// History page
router.get('/history', (req, res) => {
    res.sendFile(path.join(publicDir, 'history.html'));
});

// Contact page
router.get('/contact', (req, res) => {
    res.sendFile(path.join(publicDir, 'contact.html'));
});

module.exports = router;
