import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // We will create this file next for styling

const LandingPage = () => {
    const navigate = useNavigate();

    // This function handles navigation and passes the selected role
    // to the signup page. This is a crucial piece of our logic.
    const handleNavigation = (role) => {
        navigate('/signup', { state: { userRole: role } });
    };

    return (
        <div className="landing-container">
            <div className="landing-overlay">
                <div className="landing-content">
                    <h1>AmarJyoti</h1>
                    <p>A serene flame for a tranquil soul.</p>
                    <div className="button-group">
                        <button onClick={() => handleNavigation('wholesaler')} className="btn btn-primary">
                            🏬 Shop as Wholesaler (B2B)
                        </button>
                        <button onClick={() => handleNavigation('consumer')} className="btn btn-secondary">
                            🛍️ Shop for Personal Use (D2C)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;