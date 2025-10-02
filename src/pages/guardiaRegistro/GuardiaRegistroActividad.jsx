import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAllAccesos } from '../../services/Api.jsx'; 
import './GuardiaEntradaComponent.css'; 

const GuardiaRegistroActividad = ({ onVolver }) => {
    // ESTADOS
    const [logCompleto, setLogCompleto] = useState([]); // Almacena todos los logs brutos
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroDia, setFiltroDia] = useState('hoy'); // 'hoy' o 'todo'
    const [filtroTexto, setFiltroTexto] = useState(''); // Para búsqueda por nombre/cédula

    // Función para cargar TODOS los accesos
    const loadLog = useCallback(async () => {
        try {
            // Usa la función fetchAllAccesos que ya corrigimos en Api.jsx
            const data = await fetchAllAccesos(); 
            setLogCompleto(data);
        } catch (err) {
            console.error("Error al cargar el historial de accesos:", err);
            setError("🚨 Error al cargar el historial de accesos. ¿Está el servidor activo?");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLog();
    }, [loadLog]);

  
    // LÓGICA DE FILTRADO Y BÚSQUEDA (useMemo)
    
    const logsFiltrados = useMemo(() => {
        if (!logCompleto || logCompleto.length === 0) return [];

        let logs = logCompleto;
        const hoy = new Date().toISOString().split('T')[0];
        
        //  FILTRO POR FECHA (Hoy vs. Todo)
        if (filtroDia === 'hoy') {
            logs = logs.filter(item => item.fecha && item.fecha.startsWith(hoy));
        }

        //  FILTRO POR TEXTO (Búsqueda por Cédula o Nombre)
        if (filtroTexto) {
            const textoBuscado = filtroTexto.toLowerCase();
            logs = logs.filter(item => 
                (item.nombrePersona && item.nombrePersona.toLowerCase().includes(textoBuscado)) ||
                (item.cedula && item.cedula.toString().includes(textoBuscado))
            );
        }
        
        // Ordenar por fecha (más reciente primero)
        logs.sort((a, b) => {
            const dateA = new Date(`${a.fecha} ${a.hora || '00:00'}`);
            const dateB = new Date(`${b.fecha} ${b.hora || '00:00'}`);
            return dateB - dateA; 
        });
        
        return logs;
    }, [logCompleto, filtroDia, filtroTexto]);
    
  
    // RENDERIZADO
   
    if (isLoading) return <p className="loading-message">⏳ Cargando registros de actividad...</p>;
    if (error) return <p className="error-message">🚨 {error}</p>;

    return (
        <div className="log-panel">
            <h2>📜 Registro de Actividad y Logs</h2>
            
            {/* --- CONTROLES DE FILTRADO --- */}
            <div className="log-controles">
                <input
                    type="text"
                    placeholder="Buscar nombre o cédula..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                    className="filtro-input"
                />

                <select
                    value={filtroDia}
                    onChange={(e) => setFiltroDia(e.target.value)}
                    className="filtro-select"
                >
                    <option value="hoy">Entradas de HOY</option>
                    <option value="todo">Todo el Historial</option>
                </select>
                
                <button 
                    className="btn-secondary"
                    onClick={onVolver}
                >
                    ← Volver
                </button>
            </div>
            
            <p className="log-resumen">Mostrando **{logsFiltrados.length}** registros de actividad.</p>

            {/* --- LISTADO --- */}
            <div className="log-listado">
                {logsFiltrados.length === 0 ? (
                    <p className="no-results">No se encontraron registros que coincidan con los filtros.</p>
                ) : (
                    logsFiltrados.map((item) => (
                        <div 
                            key={item.id} 
                            className={`log-item ${item.aceptado ? 'log-aceptado' : 'log-denegado'}`}
                        >
                            <p><strong>Fecha/Hora:</strong> {item.fecha} {item.hora}</p>
                            <p><strong>Cédula:</strong> {item.cedula}</p>
                            <p><strong>Nombre:</strong> {item.nombrePersona || 'Desconocido'}</p>
                            <p>
                                <strong>Resultado:</strong> 
                                <span className={item.aceptado ? 'status-aceptado' : 'status-denegado'}>
                                    {item.aceptado ? 'ACCESO CONCEDIDO' : 'ACCESO DENEGADO'}
                                </span>
                            </p>
                            <p><strong>Motivo/Nota:</strong> {item.motivo || 'N/A'}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuardiaRegistroActividad;