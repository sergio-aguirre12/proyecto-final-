import React, { useState, useEffect, useCallback } from 'react';
import { fetchPersonasPendientes } from '../../services/Api.jsx'; 
import './GuardiaEntradaComponent.css'; // 🚨 ASEGÚRATE DE USAR ESTE NOMBRE DE ARCHIVO CSS

const GuardiaPendientesListado = () => {
    const [pendientes, setPendientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNCIÓN: Carga los datos de las personas con status="pendiente"
    const cargarPendientes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Asume que esta función llama a /personas?status=pendiente
            const data = await fetchPersonasPendientes(); 
            setPendientes(data);
        } catch (err) {
            console.error("Error al cargar solicitudes pendientes:", err);
            setError("Error al cargar las solicitudes. Verifique el servidor y la ruta /personas?status=pendiente.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPendientes();
    }, [cargarPendientes]);

    // ---------------------------------------------
    
    if (isLoading) return <p className="loading-msg">⏳ Cargando solicitudes pendientes...</p>;
    if (error) return <p className="error-msg">🚨 {error}</p>;

    return (
        <div className="pendientes-panel-guardia">
            <h2>📝 Solicitudes de Registro Pendientes</h2>
            <p>Total de solicitudes esperando revisión del Administrador: **{pendientes.length}**</p>
            
            <div className="pendientes-listado-guardia">
                {pendientes.length === 0 ? (
                    <p className="sin-pendientes">✅ ¡No hay solicitudes pendientes en este momento!</p>
                ) : (
                    pendientes.map((persona) => (
                        <div key={persona.id} className="pendiente-card-guardia">
                            
                            <div className="foto-container-guardia">
                                {persona.foto ? (
                                    <img src={persona.foto} alt={`Foto de ${persona.nombre}`} className="persona-foto-guardia" />
                                ) : (
                                    <span className="no-foto-guardia">Sin Foto</span>
                                )}
                            </div>
                            
                            <div className="info-guardia">
                                <p><strong>ID:</strong> {persona.id}</p>
                                <p><strong>Nombre:</strong> {persona.nombre}</p>
                                <p><strong>Edad:</strong> {persona.edad}</p>
                                <p className="status-alerta-guardia">⚠️ Pendiente de Aprobación</p>
                            </div>

                            <div className="acciones-guardia">
                                <span className="admin-notice">
                                    Esta solicitud requiere revisión y aprobación del Administrador.
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuardiaPendientesListado;