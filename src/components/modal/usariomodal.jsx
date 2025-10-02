import React, { useState, useEffect } from 'react';
import "../modal/usariomodal.css"; 


const UsuarioModal = ({ onClose, onSave, usuarioInicial, isLoading, error }) => {
    // Si hay un usuarioInicial, estamos en modo Edición
    const isEditMode = !!usuarioInicial; 

    // Inicializamos el estado del formulario
    const [formData, setFormData] = useState({
        usuario: usuarioInicial?.usuario || '',
        password: '', 
        rol: usuarioInicial?.rol || 'guardia',
    });
    // El error ahora viene como prop del padre para reflejar errores de la API
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        // Reiniciar el formulario si el usuarioInicial cambia (ej: de editar a crear nuevo)
        setFormData({
            usuario: usuarioInicial?.usuario || '',
            password: '', 
            rol: usuarioInicial?.rol || 'guardia',
        });
        setLocalError('');
    }, [usuarioInicial]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(''); // Limpiamos errores locales

        // Validación básica (local)
        if (!formData.usuario || !formData.rol) {
            setLocalError('El nombre de usuario y el rol son obligatorios.');
            return;
        }

        if (!isEditMode && !formData.password) {
             setLocalError('La contraseña es obligatoria para un nuevo registro.');
             return;
        }

        // Llamamos a la función onSave (crear o editar)
        // onSave gestionará el estado de carga y el cierre si tiene éxito.
        onSave(usuarioInicial?.id, formData, isEditMode);
        
        // ⭐⭐⭐ CORRECCIÓN CLAVE: ELIMINAMOS ESTA LÍNEA ⭐⭐⭐
        // onClose(); // Comentamos o eliminamos esta línea
    };

    // Si tu modal es condicional, esta línea debe estar en el padre
    // if (!isOpen) return null; 

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>{isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h3>
                
                {/* Muestra errores locales y errores de la API pasados como prop */}
                {(localError || error) && <p className="error-modal" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    🚨 {localError || error}
                </p>}
                
                <form onSubmit={handleSubmit}>
                    
                    <label htmlFor="usuario-input">Usuario:</label>
                    <input
                        id="usuario-input"
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        placeholder="Nombre de usuario (ej: guardia1)"
                        required
                        disabled={isEditMode || isLoading}
                    />

                    <label htmlFor="password-input">
                        Contraseña {isEditMode ? '(Dejar vacío para no cambiar)' : '*'}:
                    </label>
                    <input
                        id="password-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={isEditMode ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                        required={!isEditMode} 
                        disabled={isLoading}
                    />

                    <label htmlFor="rol-select">Rol:</label>
                    <select
                        id="rol-select"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="guardia">Guardia</option>
                        <option value="admin">Administrador</option>
                    </select>

                    <div className="modal-actions">
                        <button type="submit" className="btn-guardar" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Registrar'}
                        </button>
                        <button 
                            type="button" 
                            className="btn-cancelar" 
                            onClick={onClose} 
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioModal;