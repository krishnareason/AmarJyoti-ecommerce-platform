import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();

    // If still checking auth state, show loading
    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    // If user is not authenticated OR is not an admin, redirect them
    if (!isAuthenticated || user?.role !== 'admin') {
        // Redirect them to the login page, but save the location they were
        // trying to go to. This allows us to redirect them back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If they are an authenticated admin, render the component they wanted to see
    return children;
};

export default AdminRoute;