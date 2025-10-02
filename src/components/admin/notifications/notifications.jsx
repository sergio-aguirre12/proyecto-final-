import React from "react";

const NotificationsComponent = ({ title, text, text2, textButton, functionButton, bgColor = '#e6ffed', color = '#155724', borderColor = '#c3e6cb', buttonIcon }) => {
    return(
        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: bgColor, color: color, border: `1px solid ${borderColor}`, borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
            <div>
                <p>{buttonIcon} <strong>{title}</strong> {text}</p>
                {text2 && <p style={{ fontWeight: 'normal', fontSize: '0.9em', marginTop: '5px' }}>{text2}</p>}
            </div>
            {textButton && <button onClick={functionButton} style={{ padding: '8px 12px', backgroundColor: color, border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', color: '#fff' }}>{textButton}</button>}
        </div>
    )
}


export default NotificationsComponent