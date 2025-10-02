import React, { useEffect, useState, useMemo, useCallback } from "react";
import AdminInicio from "../../components/admin/adminincio/AdminInicio.jsx"; 
import AdminNavbar from "../../components/adminnavbar/adminnavbar.jsx";
import LogoutButton from "../../components/comon/LogoutButton.jsx"; 
import IncidenteDetalleModal from "../../components/modal/insidentedetallemodal.jsx";
import UsuarioModal from "../../components/modal/usariomodal.jsx";
import NotificationsComponent from "../../components/admin/notifications/notifications.jsx";
import "./AdminDashboard.css";
import {
    fetchPersonas,
    updatePersonaStatus,
    deletePersona,
    fetchAllIncidentes,
    fetchEntradas,
    updateIncidenteStatus,
    fetchUsuarios,
    postUsuario,
    updateUsuario,
    deleteUsuario,
} from "../../services/Api.jsx";

const AdminDashboard = () => {
    const [seccion, setSeccion] = useState("inicio");
    const [personas, setPersonas] = useState([]);
    const [incidentesCargados, setIncidentesCargados] = useState([]);
    const [entradas, setEntradas] = useState([]); 
    const [ultimaEntradaAceptada, setUltimaEntradaAceptada] = useState(null); 
    const [usuarios, setUsuarios] = useState([]);
    const [filtroPersona, setFiltroPersona] = useState("pendiente");
    const [filtroIncidente, setFiltroIncidente] = useState("pendiente");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioModalAbierto, setUsuarioModalAbierto] = useState(false);
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);

    const parseNotas = useCallback((notas) => {
        if (!notas) return [];
        const partes = notas.split('\n');
        return partes
            .map((part, index) => {
                const trimmedPart = part.trim();
                if (!trimmedPart) return null;
                const parts = trimmedPart.split(':');
                const clave = parts[0]?.trim();
                const valor = parts.slice(1).join(':').trim();
                return { clave: clave || `Detalle ${index + 1}`, valor: valor || clave };
            })
            .filter(item => item !== null);
    }, []);

    const cargarDatos = useCallback(async (currentSeccion, currentFiltroPersona) => {
        setError(null);
        setIsLoading(true);
        try {
            const todasPersonas = await fetchPersonas();
            setPersonas(todasPersonas);
            const personasMap = new Map(todasPersonas.map(p => [p.id, p]));

            if (["incidentes","notificaciones","inicio"].includes(currentSeccion)) {
                const todosLosIncidentes = await fetchAllIncidentes();
                setIncidentesCargados(todosLosIncidentes.map(inc => {
                    const persona = personasMap.get(inc.personaId);
                    return { ...inc, nombrePersona: persona?.nombre || "Desconocido", idPersona: inc.personaId || "N/A" };
                }));
            }

            if (["entradas","notificaciones","inicio"].includes(currentSeccion)) {
                const entradasData = await fetchEntradas();
                const entradasEnriquecidas = entradasData.map(e => {
                    const persona = personasMap.get(e.personaId);
                    return { ...e, nombrePersona: persona?.nombre || "Desconocido", statusPersona: persona?.status || "N/A" };
                });
                setEntradas(entradasEnriquecidas);
                const ultimaAceptada = entradasEnriquecidas.filter(e => e.aceptado)
                    .sort((a,b) => new Date(`${b.fecha} ${b.hora}`) - new Date(`${a.fecha} ${a.hora}`))[0];
                setUltimaEntradaAceptada(ultimaAceptada || null);
            }

            if (["cuentas","inicio"].includes(currentSeccion)) {
                setUsuarios(await fetchUsuarios());
            }
        } catch (err) {
            console.error(err);
            setError("🚨 Error al cargar datos. ¿Está corriendo su JSON-Server?");
            setPersonas([]);
            setIncidentesCargados([]);
            setEntradas([]);
            setUsuarios([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { cargarDatos(seccion, filtroPersona); }, [seccion, filtroPersona, cargarDatos]);

    const pendientesPersonaCount = useMemo(() => (personas || []).filter(p => p.status === 'pendiente').length, [personas]);
    const pendientesIncidenteCount = useMemo(() => (incidentesCargados || []).filter(i => i.estado === 'pendiente').length, [incidentesCargados]);
    const pendingNotificationsCount = useMemo(() => pendientesPersonaCount + pendientesIncidenteCount, [pendientesPersonaCount, pendientesIncidenteCount]);

    const personasFiltradas = useMemo(() => {
        return (personas || []).filter(p => {
            const term = searchTerm.toLowerCase();
            const nombre = p.nombre?.toLowerCase() || "";
            const id = p.id?.toLowerCase() || "";
            return p.status === filtroPersona && (!term || nombre.includes(term) || id.includes(term));
        });
    }, [personas, filtroPersona, searchTerm]);

    const incidentesFiltrados = useMemo(() => {
        return (incidentesCargados || []).filter(inc => filtroIncidente === "todos" || inc.estado === filtroIncidente);
    }, [incidentesCargados, filtroIncidente]);

    const usuariosFiltrados = useMemo(() => {
        return (usuarios || []).filter(u => {
            const term = searchTerm.toLowerCase();
            return u.usuario?.toLowerCase().includes(term) || u.rol?.toLowerCase().includes(term);
        });
    }, [usuarios, searchTerm]);

    const handleSelectSection = (seccionName) => { setSeccion(seccionName); setSearchTerm(""); };

    const manejarAceptar = async (id) => { await updatePersonaStatus(id,"aceptado"); await cargarDatos(seccion,filtroPersona); setError(null); };
    const manejarRechazar = async (id) => { await updatePersonaStatus(id,"rechazado"); await cargarDatos(seccion,filtroPersona); setError(null); };
    const manejarEliminar = async (id) => { if(window.confirm("¿Seguro que quieres eliminar esta persona?")) { await deletePersona(id); await cargarDatos(seccion,filtroPersona); setError(null); }};

    const manejarResolverIncidente = async (id) => { if(window.confirm("Confirma que desea resolver este incidente?")) { await updateIncidenteStatus(id,"resuelto"); await cargarDatos(seccion,filtroPersona); setError(null); }};
    const manejarVerDetalle = (incidente) => { setIncidenteSeleccionado(incidente); setModalAbierto(true); };
    const manejarCerrarModal = () => { setModalAbierto(false); setIncidenteSeleccionado(null); };

    const manejarCrearUsuario = () => { setUsuarioAEditar(null); setUsuarioModalAbierto(true); };
    const manejarAbrirEditarUsuario = (usuario) => { setUsuarioAEditar(usuario); setUsuarioModalAbierto(true); };
    const manejarCerrarUsuarioModal = () => { setUsuarioModalAbierto(false); setUsuarioAEditar(null); setError(null); };

    const manejarGuardarUsuario = async (id, formData, isEditMode) => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const datosActualizados = { rol: formData.rol };
                if (formData.password) datosActualizados.password = formData.password;
                await updateUsuario(id, datosActualizados);
            } else await postUsuario(formData);
            await cargarDatos("cuentas"); 
            manejarCerrarUsuarioModal();
            setError(null);
        } catch { setError(`Error al ${isEditMode ? 'editar' : 'crear'} el usuario. Revise su API.`); }
        finally { setIsLoading(false); }
    };

    const manejarEliminarUsuario = async (id, usuario) => { if(window.confirm(`¿Seguro que desea eliminar el usuario ${usuario}?`)) { setIsLoading(true); await deleteUsuario(id); await cargarDatos("cuentas"); setError(null); setIsLoading(false); }};

    const renderContenido = () => {
        const entradasFiltradas = (entradas || []).filter(e => {
            const term = searchTerm.toLowerCase();
            const nombre = e.nombrePersona?.toLowerCase() || "";
            const id = e.personaId?.toLowerCase() || "";
            return !term || nombre.includes(term) || id.includes(term);
        });

        const dashboardMetrics = { 
            personasPendientes: pendientesPersonaCount,
            incidentesPendientes: pendientesIncidenteCount,
            entradasHoy: entradas.filter(e => e.fecha === new Date().toISOString().split('T')[0]).length,
            usuariosTotales: usuarios.length,
        };

        switch (seccion) {
            case "inicio":
                return <AdminInicio isLoading={isLoading} error={error} dashboardMetrics={dashboardMetrics} onNavigateTo={(s,f) => { setSeccion(s); if(f) { if(s==='usuarios') setFiltroPersona(f); if(s==='incidentes') setFiltroIncidente(f); }}} ultimaEntradaAceptada={ultimaEntradaAceptada} />;

            case "usuarios":
                return (
                    <div>
                        <h2>Gestión de Personas</h2>
                        <p>Filtrar por estado:</p>
                        <div className="menu-filtros">
                            <button onClick={() => setFiltroPersona("pendiente")} style={{ fontWeight: filtroPersona === 'pendiente' ? 'bold' : 'normal' }}>Pendientes ({pendientesPersonaCount})</button>
                            <button onClick={() => setFiltroPersona("aceptado")} style={{ fontWeight: filtroPersona === 'aceptado' ? 'bold' : 'normal' }}>Aceptados</button>
                            <button onClick={() => setFiltroPersona("rechazado")} style={{ fontWeight: filtroPersona === 'rechazado' ? 'bold' : 'normal' }}>Rechazados</button>
                        </div>
                        <input type="text" placeholder="Buscar por nombre o cédula..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="busqueda-input"/>
                        <div className="personas-listado">
                            {isLoading && <p>Cargando personas...</p>}
                            {!isLoading && personasFiltradas.length === 0 ? <p>No hay personas para mostrar en el estado: {filtroPersona}.</p> : 
                                personasFiltradas.map(p => (
                                    <div key={p.id} className="pendiente-item">
                                        <p><strong>Nombre:</strong> {p.nombre}</p>
                                        <p><strong>ID:</strong> {p.id}</p>
                                        {p.foto && <img src={p.foto} alt="foto" width="120" />}
                                        {filtroPersona === "pendiente" && (<><button onClick={() => manejarAceptar(p.id)}>Aceptar</button><button onClick={() => manejarRechazar(p.id)}>Rechazar</button></>)}
                                        <button onClick={() => manejarEliminar(p.id)}>Eliminar</button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                );

            case "incidentes":
                return (
                    <div>
                        <h2>Incidentes Reportados</h2>
                        <p>Filtrar por estado:</p>
                        <div className="menu-filtros">
                            <button onClick={() => setFiltroIncidente("todos")}>Todos</button>
                            <button onClick={() => setFiltroIncidente("pendiente")}>Pendientes ({pendientesIncidenteCount})</button>
                            <button onClick={() => setFiltroIncidente("resuelto")}>Resueltos</button>
                        </div>
                        {isLoading && <p>Cargando incidentes...</p>}
                        {!isLoading && incidentesFiltrados.length === 0 ? <p>No hay incidentes para mostrar en este filtro ({filtroIncidente}).</p> : 
                            incidentesFiltrados.map(inc => {
                                const isResolved = inc.estado === 'resuelto';
                                return (
                                    <div key={inc.id} className={`incidente-item ${isResolved ? 'incidente-resuelto' : ''}`}>
                                        <p><strong>ID Incidente:</strong> {inc.id}</p>
                                        <p><strong>Persona:</strong> {inc.nombrePersona} (ID: {inc.idPersona})</p>
                                        <p><strong>Fecha/Hora:</strong> {inc.fecha} - {inc.hora}</p>
                                        <p><strong>Estado:</strong> {inc.estado}</p>
                                        {inc.gravedad && <p><strong>Gravedad:</strong> {inc.gravedad}</p>}
                                        <div className="incidente-acciones">
                                            {isResolved ? <span className="mensaje-resuelto">RESUELTO ✓</span> : <>
                                                <button onClick={() => manejarResolverIncidente(inc.id)}>Resolver</button>
                                                <button onClick={() => manejarVerDetalle(inc)}>Ver Detalle</button>
                                            </>}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                );

            case "entradas":
                return (
                    <div>
                        <h2>Reporte de Entradas</h2>
                        <input type="text" placeholder="Buscar por nombre o cédula..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="busqueda-input"/>
                        {isLoading && <p>Cargando registros de entradas...</p>}
                        {!isLoading && entradasFiltradas.length === 0 ? <p>No hay registros de entradas para mostrar.</p> :
                            <div className="entradas-listado">
                                {entradasFiltradas.map(e => (
                                    <div key={e.id} className="entrada-item">
                                        <p><strong>ID Entrada:</strong> {e.id}</p>
                                        <p><strong>Persona:</strong> {e.nombrePersona} (ID: {e.personaId})</p>
                                        <p><strong>Estado Persona:</strong> <span className={e.statusPersona === 'aceptado' ? 'status-aceptado' : e.statusPersona === 'rechazado' ? 'status-rechazado' : 'status-NA'}>{e.statusPersona}</span></p>
                                        <p><strong>Fecha/Hora:</strong> {e.fecha} - {e.hora}</p>
                                        <p><strong>Incidente Reportado:</strong> <span className={e.incidente ? 'reporte-si' : 'reporte-no'}>{e.incidente ? 'Sí' : 'No'}</span></p>
                                        <p><strong>Aceptado (por guardia):</strong> <span className={e.aceptado ? 'reporte-si' : 'reporte-no'}>{e.aceptado ? 'Sí' : 'No'}</span></p>
                                        <p><strong>Notas:</strong> {e.notas || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                );

            case "cuentas":
                return (
                    <div>
                        <h2>Registro de Cuentas (Admin/Guardia)</h2>
                        <button onClick={manejarCrearUsuario} className="btn-crear-usuario">Crear Nuevo Usuario</button>
                        <input type="text" placeholder="Buscar por usuario o rol..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="busqueda-input" style={{ marginTop: '10px' }}/>
                        {isLoading && <p>Cargando usuarios...</p>}
                        {!isLoading && usuariosFiltrados.length === 0 ? <p>No hay usuarios para mostrar.</p> :
                            <div className="usuarios-listado" style={{ marginTop: '20px' }}>
                                {usuariosFiltrados.map(u => (
                                    <div key={u.id} className="usuario-item pendiente-item">
                                        <p><strong>ID:</strong> {u.id}</p>
                                        <p><strong>Usuario:</strong> {u.usuario}</p>
                                        <p><strong>Rol:</strong> <span style={{ color: u.rol === 'admin' ? '#007bff' : '#28a745' }}>{u.rol}</span></p>
                                        <button onClick={() => manejarAbrirEditarUsuario(u)}>Editar</button>
                                        <button onClick={() => manejarEliminarUsuario(u.id, u.usuario)}>Eliminar</button>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                );

            case "notificaciones":
                return (
                    <div>
                        <h2>🔔 Notificaciones y Alertas ({pendingNotificationsCount} Pendientes)</h2>
                        <p>Alertas importantes y acciones pendientes del sistema:</p>
                        <div className="notificaciones-listado" style={{ marginTop: '20px' }}>
                            {ultimaEntradaAceptada && (
                                <NotificationsComponent
                                    title="ÚLTIMO INGRESO ACEPTADO:"
                                    text={`${ultimaEntradaAceptada.nombrePersona} ID: ${ultimaEntradaAceptada.personaId}`}
                                    text2={`Registrado el ${ultimaEntradaAceptada.fecha} a las ${ultimaEntradaAceptada.hora}.`}
                                    textButton="Ver Log"
                                    functionButton={() => setSeccion("entradas")}
                                    bgColor="#e6ffed"      
                                    color="#155724"       
                                    borderColor="#c3e6cb"
                                    buttonIcon={'🟢'}  
                                />
                            )}
                            <NotificationsComponent
                                title="Nueva Persona:"
                                text={`¡Tienes **${pendientesPersonaCount}** solicitudes de personas pendientes de aprobación!`}
                                textButton="Revisar"
                                functionButton={() => { setSeccion("usuarios"); setFiltroPersona("pendiente"); }}
                                bgColor="#fff3cd"
                                color="#856404"
                                borderColor="#ffeeba"
                                buttonIcon={'🟡'}
                            />
                            <NotificationsComponent
                                title="Prioridad:"
                                text={`¡Tienes **${pendientesIncidenteCount}** incidentes sin resolver!`}
                                textButton="Ver Incidentes"
                                functionButton={() => { setSeccion("incidentes"); setFiltroIncidente("pendiente"); }}
                                bgColor="#f8d7da"      
                                color="#721c24"      
                                borderColor="#f5c6cb"  
                                buttonIcon={'🔴'}
                            />
                            <NotificationsComponent
                                title="Sistema:"
                                text={`Datos de personas e incidentes actualizados correctamente. (Última carga: ${new Date().toLocaleTimeString()})`}
                                bgColor="#e2e3e5"     
                                color="#383d41"       
                                borderColor="#d6d8db"  
                                buttonIcon={'⚪'}
                            />
                        </div>
                    </div>
                );

            default:
                return <h2>Sección no encontrada</h2>;
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminNavbar onSelect={handleSelectSection} pendingNotificationsCount={pendingNotificationsCount} />
            <div className="dashboard-content">
                {error && <p className="error-general">{error}</p>}
                {renderContenido()}
            </div>
            {modalAbierto && incidenteSeleccionado && <IncidenteDetalleModal incidente={incidenteSeleccionado} onClose={manejarCerrarModal} parseNotas={parseNotas} />}
            {usuarioModalAbierto && <UsuarioModal onClose={manejarCerrarUsuarioModal} onSave={manejarGuardarUsuario} usuario={usuarioAEditar} />}
        </div>
    );
};

export default AdminDashboard;
