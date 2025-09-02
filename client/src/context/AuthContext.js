import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(true); 
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);
                API.defaults.headers.common['x-auth-token'] = storedToken;
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage", error);
        } finally {
            setLoading(false); 
        }
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false); 
        API.defaults.headers.common['x-auth-token'] = newToken;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false); 
        delete API.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };