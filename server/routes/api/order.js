const express = require("express");
const router = express.Router();
const User = require("../../models/User.js");

router.put("/new/:userId/:paymentId", async (req, res) => {
    const userId = req.params.userId;
    const paymentId = req.params.paymentId;

    console.log("Consumer Id:", userId)
    console.log("Payment Id:", paymentId)

    try {
        const existingUser = await User.findOne({ _id: userId, 'orders.payment_id': paymentId });
        if (existingUser) {
            console.error('Duplicate payment ID for user');
            res.status(400).json({ error: 'Duplicate payment ID for user' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    'orders': {
                        cart: req.body,
                        payment_id: paymentId
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );

        console.log('User updated successfully:', updatedUser);

        for (const order of req.body) {
            const sellerId = order.seller_id;
            const seller = await User.findById(sellerId);

            if (seller) {
                const existingSeller = await User.findOne({ _id: sellerId, 'consumer_orders.payment_id': paymentId });
                if (existingSeller) {
                    console.error('Duplicate payment ID for seller');
                    res.status(400).json({ error: 'Duplicate payment ID for seller' });
                    return;
                }

                const updatedSeller = await User.findByIdAndUpdate(
                    sellerId,
                    {
                        $push: {
                            'consumer_orders': {
                                // cart: req.body,
                                $each: req.body.filter(product => product.seller_id === sellerId)
                                    .map(product => ({
                                        cart: product,

                                    })),
                                payment_id: paymentId,
                                consumer_id: userId

                            }
                        }
                    },
                    { new: true, useFindAndModify: false }
                );

                console.log('Seller updated successfully:', updatedSeller);
            }
            else {
                console.error('Seller not found');
                res.status(404).json({ error: 'Seller not found' });
                return;
            }
        }

        res.status(200).json({ message: 'User and seller updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating user and seller:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:userId', async (req, res) => {
    console.log("Orders: " + req.params.userId)
    try {
        const user = await User.findById(req.params.userId);
        res.json(user.orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/consumer_orders/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const consumerOrders = user.consumer_orders;
        res.json(consumerOrders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;