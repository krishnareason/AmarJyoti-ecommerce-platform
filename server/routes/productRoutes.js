const express = require('express');
const router = express.Router();
const { getProducts, getMostSellingProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getProducts);
router.get('/most-selling', getMostSellingProducts);

module.exports = router;