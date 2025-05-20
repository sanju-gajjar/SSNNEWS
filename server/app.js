const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();

app.use(express.json()); // Middleware to parse JSON
//app.use('/api/user', userRoutes); // Use user routes

module.exports = app;