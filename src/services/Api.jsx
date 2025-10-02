const API_BASE = "http://localhost:3000"; 


// USUARIOS


// Login por credenciales
export const loginUsuario = async (usuario, password) => {
    try {
        // Usa GET con QUERY PARAMS para filtrar la lista de usuarios en el servidor
        const res = await fetch(
            `${API_BASE}/usuarios?usuario=${usuario}&password=${password}`
        );
        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Error al buscar usuario: ${errorData}`);
        }
        const data = await res.json();
        return data; // devuelve array (puede ser [] o [usuario])
    } catch (error) {
        console.error("❌ loginUsuario:", error);
        throw new Error("No se pudo conectar con el servidor");
    }
};

/** Obtiene todos los usuarios (administradores y guardias) */
// Implementa la operación READ (Lectura) mediante el método HTTP GET.
export const fetchUsuarios = async () => {
    try {
        const res = await fetch(`${API_BASE}/usuarios`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return await res.json();
    } catch (error) {
        console.error("❌ fetchUsuarios:", error);
        throw error;
    }
};

/** Crea un nuevo usuario (admin o guardia) */
// Implementa la operación CREATE (Creación) mediante el método HTTP POST.
export const postUsuario = async (usuarioData) => {
    try {
        const res = await fetch(`${API_BASE}/usuarios`, {
            method: "POST", // 👈 Método POST para CREAR un nuevo recurso
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioData),
        });
        if (!res.ok) throw new Error("Error al crear usuario");
        return await res.json();
    } catch (error) {
        console.error("❌ postUsuario:", error);
        throw error;
    }
};

/** Edita un usuario existente (PATCH) */
// Implementa la operación UPDATE (Actualización parcial) mediante el método HTTP PATCH.
export const updateUsuario = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'PATCH', // Usamos PATCH para actualizar parcialmente
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar el usuario: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("❌ updateUsuario:", error);
        throw error;
    }
};

/** Elimina un usuario (DELETE) */
// Implementa la operación DELETE (Eliminación) mediante el método HTTP DELETE.
export const deleteUsuario = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE',
        });
        // JSON-Server a veces devuelve un 200/204 sin cuerpo
        if (!response.ok) {
            throw new Error(`Error al eliminar el usuario: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error("❌ deleteUsuario:", error);
        throw error;
    }
};


// PERSONAS


//  Implementa la operación READ (Lectura) mediante el método HTTP GET.
// Obtiene toda la colección de recursos 'personas'.
export const fetchPersonas = async () => {
    try {
        const res = await fetch(`${API_BASE}/personas`);
        if (!res.ok) throw new Error("Error al obtener personas");
        return await res.json();
    } catch (error) {
        console.error("❌ fetchPersonas:", error);
        throw error;
    }
};

// Implementa la operación CREATE (Creación) mediante el método HTTP POST.
export const postPersona = async (persona) => {
    try {
        // Aseguramos que el status sea 'pendiente' para que aparezca en el Admin.
        const personaConStatus = { ...persona, status: "pendiente" };

        const res = await fetch(`${API_BASE}/personas`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" }, // Indica que el cuerpo es JSON
            body: JSON.stringify(personaConStatus), // El cuerpo lleva los datos del nuevo recurso
        });
        // Si la creación es exitosa, el código de estado generalmente es 201 Created.
        if (!res.ok) throw new Error("Error al registrar persona");
        return await res.json();
    } catch (error) {
        console.error("❌ postPersona:", error);
        throw error;
    }
};

//  Implementa la operación UPDATE (Actualización parcial) mediante el método HTTP PATCH.
// Se usa para modificar solo una parte (el 'status') de un recurso existente, identificado por su ID.
export const updatePersonaStatus = async (id, status) => {
    try {
        const res = await fetch(`${API_BASE}/personas/${id}`, {
            method: "PATCH", // 👈 Método PATCH para ACTUALIZACIÓN PARCIAL
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }), // Solo enviamos el campo a actualizar (status)
        });
        if (!res.ok) throw new Error("Error al actualizar estado");
        return await res.json();
    } catch (error) {
        console.error("❌ updatePersonaStatus:", error);
        throw error;
    }
};

// Implementa la operación DELETE (Eliminación) mediante el método HTTP DELETE.
// Se usa para eliminar un recurso específico, identificado por su ID.
export const deletePersona = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/personas/${id}`, {
            method: "DELETE", // 👈 Método DELETE para ELIMINAR el recurso
        });
        // Si la eliminación es exitosa, el código de estado suele ser 200 (OK) o 204 (No Content).
        if (!res.ok) throw new Error("Error al eliminar persona");
        return true;
    } catch (error) {
        console.error("❌ deletePersona:", error);
        throw error;
    }
};

//  Implementa la operación READ (Lectura) mediante el método HTTP GET.
// Obtiene una lista filtrada de recursos 'personas' usando un QUERY PARAM.
export const fetchPersonasPendientes = async () => {
    const res = await fetch(`${API_BASE}/personas?status=pendiente`);
    if (!res.ok) throw new Error("Error al obtener personas pendientes");
    return await res.json();
};

//  Implementa la operación READ (Lectura) mediante el método HTTP GET.
// Obtiene una lista filtrada de recursos 'personas' usando un QUERY PARAM.
export const fetchPersonasAceptadas = async () => {
    const res = await fetch(`${API_BASE}/personas?status=aceptado`);
    if (!res.ok) throw new Error("Error al obtener personas aceptadas");
    return await res.json();
};

//  Implementa la operación READ (Lectura) mediante el método HTTP GET.
// Obtiene un recurso específico (o una lista que contiene solo ese recurso) usando un QUERY PARAM.
export const getPersonaByRut = async (rut) => {
    try {
        // Asumo que tu base de datos usa 'id' para buscar por RUT/Cédula si no tienen un campo 'rut' explícito.
        const res = await fetch(`${API_BASE}/personas?id=${rut}`);
        if (!res.ok) throw new Error("Error al buscar persona");
        const data = await res.json();
        return data.length ? data[0] : null;
    } catch (error) {
        console.error("❌ getPersonaByRut:", error);
        throw error;
    }
};



// ENTRADAS (Registro de Actividad Principal)


/** Obtiene TODAS las entradas (usada por AdminDashboard) */
export const fetchEntradas = async () => {
    try {
        const response = await fetch(`${API_BASE}/entradas`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("❌ fetchEntradas:", error);
        throw error;
    }
};

// 🚨 FUNCIÓN FALTANTE (SOLUCIÓN): Exporta fetchEntradas con el nombre que el componente necesita.
export const fetchAllAccesos = fetchEntradas; 


// Implementa la operación READ (Lectura) mediante el método HTTP GET.
// Obtiene una lista filtrada de recursos 'entradas' usando un QUERY PARAM.
export const getEntradasPorPersona = async (personaId) => {
    try {
        const res = await fetch(`${API_BASE}/entradas?personaId=${personaId}`);
        if (!res.ok) throw new Error("Error al obtener entradas");
        return await res.json();
    } catch (error) {
        console.error("❌ getEntradasPorPersona:", error);
        throw error;
    }
};

export const postEntrada = async (entradaData) => {
    try {
        const res = await fetch(`${API_BASE}/entradas`, {
            method: "POST", // 👈 Método POST para CREAR un nuevo recurso
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entradaData),
        });
        if (!res.ok) throw new Error("Error al registrar la entrada");
        return await res.json();
    } catch (error) {
        console.error("❌ postEntrada:", error);
        throw error;
    }
};



// INCIDENTES


/** Obtiene TODOS los incidentes admin) */
export const fetchAllIncidentes = async () => {
    try {
        const res = await fetch(`${API_BASE}/incidentes`);
        if (!res.ok) throw new Error("Error al obtener todos los incidentes");
        return await res.json();
    } catch (error) {
        console.error("❌ fetchAllIncidentes:", error);
        throw error;
    }
};

/** Obtiene un incidente por ID */
export const fetchIncidenteById = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/incidentes/${id}`);
        if (!res.ok) throw new Error("Error al obtener incidente por ID");
        return await res.json();
    } catch (error) {
        console.error("❌ fetchIncidenteById:", error);
        throw error;
    }
};

/** Crea un nuevo recurso de incidente. */
export const postIncidente = async (incidente) => {
    try {
        const res = await fetch(`${API_BASE}/incidentes`, {
            method: "POST", // 👈 Método POST para CREAR un nuevo recurso
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(incidente),
        });
        if (!res.ok) throw new Error("Error al reportar el incidente");
        return await res.json();
    } catch (error) {
        console.error("❌ postIncidente:", error);
        throw error;
    }
};

/** Actualiza el estado de un incidente a "resuelto" */
export const updateIncidenteStatus = async (id, status) => {
    try {
        const res = await fetch(`${API_BASE}/incidentes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: status }), 
            
        });
        if (!res.ok) throw new Error("Error al actualizar estado del incidente");
        return await res.json();
    } catch (error) {
        console.error("❌ updateIncidenteStatus:", error);
        throw error;
    }
};


// LOGS DE ACCESO (Logs técnicos/alternativos)


/** Obtiene todos los logs de acceso (Endpoint: /logs_acceso) */
export const fetchLogAccesosDenegados = async () => {
    try {
        // Obtenemos todos los logs de acceso. 
        const res = await fetch(`${API_BASE}/logs_acceso`);

        if (!res.ok) {
            throw new Error(`Error al obtener logs de acceso: ${res.statusText}`);
        }

        return await res.json(); // Devuelve la lista completa de logs de acceso.
    } catch (error) {
        console.error("❌ fetchLogAccesosDenegados:", error);
        throw new Error("No se pudo cargar el historial de logs de acceso.");
    }
};

/** Crea un nuevo registro de log de acceso. */
export const postLogAcceso = async (logData) => {
    try {
        const res = await fetch(`${API_BASE}/logs_acceso`, {
            method: "POST", // Método POST para CREAR un nuevo registro
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logData),
        });
        if (!res.ok) throw new Error("Error al registrar el log de acceso");
        return await res.json();
    } catch (error) {
        console.error("❌ postLogAcceso:", error);
        throw error;
    }
};