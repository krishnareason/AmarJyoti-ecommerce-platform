const express = require('express');
const router = express.Router();
// --- 1. IMPORT THE NEW FUNCTION ---
const { adminLogin, getAllOrders } = require('../controllers/adminController');
const { addProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route to login as an admin
router.post('/login', adminLogin);

// Route for an admin to add a new product
router.post('/products', authMiddleware, adminMiddleware, addProduct);

// --- 2. ADD THE NEW ROUTE TO GET ALL ORDERS ---
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);


module.exports = router;