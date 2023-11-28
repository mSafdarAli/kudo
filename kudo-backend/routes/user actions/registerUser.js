const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User.model');

module.exports = async (req, res, next) => {

    const { name, email, contact, timeZone, role, password } = req.body;

    

    const createToken = (user) => {
        return jwt.sign({ user }, process.env.USER_TOKEN_SECRET);
    };

    try 
    {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(201).json({ message: 'User already exists.' });
        }
    
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create a new user
        const newUser = new User({ 
            name,
            email,
            contact,
            timeZone,
            role, 
            password: hashedPassword 
        });
        await newUser.save();
    
        const token = createToken(newUser);
    
        res.status(200).json({ message: 'User registered successfully', token: token, data:newUser });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    

}