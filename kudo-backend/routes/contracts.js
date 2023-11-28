const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract.model');
const upload = require('../helpers/upload');
const { deleteFile } = require('../helpers/deleteFile');
const path = require('path')
/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: API for managing contracts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         client:
 *           type: string
 *         signedDate:
 *           type: string
 *           format: date
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         service:
 *           type: string
 *         campaign:
 *           type: string
 *         monthlySpend:
 *           type: number
 *         fileUrl:
 *           type: string
 */

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Get all contracts
 *     tags: [Contracts]
 *     responses:
 *       200:
 *         description: List of contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 */

router.get('/contracts/all/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const contracts = await Contract.find({userId: userId});
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Create a new contract
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       201:
 *         description: Contract created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 */
router.post('/contracts', upload.single('file'), async (req, res) => {
  const { client, signedDate, startDate, endDate, services, campaign, monthlySpend, userId } = req.body;
  // console.log(req.body, req.file)
  const filePath = req.file.path.replace('public', ''); // Get the relative path
  try {
    const newContract = new Contract({
      client,
      signedDate,
      startDate,
      endDate,
      services,
      campaign,
      monthlySpend,
      fileUrl: filePath,
      userId
    });

    const savedContract = await newContract.save();

    // Respond with success message and file URL
    res.status(201).json({ message: 'Contract created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Get a contract by ID
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contract to retrieve
 *     responses:
 *       200:
 *         description: Contract retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 */
router.get('/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   put:
 *     summary: Update a contract by ID
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contract to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       200:
 *         description: Contract updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 */
router.put('/contracts/:id', upload.single('file'), async (req, res) => {
  try {
    const { client, signedDate, startDate, endDate, services, campaign, monthlySpend } = req.body;
    const filePath = req.file.path.replace('public', '');

    // Find the contract document by ID
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    deleteFile(contract.fileUrl);

    contract.client = client;
    contract.signedDate = signedDate;
    contract.startDate = startDate;
    contract.endDate = endDate;
    contract.services = services;
    contract.campaign = campaign;
    contract.monthlySpend = monthlySpend;
    contract.fileUrl = filePath; // Update the file URL with the new one

    // Save the updated contract document
    await contract.save();

    // Return a success response
    res.json({ message: 'Contract updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   delete:
 *     summary: Delete a contract by ID
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contract to delete
 *     responses:
 *       204:
 *         description: Contract deleted successfully
 */
router.post('/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    deleteFile(contract.fileUrl);

    await Contract.findByIdAndDelete(req.params.id);

    const contracts = await Contract.find();


    res.json({ message: "Contract Deleted Successful", data: contracts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
