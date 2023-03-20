const express = require("express");
const router = express.Router();

// IMPORTING CONTROLLERS
const { register, loginUser, users, userProfile, } = require('../controllers/controllers')
const { authentication, firebaseAuth } = require('../middleware/auth');

//----------- USER API'S
// Register Users
router.post('/register', register);

// Login Users
router.post('/login', firebaseAuth, loginUser);

// Fetch Users
router.get('/users', authentication, users);

// User Profile
router.get('/userProfile/:userId', authentication, userProfile);

// EXPORTING ROUTER
module.exports = router;