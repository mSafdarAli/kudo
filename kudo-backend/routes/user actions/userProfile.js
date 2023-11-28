const express = require('express');


// User Model
const User = require('../../models/User.model');

module.exports = async (req, res, next) => {

    const userId = req.user.id;

  try 
  {
    // Fetch user profile or any other protected data
    const user = await User.findById(userId).select('-password');

    res.json(user);

  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}