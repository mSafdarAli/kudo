const express = require('express');
const router = express.Router();
const schemas  = require('../swagger');
const Vendor = require('../models/Vendor.model');

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: API for managing vendors
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: An error occurred while fetching vendors
 */
router.get('/all/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const vendors = await Vendor.find({userId: userId});
    return res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return res.status(500).json({ error: 'An error occurred while fetching vendors.' });
  }
});

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: An error occurred while creating the vendor
 */
router.post('/', async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    await newVendor.save();
    return res.status(201).json({ message: 'Vendor created successfully', vendor: newVendor });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return res.status(500).json({ error: 'An error occurred while creating the vendor.' });
  }
});

/**
 * @swagger
 * /vendors/{id}:
 *   put:
 *     summary: Update a vendor
 *     tags: [Vendors]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the vendor to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 *       500:
 *         description: An error occurred while updating the vendor
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    return res.status(200).json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return res.status(500).json({ error: 'An error occurred while updating the vendor.' });
  }
});

/**
 * @swagger
 * /vendors/{id}:
 *   delete:
 *     summary: Delete a vendor
 *     tags: [Vendors]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the vendor to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 *       500:
 *         description: An error occurred while deleting the vendor
 */
router.post('/:id', async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndRemove(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    const vendors = await Vendor.find();

    return res.status(200).json({ message: 'Vendor deleted successfully', data: vendors  });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the vendor.' });
  }
});

module.exports = router;
