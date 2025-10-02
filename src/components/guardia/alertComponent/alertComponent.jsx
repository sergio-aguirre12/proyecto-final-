import React from "react";

const Alerta = ({ 
  title, 
  text, 
  text2, 
  textButton, 
  onButtonClick, 
  tipo = "informacion" // "advertencia", "peligro", "informacion"
}) => {
  const alertaClass = {
    advertencia: "alerta alerta-advertencia",
    peligro: "alerta alerta-peligro",
    informacion: "alerta alerta-informacion"
  }[tipo];

  const btnClass = {
    advertencia: "btn-alerta-revisar",
    peligro: "btn-alerta-peligro-accion",
    informacion: "btn-alerta-revisar"
  }[tipo];

  return (
    <div className={alertaClass}>
      <div>
        <strong>{title}</strong> {text}
        {text2 && <p style={{ marginTop: '5px', fontSize: '0.9em' }}>{text2}</p>}
      </div>
      {textButton && <button className={btnClass} onClick={onButtonClick}>{textButton}</button>}
    </div>
  );
};

export default Alerta;
