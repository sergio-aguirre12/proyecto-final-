// src/components/incidents/ReportarIncidente.jsx
import React, { useState, useEffect } from "react";
import { fetchPersonas, postIncidente } from "../../services/Api"; // ✅ Importa postIncidente
import "../incidents/IncidentReport.css";

const ReportarIncidente = () => {
  const [personas, setPersonas] = useState([]);
  const [cedula, setCedula] = useState("");
  const [persona, setPersona] = useState(null);

  const [tipo, setTipo] = useState("");
  const [gravedad, setGravedad] = useState("leve");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const lista = await fetchPersonas();
        setPersonas(lista);
      } catch (err) {
        setError("Error al cargar personas");
      }
    };
    cargarPersonas();
  }, []);

  useEffect(() => {
    const p = personas.find((p) => p.id === cedula);
    setPersona(p || null);
  }, [cedula, personas]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!persona) {
      setError("❌ Persona no encontrada");
      return;
    }

    if (!tipo || !descripcion) {
      setError("❌ Completa todos los campos");
      return;
    }

    const now = new Date();
    const nuevaIncidente = { // ✅ Cambié el nombre de la variable para ser más clara
      personaId: persona.id,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(":").slice(0, 2).join(":"),
      estado: "pendiente",
      tipo, // Propiedad 'tipo' separada
      gravedad, // Propiedad 'gravedad' separada
      descripcion, // Propiedad 'descripcion' separada
      // ❌ No necesitas 'incidente' ni 'aceptado' si tu db.json tiene la nueva estructura
    };
    
    try {
      // ✅ Usa la función postIncidente para enviar los datos al endpoint correcto
      await postIncidente(nuevaIncidente); 
      setMensaje("✅ Incidente reportado correctamente");
      setError("");
      setCedula("");
      setTipo("");
      setGravedad("leve");
      setDescripcion("");
      setPersona(null);
    } catch (err) {
      setError("❌ Error al registrar el incidente");
    }
  };

  console.log(persona)

  return (
    <div className="form-incidente">
      <h2>📋 Reportar Incidente</h2>
      {mensaje && <p className="success">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Número de cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        {persona && (
          <>
          <p> <strong>Nombre:</strong> {persona.nombre} </p>
          <p> <strong>Cedula:</strong> {persona.id} </p>
          </>
        )}
        <input
          type="text"
          placeholder="Tipo de incidente (ej: discusión, agresión, etc.)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <label>
          Gravedad:
          <select
            value={gravedad}
            onChange={(e) => setGravedad(e.target.value)}
          >
            <option value="muy leve">Muy leve</option>
            <option value="leve">Leve</option>
            <option value="grave">Grave</option>
            <option value="gravísima">Gravísima</option>
          </select>
        </label>
        <textarea
          rows="4"
          placeholder="Descripción del incidente"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
        <button type="submit">🚨 Reportar Incidente</button>
      </form>
    </div>
  );
};

export default ReportarIncidente;