const db = require('../config/db');
const argon2 = require('argon2'); // <-- CHANGED
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
        const admin = result.rows[0];
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // Use argon2.verify to compare passwords
        const isMatch = await argon2.verify(admin.password, password); // <-- CHANGED
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }
        const payload = { user: { id: admin.id, role: 'admin' } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: admin.id, email: admin.email, role: 'admin' } });
    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).send('Server error');
    }
};

// --- NEW FUNCTION: Get all orders for the admin panel ---
exports.getAllOrders = async (req, res) => {
    try {
        // Get filter values from the query string (e.g., /api/admin/orders?role=consumer)
        const { role } = req.query;

        // Start with the base query
        let baseQuery = `
            SELECT 
                o.id, 
                o.total_price, 
                o.delivery_eta, 
                o.status, 
                o.order_date,
                u.name as customer_name,
                u.email as customer_email,
                u.role as customer_role
            FROM orders o
            JOIN users u ON o.user_id = u.id
        `;

        const queryParams = [];
        const whereClauses = [];

        // If a role filter is provided, add it to the query
        if (role) {
            queryParams.push(role);
            whereClauses.push(`u.role = $${queryParams.length}`);
        }

        // If we have any WHERE clauses, append them to the base query
        if (whereClauses.length > 0) {
            baseQuery += ' WHERE ' + whereClauses.join(' AND ');
        }
        
        baseQuery += ' ORDER BY o.order_date DESC;';

        const allOrders = await db.query(baseQuery, queryParams);
        res.json(allOrders.rows);

    } catch (err) {
        console.error('Get All Orders Error:', err.message);
        res.status(500).send('Server Error');
    }
};