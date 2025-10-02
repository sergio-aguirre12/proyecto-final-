import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../comon/LogoutButton.css";

const LogoutButton = () => {
    // 1. Obtiene la función de navegación
    const navigate = useNavigate();

    const handleLogout = () => {
        // 2. Elimina la clave de autenticación del almacenamiento local
        localStorage.removeItem('usuario'); 
        
        // 3. Redirige a la ruta de inicio de sesión
        navigate('/login'); 
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;