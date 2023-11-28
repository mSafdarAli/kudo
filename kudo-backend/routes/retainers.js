const express = require('express');
const router = express.Router();
const Retainers = require('../models/Retainers.model');

// Create a new retainer
router.post('/api/retainers', async (req, res) => {
  try {
    // console.log(req.body)
    const newRetainer = new Retainers(req.body);
    await newRetainer.save();
    res.status(201).json(newRetainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all retainers by userId
router.get('/api/retainers/all/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const retainers = await Retainers.find({userId: userId });
    res.status(200).json(retainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a specific retainer by ID
router.get('/api/retainers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const retainer = await Retainers.findById(id);
    if (!retainer) {
      return res.status(404).json({ error: 'Retainer not found' });
    }
    res.status(200).json(retainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a retainer by ID
router.put('/api/retainers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRetainer = await Retainers.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRetainer) {
      return res.status(404).json({ error: 'Retainer not found' });
    }
    res.status(200).json(updatedRetainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a retainer by ID
router.delete('/api/retainers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRetainer = await Retainers.findByIdAndDelete(id);
    if (!deletedRetainer) {
      return res.status(404).json({ error: 'Retainer not found' });
    }
    res.status(200).json(deletedRetainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
