import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api'; 
import './OrderTable.css';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');

    useEffect(() => {
        const fetchAllOrders = async () => {
            setLoading(true);
            try {
                const filters = {};
                if (filterRole) {
                    filters.role = filterRole;
                }
                const res = await getAllOrders(filters);
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch all orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, [filterRole]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Failed to update order status", error);
            alert("Could not update order status.");
        }
    };

    if (loading) {
        return <p>Loading all orders...</p>;
    }

    return (
        <>
            <h3>All Customer Orders</h3>

            <div className="filter-controls">
                <label htmlFor="role-filter">Filter by Role:</label>
                <select 
                    id="role-filter" 
                    value={filterRole} 
                    onChange={e => setFilterRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="consumer">Consumer</option>
                    <option value="wholesaler">Wholesaler</option>
                </select>
            </div>

            {orders.length === 0 ? (
                <p>No orders found for the selected filter.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Role</th>
                            <th>Order Date</th>
                            <th>Total Price</th>
                            <th>Est. Delivery</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.customer_name}</td>
                                <td className="role-cell">{order.customer_role}</td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td>${parseFloat(order.total_price).toFixed(2)}</td>
                                <td>{new Date(order.delivery_eta).toLocaleDateString()}</td>
                                <td>
                                    <select 
                                        className="status-dropdown" 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default OrderTable;