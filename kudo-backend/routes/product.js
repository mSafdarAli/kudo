// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');

// Route to create a new product
router.post('/products/:userId', async (req, res) => {
  const {userId} = req.params;
  try {

    const {
      productName,
      baseCpm,
      budget,
      override,
      impressions,
      clientCpm,
      zenonCommission,
    } = req.body;
    // console.log(req.body)
    // Create a new product instance
    const newProduct = new Product({
      productName,
      baseCpm,
      budget,
      override,
      impressions,
      clientCpm,
      zenonCommission,
      user: userId
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Return the created product in the response
    res.status(200).json({ status: 'success', message: 'Product created successfully', data: savedProduct });
  } catch (err) {
    console.log(err.message)
    // Handle any errors that might occur during product creation
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get all products
router.get('/products/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all products from the database
    const products = await Product.find({ user: userId });

    // Return the products in the response
    res.status(200).json({ status: 'success', data: products });
  } catch (err) {
    // Handle any errors that might occur during product retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get a single product by ID
router.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product with the given ID in the database
    const product = await Product.findById(productId);

    // Check if the product was found
    if (!product) {
      return res.status(201).json({ status: 'error', message: 'Product not found' });
    }

    // Return the product in the response
    res.status(200).json({ status: 'success', data: product });
  } catch (err) {
    // Handle any errors that might occur during product retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to update a product by ID
router.put('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      productName,
      baseCpm,
      budget,
      override,
      impressions,
      clientCpm,
      zenonCommission,
    } = req.body;

    // Find the product with the given ID in the database
    const product = await Product.findById(productId);

    // Check if the product was found
    if (!product) {
      return res.status(201).json({ status: 'error', message: 'Product not found' });
    }

    // Update the product fields
    product.productName = productName;
    product.baseCpm = baseCpm;
    product.budget = budget;
    product.override = override;
    product.impressions = impressions;
    product.clientCpm = clientCpm;
    product.zenonCommission = zenonCommission;

    // Save the updated product to the database
    const updatedProduct = await product.save();

    // Return the updated product in the response
    res.status(200).json({ status: 'success', message: 'Product updated successfully', data: updatedProduct });
  } catch (err) {
    // Handle any errors that might occur during product update
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to delete a product by ID
router.delete('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product with the given ID in the database
    const product = await Product.findById(productId);

    // Check if the product was found
    if (!product) {
      return res.status(201).json({ status: 'error', message: 'Product not found' });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    const products = await Product.find();

    // Return a success message in the response
    res.status(200).json({ status: 'success', message: 'Product deleted successfully', data: products });
  } catch (err) {
    // Handle any errors that might occur during product deletion
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
