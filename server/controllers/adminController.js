const db = require('../config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const isMatch = await argon2.verify(admin.password, password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }
        
        const payload = { 
            user: { 
                id: admin.id, 
                role: 'admin'
            } 
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, user: { id: admin.id, email: admin.email, role: 'admin' } });

    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { role } = req.query;
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
        if (role) {
            queryParams.push(role);
            whereClauses.push(`u.role = $${queryParams.length}`);
        }
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value.' });
        }
        const updateQuery = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
        const updatedOrder = await db.query(updateQuery, [status, orderId]);
        if (updatedOrder.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found.' });
        }
        res.json(updatedOrder.rows[0]);
    } catch (err) {
        console.error('Update Order Status Error:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const totalRevenueResult = await db.query('SELECT SUM(total_price) FROM orders');
        const totalRevenue = totalRevenueResult.rows[0].sum || 0;

        const totalOrdersResult = await db.query('SELECT COUNT(*) FROM orders');
        const totalOrders = totalOrdersResult.rows[0].count || 0;

        const totalCustomersResult = await db.query('SELECT COUNT(*) FROM users');
        const totalCustomers = totalCustomersResult.rows[0].count || 0;

        const ordersTodayResult = await db.query("SELECT COUNT(*) FROM orders WHERE DATE(order_date) = CURRENT_DATE");
        const ordersToday = ordersTodayResult.rows[0].count || 0;

        const salesByDayResult = await db.query(`
            SELECT 
                TO_CHAR(date_series, 'YYYY-MM-DD') as date,
                COALESCE(SUM(o.total_price), 0) as total
            FROM 
                generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') as date_series
            LEFT JOIN 
                orders o ON DATE(o.order_date) = date_series
            GROUP BY 
                date_series
            ORDER BY 
                date_series;
        `);
        const salesByDay = salesByDayResult.rows;

        const revenueByRoleResult = await db.query(`
            SELECT u.role, SUM(o.total_price) as total_revenue
            FROM orders o
            JOIN users u ON o.user_id = u.id
            GROUP BY u.role;
        `);
        const revenueByRole = revenueByRoleResult.rows;

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            ordersToday,
            salesByDay,
            revenueByRole
        });
    } catch (err) {
        console.error('Get Analytics Error:', err.message);
        res.status(500).send('Server Error');
    }
};