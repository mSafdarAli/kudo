const express = require('express');
const router = express.Router();
const openai = require('../openai');

/**
 * @swagger
 * tags:
 *   name: ChatGPT
 *   description: API for interacting with ChatGPT
 */

/**
 * @swagger
 * /chatgpt:
 *   post:
 *     summary: Get a chat response from ChatGPT
 *     tags: [ChatGPT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The user's message
 *     responses:
 *       200:
 *         description: Chat response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 */
router.post('/chatgpt', async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log(req.body)
    // Send a prompt to ChatGPT and receive a response
    const response = await openai.post('/engines/text-davinci-002/completions', {
      prompt,
      max_tokens: 1000,
    });
    // console.log('API Response:', response.data.choices[0].text);

    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
