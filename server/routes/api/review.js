const express = require("express");
const app = express.Router();
const User = require("../../models/User.js");

app.post('/sellerrating/:userId', async (req, res) => {
    const id = req.params.userId;
    const { data, rating, comment } = req.body;
    const sellerId = data.seller_id;

    try {
        const existingReview = await User.findOne({
            _id: id,
            'review_post._id': sellerId,
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You can only review a seller once.' });
        }
        console.log("server: ", comment)
        console.log("server: ", rating)

        const review = {
            _id: sellerId,
            comment,
            rating,
        };

        await User.findByIdAndUpdate(id, { $push: { review_post: review } });

        res.json({ message: 'Review added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/sellerrating/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;
    try {
        const targetId = sellerId;
        const users = await User.find({ 'review_post._id': targetId });

        const formattedUsers = users.map(user => ({
            name: user.firstname,
            review_post: user.review_post.find(post => post._id.equals(targetId)),
        }));

        res.json(users);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;