import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { gsap } from "gsap";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al servidor de Socket.io
    const socketIo = io("http://localhost:5000"); // Asegúrate de que esta URL sea correcta (el puerto de tu backend)
    setSocket(socketIo);

    // Enviar un mensaje al servidor cuando el cliente se conecte
    socketIo.emit("mensaje", "¡Hola desde el cliente!");

    // Escuchar los mensajes del servidor
    socketIo.on("mensaje", (data) => {
      console.log("Mensaje recibido del servidor:", data);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Establecer las dimensiones del canvas
    canvas.width = 800;
    canvas.height = 600;

    // Cargar el fondo
    const background = new Image();
    background.src = "ruta/a/tu/fondo.png"; // Cambia la ruta por la correcta
    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    };

    // Cargar el sprite del jugador
    const player = new Image();
    player.src = "ruta/a/tu/personaje.png"; // Cambia la ruta por la correcta
    player.onload = () => {
      ctx.drawImage(player, 200, 300); // Posición inicial del jugador
    };

    // Animación con GSAP
    player.onload = () => {
      gsap.to(playerRef.current, {
        x: 600, // Mover el sprite hasta x = 600
        duration: 3, // Duración de la animación
        repeat: -1, // Repetir indefinidamente
        yoyo: true, // Hacer el movimiento en reversa después de cada ciclo
        ease: "power1.inOut", // Suavizar la animación
        onUpdate: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Redibujar el fondo
          ctx.drawImage(player, playerRef.current.x, 300); // Redibujar el jugador en su nueva posición
        },
      });
    };

    // Referencia al sprite del jugador
    playerRef.current = { x: 200 }; // Posición inicial

  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default GameCanvas;
