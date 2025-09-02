import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrderHistory();
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch order history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="order-history-page"><h2>Loading your orders...</h2></div>;
    }

    return (
        <div className="order-history-page">
            <h1>My Order History</h1>
            {orders.length === 0 ? (
                <p>You have not placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.order_id} className="order-card">
                            <div className="order-summary">
                                <div>
                                    <strong>Order ID:</strong> #{order.order_id}
                                </div>
                                <div>
                                    <strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Estimated Delivery:</strong> {new Date(order.delivery_eta).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-total">
                                    <strong>Total:</strong> ${parseFloat(order.total_price).toFixed(2)}
                                </div>
                            </div>
                            <div className="order-items-details">
                                <h4>Items in this order:</h4>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity} x {item.product_name} (@ ${parseFloat(item.price_per_unit).toFixed(2)} each)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;