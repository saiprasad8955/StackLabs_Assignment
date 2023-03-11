const express = require("express");
const router = express.Router();

// IMPORTING CONTROLLERS
const { register, loginUser, users, userProfile } = require('../controllers/controllers')
const { authentication } = require('../middleware/auth');

//----------- USER API'S
router.post('/register', register)                        // Register Users
router.post('/login', loginUser)                          // Login Users
router.get('/users', authentication, users)               // Fetch Users
router.get('/userProfile/:userId', authentication, userProfile)   // User Profile

// EXPORTING ROUTER
module.exports = router;