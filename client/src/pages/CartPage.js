import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../api'; // <-- 1. Import API function
import './CartPage.css';

const CartPage = () => {
    // 2. Get clearCart from the context
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // 3. Create the function to handle placing the order
    const handlePlaceOrder = async () => {
        try {
            await createOrder({ items: cartItems });
            alert('Your order has been placed successfully!');
            clearCart();
            navigate('/orders'); // Redirect to order history page
        } catch (error) {
            alert('There was an error placing your order. Please try again.');
            console.error(error);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <h2>Your Cart is Empty</h2>
                <button onClick={() => navigate('/shop')} className="btn-shop">Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Your Shopping Cart</h2>
            <div className="cart-container">
                <div className="cart-items">
                    {/* ... (no changes in the mapping part) ... */}
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} />
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>Price: ${parseFloat(item.price).toFixed(2)}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="btn-remove">Remove</button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Total Price:</span>
                        <span className="total-price">${calculateTotalPrice()}</span>
                    </div>
                    {/* 4. Connect the button to the new function */}
                    <button className="btn-checkout" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;