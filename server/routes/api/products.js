const express = require("express");
const router = express.Router();
const User = require("../../models/User.js");

router.put("/new/:id", async (req, res) => {
  const newProduct = req.body;

  try {
    const updateResult = await User.findOneAndUpdate(
      { _id: req.params.id, "products._id": newProduct._id },
      {
        $set: {
          "products.$": newProduct,
        },
      },
      { new: true }
    );

    if (updateResult) {
      return res.status(200).json({
        status: "ok",
        message: "Product updated successfully",
        data: updateResult.products,
      });
    }

    const addResult = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: {
          products: newProduct,
        },
      },
      { new: true }
    );

    if (!addResult) {
      return res.status(404).json({ error: "You have to log in first!" });
    }

    res.status(200).json({
      status: "ok",
      message: "Product added successfully",
      data: addResult.products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    let usersQuery = {};
    const users = await User.find(usersQuery, "products");
    const allProducts = users.reduce(
      (acc, user) => acc.concat(user.products),
      []
    );

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const users = await User.find({}, "products");
    const foundProduct = users.reduce((acc, user) => {
      const product = user.products.find(
        (product) => product._id.toString() === productId
      );
      if (product) {
        acc = product;
      }
      return acc;
    }, null);

    if (foundProduct) {
      res.json(foundProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProducts = user.products;
    return res.json(userProducts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete('/:userId/:productId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productIndex = user.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    user.products.splice(productIndex, 1);
    await user.save();
    res.json({ message: 'Product deleted successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
