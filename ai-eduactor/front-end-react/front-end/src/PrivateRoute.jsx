import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;