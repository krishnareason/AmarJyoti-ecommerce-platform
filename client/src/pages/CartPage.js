import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../api';
import axios from 'axios'; 
import './CartPage.css';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/checkout/CheckoutForm';

const stripePromise = loadStripe('pk_test_51S1s3DAKibX4L98O8V2E5wNGpjRAhgP2Jy42zF947MYdKfgvdXFENBx4E5TQ2PouvrO8xxidynmpuhbnoPU6H2LE00anXF6RbR');

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleProceedToCheckout = async () => {
        if (cartItems.length === 0) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                'http://localhost:5000/api/payment/create-payment-intent',
                { amount: calculateTotalPrice() },
                { headers: { 'x-auth-token': token } }
            );

            setClientSecret(res.data.clientSecret);
            setIsCheckingOut(true); 
        } catch (error) {
            console.error("Error creating payment intent", error);
            alert('Could not initiate payment. Please try again.');
        }
    };

    const handleSuccessfulPayment = async () => {
        try {
            await createOrder({ items: cartItems });
            alert('Your order has been placed successfully!');
            clearCart();
            navigate('/orders');
        } catch (error) {
            alert('Payment was successful, but there was an error saving your order. Please contact support.');
            console.error(error);
        }
    };

    const cartView = (
        <div className="cart-container">
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <h2>Your Cart is Empty</h2>
                        <button onClick={() => navigate('/shop')} className="btn-shop">Start Shopping</button>
                    </div>
                ) : (
                    cartItems.map(item => (
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
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Total Price:</span>
                        <span className="total-price">${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="btn-checkout" onClick={handleProceedToCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );

    const checkoutView = (
        <div className="checkout-container">
            <h3>Complete Your Payment</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onPaymentSuccess={handleSuccessfulPayment} />
            </Elements>
        </div>
    );

    return (
        <div className="cart-page">
            {isCheckingOut ? <h2>Checkout</h2> : <h2>Your Shopping Cart</h2>}
            {isCheckingOut && clientSecret ? checkoutView : cartView}
        </div>
    );
};

export default CartPage;