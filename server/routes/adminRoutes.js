const express = require('express');
const router = express.Router();
const { adminLogin, getAllOrders, updateOrderStatus, getAnalytics } = require('../controllers/adminController');
const { addProduct, getAllProductsAdmin, deleteProduct, updateProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/login', adminLogin);
router.post('/products', authMiddleware, adminMiddleware, addProduct);
router.get('/products', authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.patch('/orders/:orderId/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);
router.get('/analytics', authMiddleware, adminMiddleware, getAnalytics);

module.exports = router;