import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  console.log('user', user)

  if (!user) {
    return <Navigate to="/login" />;
  };

  return children;
};
export default PrivateRoute;
