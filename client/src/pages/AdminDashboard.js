import React from 'react';
import AddProductForm from '../components/admin/AddProductForm';
import OrderTable from '../components/admin/OrderTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="admin-content-wrapper"> {/* Renamed for clarity */}
                <div className="add-product-container">
                    <AddProductForm />
                </div>
                <div className="order-table-container-wrapper">
                    <OrderTable />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;