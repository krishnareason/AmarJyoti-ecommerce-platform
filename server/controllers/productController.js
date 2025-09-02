const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const userRole = req.user.role; 
    const priceColumn = userRole === 'wholesaler' ? 'b2b_price' : 'd2c_price';
    const queryText = `
        SELECT id, name, image_url, delivery_time, ${priceColumn} as price 
        FROM products 
        WHERE is_active = true`;

    const products = await db.query(queryText);
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not get products');
  }
};

exports.getAllProductsAdmin = async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM products ORDER BY id ASC');
        res.json(products.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Could not get products for admin');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateQuery = 'UPDATE products SET is_active = false WHERE id = $1 RETURNING *';
        const result = await db.query(updateQuery, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Product not found.' });
        }
        res.json({ msg: 'Product archived successfully.' });
    } catch (err) {
        console.error('Delete Product Error:', err.message);
        res.status(500).send('Server Error');
    }
};

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

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image_url, b2b_price, d2c_price, delivery_time } = req.body;
        const updateQuery = `
            UPDATE products 
            SET name = $1, image_url = $2, b2b_price = $3, d2c_price = $4, delivery_time = $5 
            WHERE id = $6 
            RETURNING *`;
        const updatedProduct = await db.query(updateQuery, [name, image_url, b2b_price, d2c_price, delivery_time, id]);
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found.' });
        }
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error('Update Product Error:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMostSellingProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.*, SUM(oi.quantity) as total_sold
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            WHERE p.is_active = true
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 4;
        `;
        const mostSelling = await db.query(query);
        const publicProducts = mostSelling.rows.map(p => ({
            id: p.id,
            name: p.name,
            image_url: p.image_url,
            delivery_time: p.delivery_time,
            price: p.d2c_price
        }));

        res.json(publicProducts);
    } catch (err) {
        console.error('Get Most Selling Error:', err.message);
        res.status(500).send('Server Error');
    }
};