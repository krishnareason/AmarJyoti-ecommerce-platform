import React from 'react';
import './Footer.css'; 
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} AmarJyoti. All Rights Reserved.</p>
                <p>A serene flame for a tranquil soul.</p>
            </div>
        </footer>
    );
};

export default Footer;