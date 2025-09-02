import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as userLoginApi, adminLogin as adminLoginApi } from '../api';
import './SignupPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let res;
            if (isAdminLogin) {
                res = await adminLoginApi(formData);
            } else {
                res = await userLoginApi(formData);
            }
            const { token, user } = res.data;
            login(token, user);
            navigate('/shop');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during login.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
                </div>

                <div className="form-group-checkbox">
                    <input
                        type="checkbox"
                        id="isAdminLogin"
                        checked={isAdminLogin}
                        onChange={(e) => setIsAdminLogin(e.target.checked)}
                    />
                    <label htmlFor="isAdminLogin">Log in as Admin</label>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit">Login</button>
                
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

const checkboxStyle = `
.form-group-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}
.form-group-checkbox input {
    width: auto;
}
.form-group-checkbox label {
    margin-bottom: 0;
    font-weight: normal;
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = checkboxStyle;
document.head.appendChild(styleSheet);

export default LoginPage;