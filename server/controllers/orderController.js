const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // Check the user's role from the token. If they are an admin, deny the request.
    if (req.user.role === 'admin') {
        return res.status(403).json({ msg: 'Forbidden: Admins are not allowed to place orders.' });
    }

    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'Cannot place an empty order.' });
    }

    try {
        let totalPrice = 0;
        let maxDeliveryTime = 0;
        const productIds = items.map(item => item.id);

        const productsResult = await db.query(`SELECT * FROM products WHERE id IN (${productIds.join(',')})`);
        const productsInDb = productsResult.rows;
        
        const userRole = req.user.role;
        const priceColumn = userRole === 'wholesaler' ? 'b2b_price' : 'd2c_price';

        for (const cartItem of items) {
            const product = productsInDb.find(p => p.id === cartItem.id);
            if (!product) {
                return res.status(404).json({ msg: `Product with id ${cartItem.id} not found.` });
            }
            totalPrice += parseFloat(product[priceColumn]) * cartItem.quantity;
            if (product.delivery_time > maxDeliveryTime) {
                maxDeliveryTime = product.delivery_time;
            }
        }
        
        const deliveryEta = new Date();
        deliveryEta.setDate(deliveryEta.getDate() + maxDeliveryTime);

        const newOrder = await db.query(
            'INSERT INTO orders (user_id, total_price, delivery_eta) VALUES ($1, $2, $3) RETURNING id',
            [userId, totalPrice, deliveryEta]
        );
        const orderId = newOrder.rows[0].id;

        const orderItemPromises = items.map(item => {
            const product = productsInDb.find(p => p.id === item.id);
            const priceForThisItem = product[priceColumn];
            return db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, priceForThisItem]
            );
        });
        await Promise.all(orderItemPromises);

        res.status(201).json({ msg: 'Order placed successfully!', orderId });

    } catch (err) {
        console.error('Order creation error:', err.message);
        res.status(500).send('Server Error');
    }
};


// --- NEW FUNCTION: Get all orders for the logged-in user ---
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // --- DEBUGGING LOGS ---
        console.log(`\n--- [GET MY ORDERS] ---`);
        console.log(`Fetching orders for user_id: ${userId}`);
        
        const query = `
            SELECT 
                o.id as order_id, 
                o.total_price, 
                o.delivery_eta, 
                o.status, 
                o.order_date,
                json_agg(json_build_object(
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price_per_unit', oi.price_per_unit
                )) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.order_date DESC;
        `;
        
        const ordersResult = await db.query(query, [userId]);

        console.log(`--- [GET MY ORDERS] SQL Query found ${ordersResult.rowCount} order(s).`);
        console.log(`--- [GET MY ORDERS] Sending data to frontend.`);
        // --- END OF DEBUGGING ---
        
        res.json(ordersResult.rows);

    } catch (err) {
        console.error('Get My Orders Error:', err.message);
        res.status(500).send('Server Error');
    }
};