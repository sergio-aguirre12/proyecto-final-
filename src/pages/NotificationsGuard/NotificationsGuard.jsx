import React from "react";
import Alerta from "../../components/guardia/alertComponent/alertComponent";

const NotificacionesGuardia = ({
  onNavigate,
  incidentesPendientesCount,
  pendientesRegistroCount,
  alertasDeAccesoCount,
  incidentesPendientesIDs
}) => {

  return (
    <div>
      <h2>🔔 Panel de Notificaciones y Alertas</h2>
      <p>Estado actual de reportes y accesos críticos:</p>

      <div className="notificaciones-listado">
        {incidentesPendientesCount > 0 && (
          <Alerta
            tipo="advertencia"
            title="Reportes Abiertos:"
            text={`Tienes **${incidentesPendientesCount}** incidentes reportados pendientes de revisión.`}
            text2={`IDs Pendientes: ${(incidentesPendientesIDs.slice(0,3).join(', ') + (incidentesPendientesIDs.length > 3 ? '...' : '')) || 'N/A'}`}
            textButton="Ver Mis Reportes"
            onButtonClick={() => onNavigate("mis-incidentes")}
          />
        )}

        {pendientesRegistroCount > 0 && (
          <Alerta
            tipo="informacion"
            title="Pendientes de Registro:"
            text={`Hay **${pendientesRegistroCount}** solicitud pendiente de revisión del administrador.`}
            textButton="Ver Solicitudes"
            onButtonClick={() => onNavigate("pendientes")}
          />
        )}

        {alertasDeAccesoCount > 0 && (
          <Alerta
            tipo="peligro"
            title="Acceso Restringido:"
            text={`¡**${alertasDeAccesoCount}** intentos de acceso fueron detenidos hoy! Revisar registros.`}
            textButton="Ver Registro"
            onButtonClick={() => onNavigate("registro_actividad")}
          />
        )}

        <Alerta
          tipo="informacion"
          title="Sistema:"
          text="Listo para operar."
        />
      </div>
    </div>
  );
};

export default NotificacionesGuardia;
