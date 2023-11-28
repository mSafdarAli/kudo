const express = require('express');
const router = express.Router();


// admin actions
const registerAdmin = require('./admin actions/registerAdmin');
const loginAdmin = require('./admin actions/loginAdmin');
const adminProfile = require('./admin actions/adminProfile');

//Middleware
const verifyAdminToken = require('../middlewares/verifyAdminToken');






//Register a new admin
router
    .route('/register')
    .post(registerAdmin)


//Login admin
router
    .route('/login')
    .post(loginAdmin)


//Profile
router
    .route('/profile', verifyAdminToken)
    .get(adminProfile)

















module.exports = router;