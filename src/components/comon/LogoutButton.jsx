import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../comon/LogoutButton.css";

const LogoutButton = () => {
    // Obtiene la función de navegación
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina la clave de autenticación del almacenamiento local
        localStorage.removeItem('usuario'); 
        
        // Redirige a la ruta de inicio de sesión
        navigate('/login'); 
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;