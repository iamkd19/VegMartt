const express = require("express");
const router = express.Router();
const User = require("../../models/User.js");

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fullName = `${user.firstname} ${user.lastname}`;
        res.json({ fullName });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;