import React, { useState } from "react";
import CameraCapture from "../cameracapture/CameraCapture.jsx";
import "./FormRegister.css";
import { postPersona } from "../../services/Api.jsx";

const FormRegister = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [rut, setRut] = useState("");
  const [fotoUrl, setFotoUrl] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleCapture = async (imageUrl) => {
    console.log("✅ Imagen subida a Cloudinary:", imageUrl);
    setFotoUrl(imageUrl);
    setSubiendo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !edad || !rut || !fotoUrl) {
      alert("Por favor completa todos los campos y captura la foto.");
      return;
    }

    const persona = {
      id: rut,
      nombre,
      edad: parseInt(edad),
      foto: fotoUrl,
      flagged: false,
      status: "pendiente",
    };

    try {
      const respuesta = await postPersona(persona);
      console.log("📨 Respuesta backend:", respuesta);
      alert("Persona registrada correctamente ✅");

      // Resetear formulario
      setNombre("");
      setEdad("");
      setRut("");
      setFotoUrl(null);
    } catch (error) {
      console.error("❌ Error al registrar persona:", error);
      alert("Hubo un error al registrar a la persona.");
    }
  };

  return (
    <form className="form-register" onSubmit={handleSubmit}>
      <h2>Formulario de Registro</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />

      <input
        type="text"
        placeholder="RUT o ID"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
      />

      <CameraCapture
        onCapture={(url) => {
          setSubiendo(true);
          handleCapture(url);
        }}
      />

      {subiendo && <p>⏳ Subiendo foto...</p>}

      {fotoUrl && (
        <div className="preview">
          <p>📷 Foto capturada y subida:</p>
          <img src={fotoUrl} alt="Foto capturada" width="200" />
        </div>
      )}

      <button type="submit">Registrar Persona</button>
    </form>
  );
};

export default FormRegister;