import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ children, allowedRoles }) => {
  const storedUser = localStorage.getItem('usuario');
  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('usuario');
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/login" />; 
  }

  return children;
};

export default RoleGuard;