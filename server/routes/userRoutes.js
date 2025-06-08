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

module.exports = router;