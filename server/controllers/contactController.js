// server/controllers/contactController.js

const { validationResult } = require('express-validator');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = (req, res) => {
    // 1. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // 2. Extract validated data
    const { name, email, subject, message } = req.body;

    // 3. Simulate sending an email / saving to database
    console.log('\n--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`Name:    ${name}`);
    console.log(`Email:   ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${message}`);
    console.log('-----------------------------------\n');

    // 4. Send success response
    res.status(200).json({ 
        success: true, 
        message: 'Your message has been sent successfully. We will get back to you soon.' 
    });
};

module.exports = {
    submitContactForm
};
