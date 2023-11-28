const express = require('express');


// User Model
const User = require('../../models/User.model');

module.exports = async (req, res, next) => {

  try {
    const userId = req.params.id;
    const { name, email, contact, timeZone, role, password } = req.body;

    // Check if the user with the given ID exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(201).json({  message: 'User not found' });
    }

    // Update user fields with the new values
    existingUser.name = name;
    existingUser.email = email;
    existingUser.contact = contact;
    existingUser.timeZone = timeZone;
    existingUser.role = role;
    existingUser.password = password;

    // Save the updated user to the database
    const updatedUser = await existingUser.save();

    // Return the updated user in the response
    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    // Handle any errors that might occur during user update
    res.status(500).json({  message: 'Internal server error' });
  }
}