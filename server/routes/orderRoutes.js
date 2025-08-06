const express = require('express');
const router = express.Router();

// Notice we import BOTH functions on a single line from the controller
const { createOrder, getMyOrders } = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', authMiddleware, createOrder);

// @route   GET api/orders/my-orders
// @desc    Get orders for logged-in user
// @access  Private
router.get('/my-orders', authMiddleware, getMyOrders);

module.exports = router;