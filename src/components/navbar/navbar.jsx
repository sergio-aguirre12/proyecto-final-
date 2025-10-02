// src/components/Navbar.jsx

import React from "react";
import "./Navbar.css";
import LogoutButton from "../comon/LogoutButton.jsx"; 

const Navbar = ({ onSelect }) => {
    return (
        <nav className="navbar">
            {/* BOTONES DE NAVEGACIÓN */}
            <button className="nav-item" onClick={() => onSelect("inicio")}>Inicio</button>
            <button className="nav-item" onClick={() => onSelect("entrada")}>Verificar Acceso</button>
            <button className="nav-item" onClick={() => onSelect("registro")}>Registro de Persona</button>
            
            {/* BOTÓN DE PENDIENTES */}
            <button className="nav-item" onClick={() => onSelect("pendientes")}>Pendientes de Registro</button> 
            
            <button className="nav-item" onClick={() => onSelect("notificaciones")}>Notificaciones</button>
            <button className="nav-item" onClick={() => onSelect("incidentes")}>Reportar Incidente</button>
            
            {/* CERRAR SESIÓN (Manejado internamente por el componente) */}
            <LogoutButton />
        </nav>
    );
};

export default Navbar;