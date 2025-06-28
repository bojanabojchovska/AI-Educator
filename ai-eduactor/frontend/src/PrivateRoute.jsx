import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Forbid USER from visiting /admin, but allow ADMIN everywhere
    if (role === 'USER' && location.pathname === '/admin') {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;
