const axios = require('axios');

const OPENAI_API_KEY = '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'; 

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

module.exports = openai;
