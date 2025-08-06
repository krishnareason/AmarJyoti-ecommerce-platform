const express = require('express');
const router = express.Router();
// --- 1. IMPORT THE NEW FUNCTION ---
const { signup, login, updateUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// --- 2. ADD THE NEW ROUTE FOR UPDATING THE PROFILE ---
// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;