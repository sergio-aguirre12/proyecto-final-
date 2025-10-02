
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboard.jsx';
import GuardiaEntrada from '../pages/GuardiaEntrada.jsx';
import RoleGuard from '../components/RoleGuard.jsx';
import GuardiaPendientesListado from '../components/guardia/GuardiaPendientesListado.jsx';

const AppRouter = () => (

  
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />

    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin/dashboard"
      element={
        <RoleGuard allowedRoles={['admin']}>
          <AdminDashboardPage />
        </RoleGuard>
      }
    />

    <Route path="/login" element={<LoginPage />} />

    <Route
      path="/guardia/entrada"
      element={
        <RoleGuard allowedRoles={['guardia']}>
          <GuardiaEntrada /> 
        </RoleGuard>
      }
    />

    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRouter;