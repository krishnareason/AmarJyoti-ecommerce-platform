import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, login } = useContext(AuthContext); 
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUserProfile(formData);
            login(localStorage.getItem('token'), res.data); 
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
            setMessage('Error updating profile.');
        }
    };

    if (!user) {
        return <div className="profile-page"><h2>Loading profile...</h2></div>;
    }

    return (
        <div className="profile-page">
            <h1>My Profile</h1>
            {message && <p className="success-message">{message}</p>}
            
            {isEditing ? (
                <form className="profile-card" onSubmit={handleSave}>
                    <div className="profile-detail">
                        <label className="detail-label" htmlFor="name">Full Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="detail-input"/>
                    </div>
                    <div className="profile-detail">
                        <label className="detail-label" htmlFor="email">Email Address:</label>
                        <input type="email" id="email" name="email" value={user.email} className="detail-input" disabled />
                    </div>
                    <div className="profile-detail">
                        <label className="detail-label" htmlFor="phone">Phone Number:</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="detail-input"/>
                    </div>
                    <div className="profile-detail">
                        <label className="detail-label" htmlFor="address">Shipping Address:</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="detail-input address-input"></textarea>
                    </div>
                    <div className="profile-buttons">
                        <button type="submit" className="btn-save">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="profile-card">
                    <div className="profile-detail">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">{user.name || 'Not provided'}</span>
                    </div>
                    {/* ... other details ... */}
                    <div className="profile-detail">
                        <span className="detail-label">Email Address:</span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="profile-detail">
                        <span className="detail-label">Phone Number:</span>
                        <span className="detail-value">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="profile-detail">
                        <span className="detail-label">Shipping Address:</span>
                        <span className="detail-value address-value">{user.address || 'Not provided'}</span>
                    </div>
                    <div className="profile-detail">
                        <span className="detail-label">User Role:</span>
                        <span className="detail-value role-value">{user.role}</span>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="btn-edit-profile">Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;