const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// admin Model
const Admin = require('../../models/Admin.model');

module.exports = async (req, res, next) => {

    const { name, email, password } = req.body;

    

    const createToken = (admin) => {
        return jwt.sign({ admin }, process.env.ADMIN_TOKEN_SECRET);
    };

    try 
    {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
          return res.status(400).json({ message: 'admin already exists.' });
        }
    
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create a new admin
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();
    
        const token = createToken(newAdmin);
    
        res.status(200).json({ message: 'admin registered successfully', token });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    

}