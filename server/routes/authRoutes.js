const express = require('express');
const router = express.Router();
const { signup, login, updateUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;