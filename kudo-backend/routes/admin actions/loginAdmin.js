const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Model
const Admin = require('../../models/Admin.model');

module.exports = async (req, res, next) => {

    const { email, password } = req.body;

    const createToken = (admin) => {
        return jwt.sign({ admin }, process.env.ADMIN_TOKEN_SECRET);
    };
    

    try 
    {
        // Find the user by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return res.status(401).json({ message: 'Invalid Email' });
        }
    
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid Password' });
        }

        const adminId = admin._id;
        const token = createToken(admin);
    
        res.status(200).json({ message: 'Logged in successfully', adminId, token });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    

}