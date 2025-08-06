import React, { useContext } from 'react'; // <-- Add useContext
import { CartContext } from '../../context/CartContext'; // <-- Import CartContext
import './Product.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext); // <-- Get the addToCart function
    const placeholderImage = 'https://via.placeholder.com/300x300.png?text=AmarJyoti';

    return (
        <div className="product-card">
            <img 
                src={product.image_url || placeholderImage} 
                alt={product.name} 
                className="product-image" 
            />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                <p className="product-delivery">Est. Delivery: {product.delivery_time} days</p>
            </div>
            {/* This button now calls the addToCart function from our context */}
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;