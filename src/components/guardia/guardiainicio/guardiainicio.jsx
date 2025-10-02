// src/components/guardia/guardiainicio/GuardiaInicio.jsx

import React from 'react';
import './GuardiaInicio.css'; // Asume que crearás un archivo CSS para estilos

const GuardiaInicio = ({ 
    isLoading, 
    error, 
    dashboardMetrics, 
    ultimaEntradaAceptada, 
    onNavigateTo 
}) => {
    
    // Extrae las métricas del objeto
    const { 
        entradasAceptadasHoy = 0,
        personasAceptadas = 0,
        incidentesPendientes = 0,
    } = dashboardMetrics;

    // Componente de Tarjeta de Métrica (reutilizable)
    const MetricCard = ({ title, value, color, icon, targetSection, onClick }) => (
        <div 
            className="guardia-metric-card" 
            style={{ borderLeft: `5px solid ${color}` }}
            onClick={() => onClick(targetSection)}
        >
            <div className="card-content">
                <p className="card-title">{title}</p>
                <h3 className="card-value" style={{ color: color }}>{value}</h3>
            </div>
            <div className="card-icon">{icon}</div>
        </div>
    );

    return (
        <div className="guardia-inicio-container">
            <h2>Panel de Control de Guardia</h2>
            
            {isLoading && <p>Cargando datos del panel...</p>}
            {error && <p className="error-alerta-guardia">🚨 Error: {error}</p>}
            
            <div className="guardia-metrics-grid">
                
                {/* MÉTRICA 1: Entradas Aceptadas Hoy */}
                <MetricCard
                    title="Entradas Aceptadas Hoy"
                    value={entradasAceptadasHoy}
                    color="#007bff"
                    icon="🚶"
                    targetSection="entradas"
                    onClick={onNavigateTo}
                />

                {/* MÉTRICA 2: Personas Aceptadas/Con Acceso */}
                <MetricCard
                    title="Personas con Acceso (Aceptadas)"
                    value={personasAceptadas}
                    color="#28a745"
                    icon="✅"
                    targetSection="verificacion" // O la sección de búsqueda de acceso si existe
                    onClick={onNavigateTo}
                />
                
                {/* MÉTRICA 3: Incidentes Pendientes */}
                <MetricCard
                    title="Incidentes Abiertos (Pendientes)"
                    value={incidentesPendientes}
                    color="#dc3545"
                    icon="🚨"
                    targetSection="incidentes"
                    onClick={onNavigateTo}
                />
            </div>

            <div className="guardia-alerta-section">
                <h3>Última Verificación Exitosa</h3>
                {ultimaEntradaAceptada ? (
                    <div className="alerta-box success">
                        <p><strong>Último Ingreso Aceptado:</strong> {ultimaEntradaAceptada.nombrePersona}</p>
                        <p>ID: {ultimaEntradaAceptada.personaId} | Hora: {ultimaEntradaAceptada.hora}</p>
                        <button onClick={() => onNavigateTo("entradas")}>Ver Registro Completo</button>
                    </div>
                ) : (
                    <div className="alerta-box info">
                        <p>⚠️ No hay ingresos aceptados registrados el día de hoy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuardiaInicio;   