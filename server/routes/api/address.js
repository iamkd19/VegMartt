const express = require('express');
const bodyParser = require('body-parser');
const app = express.Router();
const User = require('../../models/User.js');
app.use(bodyParser.json());

app.get('/full/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const address = [
            user.address.street,
            user.address.city,
            user.address.state,
            user.address.country,
            user.address.pin,
        ].filter(Boolean).join(', ');

        res.json({ userId, address });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = app;