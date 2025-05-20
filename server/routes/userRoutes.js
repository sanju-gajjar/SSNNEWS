const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming a User model exists

// Endpoint to update or add district for a user
router.post('/update-district', async (req, res) => {
    const { userName, district } = req.body;

    if (!userName || !district) {
        return res.status(400).json({ error: 'userName and district are required' });
    }

    try {
        // Find user by userName and update or create if not exists
        const user = await User.findOneAndUpdate(
            { userName },
            { $set: { location: district } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'District updated successfully', user });
    } catch (error) {
        console.error('Error updating district:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;