import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(true); // <-- ADDED loading state

    // This effect runs when the app loads to set the token for all API requests
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);
                // Set the token for all subsequent API requests
                API.defaults.headers.common['x-auth-token'] = storedToken;
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage", error);
        } finally {
            setLoading(false); // <-- ADDED: Set loading to false after check
        }
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false); // <-- ADDED: Set loading to false on login
        // Set the token for all subsequent API requests
        API.defaults.headers.common['x-auth-token'] = newToken;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false); // <-- ADDED: Set loading to false on logout
        // Remove the token from API request headers
        delete API.defaults.headers.common['x-auth-token'];
    };

    return (
        // ADDED 'loading' to the value
        <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };