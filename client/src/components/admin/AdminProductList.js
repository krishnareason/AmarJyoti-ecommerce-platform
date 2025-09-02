import React, { useState, useEffect } from 'react';
import { getAllProductsAdmin, deleteProduct } from '../../api';
import './AdminProductList.css';

const AdminProductList = ({ onEditProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await getAllProductsAdmin();
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch admin products list", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to permanently delete this product?')) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(p => p.id !== productId));
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Could not delete product.');
            }
        }
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="admin-product-list-container">
            <h3>Manage Products</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>D2C Price</th>
                        <th>B2B Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>${parseFloat(product.d2c_price).toFixed(2)}</td>
                            <td>${parseFloat(product.b2b_price).toFixed(2)}</td>
                            <td>
                                {/* The Edit button now calls the onEditProduct function from the dashboard */}
                                <button onClick={() => onEditProduct(product)} className="btn-edit">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="btn-delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductList;