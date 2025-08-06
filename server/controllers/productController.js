const db = require('../config/db');

// Get all products - with prices based on user role
exports.getProducts = async (req, res) => {
  try {
    const userRole = req.user.role; // Role comes from the authMiddleware
    
    const priceColumn = userRole === 'wholesaler' ? 'b2b_price' : 'd2c_price';

    const queryText = `SELECT id, name, image_url, delivery_time, ${priceColumn} as price FROM products`;

    const products = await db.query(queryText);

    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not get products');
  }
};

// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
    const { name, image_url, b2b_price, d2c_price, delivery_time } = req.body;

    try {
        const newProduct = await db.query(
            'INSERT INTO products (name, image_url, b2b_price, d2c_price, delivery_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, image_url, b2b_price, d2c_price, delivery_time]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Could not add product');
    }
};