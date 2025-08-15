const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Middleware to log API calls
app.use((req, res, next) => {
    console.log(`[INFO] ${req.method} request received for ${req.originalUrl}`);
    next();
});

app.use('/api/user', userRoutes); // Use user routes

module.exports = app;