import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();
    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default AdminRoute;