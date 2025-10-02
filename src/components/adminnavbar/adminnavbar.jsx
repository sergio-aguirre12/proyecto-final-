
import React from 'react';
import './AdminNavbar.css';
import LogoutButton from '../comon/LogoutButton.jsx';


const AdminNavbar = ({ onSelect, pendingNotificationsCount = 0 }) => {
  return (
    <nav className="admin-navbar">
      <h1>Panel Administrativo</h1>
      <div className="nav-links">

        <button onClick={() => onSelect("inicio")}>inicio</button>
        <button onClick={() => onSelect("usuarios")}>Gestión de Personas</button>
        <button onClick={() => onSelect("incidentes")}>Incidentes</button>
        <button onClick={() => onSelect("entradas")}>Reporte de Entradas</button>
        <button onClick={() => onSelect("cuentas")}>Registro de Cuentas</button>

        {/* 💥 Implementación del badge numérico 💥 */}
        <button
          onClick={() => onSelect("notificaciones")}
          className="notification-button-container" // Clase para el CSS 'position: relative'
        >
          Notificaciones
          {/* Renderiza el badge solo si el contador es mayor que cero */}
          {pendingNotificationsCount > 0 && (
            <span className="notification-badge">
              {pendingNotificationsCount}
            </span>
          )}
        </button>

        <LogoutButton />

      </div>
    </nav>
  );
};

export default AdminNavbar;