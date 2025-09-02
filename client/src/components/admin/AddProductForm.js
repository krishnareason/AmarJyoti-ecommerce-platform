import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../api';
import './AddProductForm.css'; 

const AddProductForm = ({ productToEdit, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        b2b_price: '',
        d2c_price: '',
        delivery_time: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                image_url: productToEdit.image_url || '',
                b2b_price: productToEdit.b2b_price || '',
                d2c_price: productToEdit.d2c_price || '',
                delivery_time: productToEdit.delivery_time || ''
            });
        } else {
            setFormData({
                name: '', image_url: '', b2b_price: '', d2c_price: '', delivery_time: ''
            });
        }
    }, [productToEdit]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, formData);
                setMessage('Product updated successfully!');
            } else {
                await addProduct(formData);
                setMessage('Product added successfully!');
            }
            if(onFormSubmit) {
                onFormSubmit();
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        }
    };

    return (
        <form className="add-product-form" onSubmit={handleSubmit}>
            <h3>{productToEdit ? 'Edit Product' : 'Add a New Product'}</h3>
            <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Wholesale (B2B) Price</label>
                <input type="number" name="b2b_price" value={formData.b2b_price} step="0.01" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Consumer (D2C) Price</label>
                <input type="number" name="d2c_price" value={formData.d2c_price} step="0.01" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Delivery Time (in days)</label>
                <input type="number" name="delivery_time" value={formData.delivery_time} onChange={handleChange} required />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit" className="btn-submit">
                {productToEdit ? 'Update Product' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;