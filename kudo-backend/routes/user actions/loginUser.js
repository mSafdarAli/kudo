const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User.model');

module.exports = async (req, res, next) => {

    const { email, password } = req.body;

    const createToken = (user) => {
        return jwt.sign({ user }, process.env.USER_TOKEN_SECRET);
    };
    

    try 
    {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(201).json({ message: 'Invalid Email' });
        }
    
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(201).json({ message: 'Invalid Password' });
        }

        const token = createToken(user);
    
        res.status(200).json({ message: 'Logged in successfully', user, token });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    

}