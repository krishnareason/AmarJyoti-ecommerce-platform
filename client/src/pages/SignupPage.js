import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../api'; // The signup function from our api file
import './SignupPage.css'; // We will create this for styling

const SignupPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    // Get the role from the navigation state, default to 'consumer' if not found
    const userRole = location.state?.userRole || 'consumer';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');

    const { name, email, password, phone, address } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // We pass the form data PLUS the role to our signup function
            const res = await signup({ ...formData, role: userRole });
            
            // The backend returns a token and user object on success
            const { token, user } = res.data;

            // Use the login function from our AuthContext to update the state
            login(token, user);
            
            // Redirect to the shop page
            navigate('/shop');

        } catch (err) {
            // Set the error message from the backend response
            setError(err.response?.data?.msg || 'An error occurred during signup.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Register as a <span className="role-text">{userRole}</span></h2>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} required minLength="6" />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Shipping Address</label>
                    <textarea id="address" name="address" value={address} onChange={handleChange}></textarea>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit">Create Account</button>
            </form>
        </div>
    );
};

// This is the crucial line that was likely missing or incorrect
export default SignupPage;