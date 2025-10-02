import React, { useEffect, useRef } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('❌ Error al acceder a la cámara:', error);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertimos el canvas a Blob para enviarlo a Cloudinary
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Error al capturar la imagen.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", blob, "photo.png");
        formData.append("upload_preset", "ml_default"); // Reemplaza con tu upload_preset

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dcfoaq1vo/image/upload", // Reemplaza con tu cloud_name
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.secure_url) {
          onCapture(data.secure_url); // Devolvemos la URL de la imagen subida
        } else {
          console.error("❌ Error Cloudinary:", data);
          alert("No se pudo subir la imagen.");
        }
      } catch (error) {
        console.error("❌ Error al subir la foto:", error);
        alert("Hubo un problema al subir la foto.");
      }
    }, "image/png");
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        height="auto"
      />
      <button type="button" onClick={capturePhoto}>📷 Capturar Foto</button>
    </div>
  );
};

export default CameraCapture;