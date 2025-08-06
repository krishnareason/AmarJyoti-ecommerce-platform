import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                🕯️ AmarJyoti
            </Link>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        {/* THE FIX IS ON THIS LINE */}
                        <span>Welcome, {user?.name || user?.email}!</span>
                        <Link to="/shop">Shop</Link>
                        <Link to="/cart">Cart ({totalItemsInCart})</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/orders">My Orders</Link>
                        {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;