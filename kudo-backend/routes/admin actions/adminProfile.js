const express = require('express');


// User Model
const Admin = require('../../models/Admin.model');

module.exports = async (req, res, next) => {

    const adminId = req.admin.id;

  try 
  {
    // Fetch admin profile or any other protected data
    const admin = await Admin.findById(adminId).select('-password');

    res.json(admin);

  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}