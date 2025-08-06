import React, { useState } from 'react';
import { addProduct } from '../../api';
import '../../pages/SignupPage.css'; // We'll reuse the form styles

const AddProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        b2b_price: '',
        d2c_price: '',
        delivery_time: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { name, image_url, b2b_price, d2c_price, delivery_time } = formData;

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await addProduct(formData);
            setMessage('Product added successfully!');
            // Clear the form
            setFormData({ name: '', image_url: '', b2b_price: '', d2c_price: '', delivery_time: '' });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add product.');
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
            <h3>Add a New Product</h3>
            <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image_url" value={image_url} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Wholesale (B2B) Price</label>
                <input type="number" name="b2b_price" value={b2b_price} step="0.01" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Consumer (D2C) Price</label>
                <input type="number" name="d2c_price" value={d2c_price} step="0.01" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Delivery Time (in days)</label>
                <input type="number" name="delivery_time" value={delivery_time} onChange={handleChange} required />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit" className="btn-submit">Add Product</button>
        </form>
    );
};

// We also need a success message style
const successMessageStyle = `
.success-message {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 20px;
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = successMessageStyle;
document.head.appendChild(styleSheet);


export default AddProductForm;