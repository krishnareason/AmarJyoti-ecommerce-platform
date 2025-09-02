import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import ProductList from '../components/product/ProductList';
import './ShopPage.css';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetchProducts();
                setProducts(res.data);
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []); 

    if (loading) {
        return <div className="shop-page"><p>Loading products...</p></div>;
    }

    if (error) {
        return <div className="shop-page"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="shop-page">
            <h1>Our Collection</h1>
            <ProductList products={products} />
        </div>
    );
};

export default ShopPage;