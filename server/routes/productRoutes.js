const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all products
// It's protected, you must be logged in to see products
router.get('/', authMiddleware, getProducts);

module.exports = router;