// server/app.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to serve static files (like your HTML, CSS, JS)
app.use(express.static('public'));

// Basic route to test the server
app.get('/', (req, res) => {
    res.send('<h1>School Website Backend is Running!</h1>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});