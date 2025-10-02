import React from 'react';
import './AdminInicio.css';

const AdminInicio = ({ isLoading, error, dashboardMetrics, onNavigateTo }) => {


    const {
        ingresosHoy,
        incidentesPendientes,
        rechazados,
        edadPromedio,
        personasPendientesAprobacion,
        ultimaEntradaAceptada,
    } = dashboardMetrics;

    // Función para manejar la navegación desde los botones de las tarjetas
    const handleNavigation = (seccion, filtro = null) => {
        if (onNavigateTo) {
            onNavigateTo(seccion, filtro);
        }
    };

    if (isLoading) {
        return <div className="admin-inicio-container"><h2>Cargando datos del Dashboard...</h2></div>;
    }

    if (error) {
        return <div className="admin-inicio-container"><h2 className="error-message">Error de conexión: {error}</h2></div>;
    }

    return (
        <div className="admin-inicio-container">
            <h1>Panel de Control (Dashboard)</h1>
            <p className="fecha-actualizacion">
                Última actualización: {new Date().toLocaleTimeString()}
            </p>

            {/* --- Sección de Métricas Clave (Cards) --- */}
            <div className="metricas-grid">
                
                {/* Ingresos Hoy */}
                <div className="card ingreso-hoy" onClick={() => handleNavigation('entradas')}>
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                        <p className="card-title">Ingresos Hoy</p>
                        <p className="card-value">{ingresosHoy}</p>
                    </div>
                </div>

                {/*  Incidentes Pendientes */}
                <div className="card incidente-pendiente" onClick={() => handleNavigation('incidentes', 'pendiente')}>
                    <div className="card-icon">🚨</div>
                    <div className="card-content">
                        <p className="card-title">Incidentes Pendientes</p>
                        <p className="card-value">{incidentesPendientes}</p>
                    </div>
                </div>

                {/*  Rechazos Hoy */}
                <div className="card rechazos-hoy" onClick={() => handleNavigation('entradas')}>
                    <div className="card-icon">🚫</div>
                    <div className="card-content">
                        <p className="card-title">Rechazos Hoy</p>
                        <p className="card-value">{rechazados}</p>
                    </div>
                </div>

                {/* 4. Edad Promedio de Aceptados */}
                <div className="card edad-promedio">
                    <div className="card-icon">👤</div>
                    <div className="card-content">
                        <p className="card-title">Edad Promedio Aceptados</p>
                        <p className="card-value">{edadPromedio} años</p>
                    </div>
                </div>
            </div>

            {/* --- Sección de Alertas y Últimos Movimientos --- */}
            <div className="alertas-movimientos-grid">
                
                {/* Panel de Alertas y Tareas Pendientes */}
                <div className="panel-tareas">
                    <h2>Tareas Pendientes</h2>
                    
                    {/* Alerta de Personas Pendientes */}
                    <div className={`alerta-item ${personasPendientesAprobacion > 0 ? 'alerta-warning' : 'alerta-success'}`}>
                        <p>👤 Personas por aprobar:</p>
                        <strong className="alerta-count">{personasPendientesAprobacion}</strong>
                        {personasPendientesAprobacion > 0 && (
                             <button onClick={() => handleNavigation('usuarios', 'pendiente')}>
                                Revisar
                             </button>
                        )}
                    </div>

                    {/* Alerta de Incidentes */}
                    <div className={`alerta-item ${incidentesPendientes > 0 ? 'alerta-danger' : 'alerta-info'}`}>
                        <p>🚨 Incidentes sin resolver:</p>
                        <strong className="alerta-count">{incidentesPendientes}</strong>
                        {incidentesPendientes > 0 && (
                            <button onClick={() => handleNavigation('incidentes', 'pendiente')}>
                                Resolver
                            </button>
                        )}
                    </div>
                </div>

                {/* Panel de Último Ingreso Aceptado */}
                <div className="panel-ultimo-movimiento">
                    <h2>Último Ingreso Aceptado</h2>
                    {ultimaEntradaAceptada ? (
                        <div className="movimiento-detalle">
                            <p><strong>{ultimaEntradaAceptada.nombrePersona}</strong></p>
                            <p>ID: {ultimaEntradaAceptada.personaId}</p>
                            <p className="movimiento-time">
                                📅 {ultimaEntradaAceptada.fecha} a las {ultimaEntradaAceptada.hora}
                            </p>
                            <button className="btn-ver-log" onClick={() => handleNavigation('entradas')}>
                                Ver Log Completo
                            </button>
                        </div>
                    ) : (
                        <p className="no-data">No se han registrado ingresos aceptados hoy.</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminInicio;