const express = require('express');


// User Model
const User = require('../../models/User.model');

module.exports = async (req, res, next) => {

  try {
    // Find all users from the database
    const users = await User.find();

    // Return the users in the response
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    // Handle any errors that might occur during user retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
  
}