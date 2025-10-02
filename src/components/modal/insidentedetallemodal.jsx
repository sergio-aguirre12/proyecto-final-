import React from 'react';
import './insidentedetallemodal.css'; 

const IncidenteDetalleModal = ({ incidente, onClose, parseNotas }) => {
    if (!incidente) return null;

    //  parseNotas para formatear la sección 
    const detallesParseados = parseNotas(incidente.notas);
    

    // Si la Descripción NO fue parseada previamente y existe como campo, la incluimos.
    const detallesAdicionales = [];

    // Incluir la descripción si existe y no está ya implícita en notas
    if (incidente.descripcion && !detallesParseados.some(d => d.clave.toLowerCase().includes('descripci'))) {
        detallesAdicionales.push({ clave: "Descripción", valor: incidente.descripcion });
    }
    
    // Si el Tipo existe y no está ya implícito en notas
    if (incidente.tipo && !detallesParseados.some(d => d.clave.toLowerCase().includes('tipo'))) {
        detallesAdicionales.push({ clave: "Tipo", valor: incidente.tipo });
    }

    const todosLosDetalles = [...detallesAdicionales, ...detallesParseados];

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Detalle del Incidente #{incidente.id}</h3>
                
                {/* Información de Cabecera */}
                <div className="modal-info-grid">
                    <p><strong>Persona:</strong> {incidente.nombrePersona} (ID: {incidente.idPersona})</p>
                    <p><strong>Fecha/Hora:</strong> {incidente.fecha} - {incidente.hora}</p>
                    <p><strong>Estado:</strong> {incidente.estado}</p>
                    <p><strong>Gravedad:</strong> {incidente.gravedad || 'N/A'}</p> 
                </div>
                
                <hr/>

                <h4>Detalles Reportados:</h4>
                <div className="detalles-list">
                    {todosLosDetalles.length === 0 ? (
                        <p>No se proporcionaron detalles específicos.</p>
                    ) : (
                        todosLosDetalles.map((item, index) => (
                            <p key={index} className="detalle-item">
                                <span className="detalle-clave">{item.clave}:</span> {item.valor}
                            </p>
                        ))
                    )}
                </div>

                <button onClick={onClose} className="btn-cerrar-modal">Cerrar</button>
            </div>
        </div>
    );
};

export default IncidenteDetalleModal;