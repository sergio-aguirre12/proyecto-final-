// src/components/guardia/GuardiaIncidentesListado.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// ❌ ELIMINADAS: La importación de Navbar y LogoutButton
import { fetchAllIncidentes } from '../../services/Api.jsx'; 
import './GuardiaEntradaComponent.css'; // Asegúrate de que existe este CSS

const GuardiaIncidentesListado = ({ onReporteClick }) => {
    
    const [incidentes, setIncidentes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('pendiente'); // 'pendiente', 'resuelto', 'todos'

    // Función para cargar los incidentes
    const loadIncidentes = useCallback(async () => {
        try {
            const data = await fetchAllIncidentes(); // Llama a la API
            setIncidentes(data);
        } catch (err) {
            console.error("Error al cargar la lista de incidentes:", err);
            setError("🚨 Error al cargar los incidentes. ¿Está la API funcionando?");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadIncidentes();
    }, [loadIncidentes]);

    // Lógica de filtrado y ordenamiento
    const incidentesFiltrados = useMemo(() => {
        if (!incidentes) return [];

        // Ordenar por fecha/hora descendente (los más recientes primero)
        let lista = incidentes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        if (filtroEstado === 'todos') {
            return lista;
        }
        
        return lista.filter(incidente => incidente.estado === filtroEstado);
        
    }, [incidentes, filtroEstado]);

    
    // ----------------------------------------------------------------------
    // RENDERIZADO (Solo contenido: No hay Navbar ni LogoutButton aquí)
    // ----------------------------------------------------------------------
    if (isLoading) return <p className="loading-message">⏳ Cargando reportes de incidentes...</p>;
    if (error) return <p className="error-message">🚨 {error}</p>;

    return (
        <div className="incidentes-panel">
            
            <h2>⚠️ Listado de Incidentes Reportados ({incidentesFiltrados.length})</h2>
            
            <div className="incidentes-controles">
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="filtro-select-incidente"
                >
                    <option value="pendiente">Mostrar Pendientes</option>
                    <option value="resuelto">Mostrar Resueltos</option>
                    <option value="todos">Mostrar Todos</option>
                </select>

                <button 
                    className="btn-principal-incidente"
                    onClick={onReporteClick} // Llama a la función del padre para reportar un nuevo incidente
                >
                    + Nuevo Reporte
                </button>
            </div>
            
            <div className="incidentes-listado">
                {incidentesFiltrados.length === 0 ? (
                    <p className="no-results-incidente">
                        {filtroEstado === 'pendiente' ? 
                            "✅ ¡No hay incidentes pendientes! Buen trabajo." : 
                            "No se encontraron incidentes con este filtro."
                        }
                    </p>
                ) : (
                    incidentesFiltrados.map((item) => (
                        <div 
                            key={item.id} 
                            className={`incidente-card ${item.estado === 'pendiente' ? 'incidente-pendiente' : 'incidente-resuelto'}`}
                        >
                            <div className="incidente-header">
                                <strong>ID #{item.id}</strong> | 
                                <span className={`status-${item.estado}`}>
                                    {item.estado.toUpperCase()}
                                </span>
                            </div>
                            <p><strong>Fecha/Hora:</strong> {item.fecha} {item.hora || ''}</p>
                            <p><strong>Asunto:</strong> {item.asunto}</p>
                            <p className="incidente-detalle"><strong>Detalle:</strong> {item.descripcion}</p>
                            
                            {item.personalAsignado && (
                                <p className="incidente-asignado">Asignado a: {item.personalAsignado}</p>
                            )}
                            
                            {/* Botón de acción */}
                            {item.estado === 'pendiente' && (
                                <button className="btn-resolver">Resolver Incidente</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuardiaIncidentesListado;