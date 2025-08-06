import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../api';
import './OrderTable.css';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState(''); // State for the filter dropdown

    // This effect will now re-run whenever the filterRole state changes
    useEffect(() => {
        const fetchAllOrders = async () => {
            setLoading(true); // Set loading true on each fetch
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
    }, [filterRole]); // Dependency array includes filterRole

    return (
        <div className="order-table-container">
            <h3>All Customer Orders</h3>

            {/* --- FILTER CONTROLS --- */}
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

            {loading ? (
                <p>Loading all orders...</p>
            ) : orders.length === 0 ? (
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
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderTable;