const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require("../../models/User.js");
const app = express.Router();
app.use(cors());
app.use(bodyParser.json());

// API endpoint to create or update seller information
app.post('/create-seller-info', async (req, res) => {
    const { id, name } = req.body;

    console.log("Received request. ID:", id, "New Seller Name:", name);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    'seller_details.name': name,
                },
            },
            { new: true }
        ).exec();

        console.log("Updated User:", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser.seller_details);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/seller-info/:Id', (req, res) => {
    const userId = req.params.Id;
    User.findById(userId)
        .then((user) => {
            if (!user || !user.seller_details) {
                return res.status(404).json({ error: 'Seller information not found for the current user.' });
            }
            const sellerInfo = {
                name: user.seller_details.name,
                products: user.seller_details.products,
            };
            res.json(sellerInfo);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Add this API endpoint to your existing server code
app.post('/add-product/:id', async (req, res) => {
    const userId = req.params.id;
    const { product } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { 'seller_details.products': product },
            },
            { new: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser.seller_details.products);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});



// API endpoint to modify a product in seller_details
app.put('/:userId/seller-details/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { name, category, image, price, description } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the product in seller_details by productId
        const productIndex = user.seller_details.products.findIndex(
            (product) => product.id === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product details
        user.seller_details.products[productIndex].name = name;
        user.seller_details.products[productIndex].category = category;
        user.seller_details.products[productIndex].image = image;
        user.seller_details.products[productIndex].price = price;
        user.seller_details.products[productIndex].description = description;

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'Product updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = app;
