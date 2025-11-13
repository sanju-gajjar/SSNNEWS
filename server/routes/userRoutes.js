const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming a User model exists

// Endpoint to update or add district for a user
router.post('/update-district', async (req, res) => {
    const { userName, district } = req.body;

    console.log(`[INFO] Received request to update district for user: ${userName}`);

    if (!userName || !district) {
        console.error(`[ERROR] Missing required fields: userName or district`);
        return res.status(400).json({ error: 'userName and district are required' });
    }

    try {
        // Find user by userName and update or create if not exists
        const user = await User.findOneAndUpdate(
            { userName },
            { $set: { location: district } },
            { new: true, upsert: true }
        );

        console.log(`[INFO] District updated successfully for user: ${userName}`);
        res.status(200).json({ message: 'District updated successfully', user });
    } catch (error) {
        console.error(`[ERROR] Error updating district for user: ${userName}`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin endpoint to create users with specific roles
router.post('/create-user', async (req, res) => {
    const bcrypt = require('bcrypt');
    const { userName, email, password, role, location } = req.body;
    const name = userName; // Use userName from form as name

    console.log(`[INFO] Admin request to create user: ${name} with role: ${role}`);

    if (!name || !email || !password || !role) {
        console.error(`[ERROR] Missing required fields for user creation`);
        return res.status(400).json({ error: 'userName, email, password, and role are required' });
    }

    // Validate role
    if (!['user', 'admin', 'reporter', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be user, admin, reporter, or moderator' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            location: location || '',
            isActive: true
        });

        await user.save();
        console.log(`[INFO] User created successfully: ${name} with role: ${role}`);
        res.status(201).json({ message: 'User created successfully', user: { _id: user._id, name, email, role, location } });
    } catch (error) {
        console.error(`[ERROR] Error creating user: ${name}`, error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(`[ERROR] Error fetching users`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user role (Admin only)
router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'reporter'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`[INFO] User role updated: ${user.userName} to ${role}`);
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error(`[ERROR] Error updating user role`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;