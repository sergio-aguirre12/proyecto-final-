import React, { useState, useMemo, useCallback, useEffect } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import CheckEntry from "../../components/checkentry/checkentry.jsx";
import FormRegister from "../../components/registro/FormRegister.jsx";
import ReportarIncidente from "../../components/incidents/IncidentReport.jsx";

import GuardiaIncidentesListado from "../guardiaIncidentes/GuardiaIncidentesListado.jsx";
import GuardiaPendientesListado from "../guardiaPendientes/GuardiaPendientesListado.jsx";
import GuardiaRegistroActividad from "../guardiaRegistro/GuardiaRegistroActividad.jsx";
import GuardiaInicio from "../guardiainicio/guardiainicio.jsx"; 
import NotificacionesGuardia from "../../pages/NotificationsGuard/NotificationsGuard.jsx"


import { 
    fetchPersonas, 
    fetchAllIncidentes, 
    fetchEntradas 
} from "../../services/Api.jsx"; 

const GuardiaEntrada = () => {
    // ESTADOS 
    const [seccion, setSeccion] = useState("inicio"); // Estado inicial restaurado a "inicio"
    const [personas, setPersonas] = useState([]);
    const [incidentesCargados, setIncidentesCargados] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [ultimaEntradaAceptada, setUltimaEntradaAceptada] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- LÓGICA DE CARGA DE DATOS (useCallback & useEffect) ---
    const cargarDatos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const todasPersonas = await fetchPersonas();
            setPersonas(todasPersonas);
            const personasMap = new Map(todasPersonas.map(p => [p.id, p]));

            const todosLosIncidentes = await fetchAllIncidentes();
            setIncidentesCargados(todosLosIncidentes);

            const entradasData = await fetchEntradas();
            const entradasEnriquecidas = entradasData.map(entrada => {
                const personaEncontrada = personasMap.get(entrada.personaId);
                return {
                    ...entrada,
                    nombrePersona: personaEncontrada ? personaEncontrada.nombre : "Desconocido",
                    statusPersona: personaEncontrada ? personaEncontrada.status : "N/A"
                };
            });
            setEntradas(entradasEnriquecidas);

            // Última Entrada Aceptada
            const ultimaAceptada = entradasEnriquecidas
                .filter(e => e.aceptado)
                .sort((a, b) => new Date(`${b.fecha} ${b.hora}`) - new Date(`${a.fecha} ${a.hora}`))[0];
            setUltimaEntradaAceptada(ultimaAceptada || null);

        } catch (err) {
            console.error("Error al cargar datos del guardia:", err);
            setError("🚨 Error de conexión. No se pudieron cargar las métricas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);


    //CÁLCULO DE MÉTRICAS (USEMEMO) 
    const personasAceptadasCount = useMemo(() => 
        (personas || []).filter(p => p.status === 'aceptado').length, 
    [personas]);

    const incidentesPendientesArr = useMemo(() => 
        (incidentesCargados || []).filter(i => i.estado === 'pendiente'), 
    [incidentesCargados]);

    const incidentesPendientesCount = incidentesPendientesArr.length;
    const incidentesPendientesIDs = incidentesPendientesArr.map(i => i.id);

    const pendientesRegistroCount = useMemo(() => 
        (personas || []).filter(p => p.status === 'pendiente').length, 
    [personas]);

    const entradasAceptadasHoy = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return (entradas || []).filter(e => e.fecha === today && e.aceptado).length;
    }, [entradas]);
    
    // Alertas de Acceso Denegado
    const alertasDeAccesoCount = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return (entradas || []).filter(e => e.fecha === today && e.aceptado === false).length;
    }, [entradas]);

    // Total de notificaciones para el Navbar badge
    const pendingNotificationsCount = incidentesPendientesCount + pendientesRegistroCount;


    // --- FUNCIONES DE NAVEGACIÓN Y CRUD ---
    const handleRedireccionAReporte = () => {
        setSeccion("incidentes");
    };
    
    const setSeccionConLimpieza = (seccionName) => {
        setSeccion(seccionName);
    };

    // --- RENDERIZADO DEL CONTENIDO DINÁMICO ---
    const renderContenido = () => {
        // Métricas para GuardiaInicio
        const guardiaMetrics = { 
            entradasAceptadasHoy: entradasAceptadasHoy,
            personasAceptadas: personasAceptadasCount,
            incidentesPendientes: incidentesPendientesCount,
        };

        switch (seccion) {
            case "inicio":
                return (
                    <GuardiaInicio
                        isLoading={isLoading}
                        error={error}
                        dashboardMetrics={guardiaMetrics}
                        ultimaEntradaAceptada={ultimaEntradaAceptada}
                        onNavigateTo={setSeccionConLimpieza}
                    />
                );
            case "verificacion":
            case "entrada": 
                return <CheckEntry />;
            case "registro":
                return <FormRegister />;

            case "pendientes":
                return <GuardiaPendientesListado />;

            case "registro_actividad":
                return <GuardiaRegistroActividad onVolver={() => setSeccionConLimpieza("notificaciones")} />;

            case "mis-incidentes":
                return <GuardiaIncidentesListado onReporteClick={handleRedireccionAReporte} />;

            case "notificaciones":
                return (
                    <NotificacionesGuardia 
                        onNavigate={setSeccionConLimpieza} 
                        incidentesPendientesCount={incidentesPendientesCount}
                        pendientesRegistroCount={pendientesRegistroCount}
                        alertasDeAccesoCount={alertasDeAccesoCount}
                        incidentesPendientesIDs={incidentesPendientesIDs}
                    />
                );

            case "incidentes":
                return <ReportarIncidente />;
            
            // Si el Navbar llama a 'logout', no renderizamos nada aquí, ya que el Navbar maneja la acción
            case "logout":
                return null; 
            
            default:
                return <CheckEntry />; // Fallback
        }
    };

    return (
        <div>
            <Navbar 
                onSelect={setSeccionConLimpieza}
                pendingNotificationsCount={pendingNotificationsCount} 
            /> 
            <div>
                {renderContenido()}
            </div>
        </div>
    );
};

export default GuardiaEntrada;