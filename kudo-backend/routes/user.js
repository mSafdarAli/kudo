const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


const registerUser = require('./user actions/registerUser');
const loginUser = require('./user actions/loginUser');
const userProfile = require('./user actions/userProfile');
const updateUser = require('./user actions/updateUser');
const ReadAll = require('./user actions/ReadAll');
const User = require('../models/User.model');


//Middleware
const verifyToken = require('../middlewares/verifyUserToken');

//Register a new user
router
  .route('/register')
  .post(registerUser)


//Login user
router
  .route('/login')
  .post(loginUser)


//Profile
router
  .route('/profile', verifyToken)
  .get(userProfile)

//Update 
router
  .route('/update/:id')
  .put(updateUser)

// Get All Users
router
  .route('/ReadAll')
  .get(ReadAll)

// delete user
router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the provided user ID exists in the database
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(201).json({ status: 'error', message: 'User not found' });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    // Return a success message in the response
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    // Handle any errors that might occur during user deletion
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// get single User
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user with the given ID in the database
    const user = await User.findById(userId);

    // Check if the user was found
    if (!user) {
      return res.status(201).json({ status: 'error', message: 'User not found' });
    }

    // Return the user in the response
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    // Handle any errors that might occur during user retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});










module.exports = router;