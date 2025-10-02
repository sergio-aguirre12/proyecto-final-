import React, { useState, useEffect } from "react";
import "./CheckEntry.css";
import {
  getEntradasPorPersona,
  postEntrada,
  fetchPersonas,
} from "../../services/Api.jsx";

const CheckEntry = () => {
  const [rut, setRut] = useState("");
  const [todasPersonas, setTodasPersonas] = useState([]);
  const [persona, setPersona] = useState(null);
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [notas, setNotas] = useState("");
  const [historialVisible, setHistorialVisible] = useState(false);
  const [notificacion, setNotificacion] = useState("");

  // Cargo todas las personas al montar el componente
  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const lista = await fetchPersonas();
        setTodasPersonas(lista);
      } catch (err) {
        setError("❌ Error al cargar personas");
      }
    };
    cargarPersonas();
  }, []);

  // Buscar persona
  useEffect(() => {
    if (rut.trim().length >= 2) {
      const coincidencia = todasPersonas.find((p) =>
        p.id.toString().toLowerCase().includes(rut.toLowerCase())
      );

      if (coincidencia) {
        setPersona(coincidencia);
        cargarEntradas(coincidencia.id);
        setError("");
      } else {
        setPersona(null);
        setEntradas([]);
        setError("⚠️ Persona no encontrada");
      }
    } else {
      setPersona(null);
      setEntradas([]);
      setError("");
    }
  }, [rut, todasPersonas]);

  const cargarEntradas = async (personaId) => {
    try {
      const historial = await getEntradasPorPersona(personaId);
      setEntradas(historial);
    } catch (error) {
      setError("❌ Error al cargar historial");
    }
  };

  const registrarEntrada = async (accionGuardiaAcepta) => {
    if (!persona?.id) {
      setError("❌ No se pudo registrar entrada: Persona inválida.");
      return;
    }

    let aceptadoFinal = accionGuardiaAcepta; // Inicializa con la acción del botón

    // 🛑 RPersona marcada como conflictiva (flagged)
    if (persona.flagged && accionGuardiaAcepta) {
      alert("⚠️ ADVERTENCIA: Esta persona está marcada como conflictiva y NO puede ingresar. Registrando como RECHAZADA.");
      aceptadoFinal = false;
    }

    // 🛑  Persona Rechazada o Pendiente por la Administración
    if (persona.status === 'rechazado' && accionGuardiaAcepta) {
      alert("🚫 ALERTA CRÍTICA: Esta persona fue RECHAZADA por la Administración. Registrando como RECHAZADA.");
      aceptadoFinal = false; // Forzar el log a FALSO
    }

    if (persona.status === 'pendiente' && accionGuardiaAcepta) {
      alert("⚠️ ALERTA: Esta persona está PENDIENTE de aprobación por la Administración. Registrando como RECHAZADA.");
      aceptadoFinal = false; // Forzar el log a FALSO
    }

    // PREVENCIÓN (si la edad es menor a 18)
    if (Number(persona.edad) < 18) {
      alert("🚫 BLOQUEO: Menor de edad. Entrada registrada como RECHAZADA.");
      aceptadoFinal = false;
    }


    try {
      const now = new Date();
      // Se requiere validación si hay flagged, notas o si fue rechazada/pendiente de origen
      const requiereValidacion = persona.flagged || (notas && notas.trim() !== "") || !aceptadoFinal;

      const nuevaEntrada = {
        personaId: persona.id,
        fecha: now.toISOString().split("T")[0],
        hora: now.toTimeString().split(":").slice(0, 2).join(":"),
        incidente: false,
        notas: notas || (aceptadoFinal ? "" : "Entrada rechazada/bloqueada"),
        aceptado: aceptadoFinal, // 🛑 Usa el valor final corregido por seguridad
        estado: requiereValidacion
          ? "pendiente" // Si hay algo inusual o si se rechazó
          : aceptadoFinal
            ? "aceptada"
            : "rechazada",
      };

      await postEntrada(nuevaEntrada);

      setMensaje(
        requiereValidacion
          ? "⏳ Entrada registrada y pendiente de validación"
          : aceptadoFinal
            ? "✅ Entrada registrada correctamente"
            : "❌ Entrada rechazada"
      );

      // Limpio todo para nuevo ingreso
      setPersona(null);
      setEntradas([]);
      setNotas("");
      setHistorialVisible(false);
      setRut("");
    } catch (error) {
      setError("❌ Error al registrar entrada");
    }
  };

  const agregarNotificacion = () => {
    setNotificacion("🔔 Notificación agregada.");
    // Aquí deberías llamar a una función de la API para registrar una notificación de alerta manual
    setTimeout(() => setNotificacion(""), 3000);
  };

  return (
    <div className="check-entry">
      <h2>Verificación de Entrada</h2>

      <input
        type="text"
        placeholder="Ingrese número de cédula"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
      />

      {notificacion && <p className="notification">{notificacion}</p>}
      {error && <p className="error">{error}</p>}
      {mensaje && <p className="success">{mensaje}</p>}

      {persona && (
        <div className="persona-perfil">
          <h3>{persona.nombre}</h3>

          {/* Muestra el estado oficial */}
          <p>Estado Oficial: <strong>{persona.status ? persona.status.toUpperCase() : 'N/A'}</strong></p>

          <p>Edad: {persona.edad}</p>
          <img src={persona.foto} alt="Foto de persona" width="200" />
          <p>Total de entradas registradas: {entradas.length}</p>

          {persona.flagged && (
            <p className="warning">⚠️ Esta persona está marcada como conflictiva</p>
          )}

          {Number(persona.edad) < 18 ? (
            <p className="age-restriction">🚫 Menor de edad - No se permite el ingreso</p>
          ) : (
            <>
              <label>
                Observaciones:
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agregar observaciones aquí..."
                  rows={3}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              </label>

              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button onClick={() => registrarEntrada(true)}>✅ Aceptar entrada</button>
                <button onClick={() => registrarEntrada(false)}>❌ Rechazar entrada</button>
                <button onClick={agregarNotificacion}>🔔 Agregar Notificación</button>
              </div>
            </>
          )}

          {entradas.length > 0 && (
            <div className="historial-entradas">
              <button
                className="toggle-historial-btn"
                onClick={() => setHistorialVisible(!historialVisible)}
              >
                {historialVisible ? "▼ Ocultar historial" : "▶ Mostrar historial"}
              </button>
              {historialVisible && (
                <ul>
                  {entradas.map((entrada) => (
                    <li key={entrada.id}>
                      Fecha: {entrada.fecha} - Hora: {entrada.hora} - Estado:{" "}
                      {entrada.aceptado ? "✅ Aceptada" : "❌ Rechazada"} - Notas:{" "}
                      {entrada.notas || "Ninguna"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckEntry;