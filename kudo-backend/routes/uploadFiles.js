const express = require('express');
const router = express.Router();
const Files = require('../models/Files.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files'); // Store files in the 'files' folder
    },
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp to avoid overwriting files
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// API endpoint to store data in MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { name, format, entryDate, user } = req.body;
        const uploadedFile = req.file;
        console.log(name, format, entryDate, uploadedFile)
        // Validate if file and form data are provided
        if (!name || !format || !entryDate || !uploadedFile) {
            return res.status(400).json({ error: 'Invalid request. Missing data.' });
        }

        // Check for duplicate files based on the filename
        const existingFile = await Files.findOne({ filename: uploadedFile.filename });
        if (existingFile) {
            return res.status(400).json({ error: 'File with the same name already exists.' });
        }

        // Create a new document for the uploaded file
        const newFile = new Files({
            name,
            format,
            entryDate,
            user,
            filename: uploadedFile.filename,
            filePath: uploadedFile.path,
        });

        // Save the file details in MongoDB
        await newFile.save();

        res.status(201).json({ message: 'File uploaded and form data processed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:format/:userId', async (req, res) => {
    try {
        const { format, userId } = req.params;
        const items = await Files.aggregate([
            {
                $match: {
                    format: format,
                    user: userId
                }
            },
        ]);
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const items = await Files.find();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get item by ID
router.get('/single/:id', async (req, res) => {
    try {
        const item = await Files.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update item by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, format, entryDate, file } = req.body;
        const updatedItem = await Files.findByIdAndUpdate(req.params.id, { name, format, entryDate, file }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Files.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
