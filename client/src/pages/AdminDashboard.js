import React, { useState } from 'react';
import AddProductForm from '../components/admin/AddProductForm';
import OrderTable from '../components/admin/OrderTable';
import AdminProductList from '../components/admin/AdminProductList';
import AnalyticsView from '../components/admin/AnalyticsView';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [productToEdit, setProductToEdit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        const formElement = document.querySelector('.management-grid');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleFormSubmit = () => {
        setProductToEdit(null);
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            
            <AnalyticsView />
            
            <div className="management-grid">
                <div className="management-card">
                    <AddProductForm 
                        productToEdit={productToEdit} 
                        onFormSubmit={handleFormSubmit} 
                    />
                </div>
                <div className="management-card">
                     <AdminProductList 
                        key={refreshKey} 
                        onEditProduct={handleEditProduct} 
                    /> 
                </div>
            </div>

            <div className="orders-table-full-width management-card">
                 <OrderTable />
            </div>
        </div>
    );
};

export default AdminDashboard;