const lienzo = document.getElementById("gameCanvas");
const ctx = lienzo.getContext("2d");
const botonInicio = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const textoMaxPuntaje = document.getElementById("max-score");

let jugador, objetos, puntaje, juegoTerminado, velocidad, animacionId;
let intervaloCaida, tiempoAparicion;

// 🔹 Cargar imagen del personaje
const imagenJugador = new Image();
imagenJugador.src = "alieng.png"; // asegúrate que el archivo esté en la misma carpeta

function iniciarJuego() {
  jugador = { x: lienzo.width / 2 - 20, y: lienzo.height - 60, ancho: 40, alto: 40 };
  objetos = [];
  puntaje = 0;
  velocidad = 2;
  tiempoAparicion = 800;
  juegoTerminado = false;

  clearInterval(intervaloCaida);
  generarObjetos();
  actualizarJuego();
}

function generarObjetos() {
  intervaloCaida = setInterval(() => {
    if (!juegoTerminado) {
      objetos.push({
        x: Math.random() * (lienzo.width - 20),
        y: 0,
        ancho: 20,
        alto: 20,
        color: "orange"
      });
    }
  }, tiempoAparicion);
}

function actualizarJuego() {
  if (juegoTerminado) return;

  ctx.clearRect(0, 0, lienzo.width, lienzo.height);

  // Dibujar jugador (imagen)
  ctx.drawImage(imagenJugador, jugador.x, jugador.y, jugador.ancho, jugador.alto);

  // Dibujar objetos
  for (let i = 0; i < objetos.length; i++) {
    const obj = objetos[i];
    obj.y += velocidad;
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.ancho, obj.alto);

    // Colisión
    if (
      obj.x < jugador.x + jugador.ancho &&
      obj.x + obj.ancho > jugador.x &&
      obj.y < jugador.y + jugador.alto &&
      obj.y + obj.alto > jugador.y
    ) {
      terminarJuego();
    }

    // Si pasa sin colisión
    if (obj.y > lienzo.height) {
      objetos.splice(i, 1);
      puntaje++;
      aumentarDificultad();
    }
  }

  // Mostrar puntaje
  ctx.fillStyle = "white";
  ctx.font = "16px monospace";
  ctx.fillText("Puntaje: " + puntaje, 10, 20);

  animacionId = requestAnimationFrame(actualizarJuego);
}

function aumentarDificultad() {
  if (puntaje % 5 === 0) velocidad += 0.4;
  if (puntaje % 10 === 0 && tiempoAparicion > 300) {
    tiempoAparicion -= 100;
    clearInterval(intervaloCaida);
    generarObjetos();
  }
}

function terminarJuego() {
  cancelAnimationFrame(animacionId);
  clearInterval(intervaloCaida);
  juegoTerminado = true;

  ctx.fillStyle = "white";
  ctx.font = "30px monospace";
  ctx.fillText("Game Over", lienzo.width / 2 - 80, lienzo.height / 2);
  guardarMaxPuntaje();

  setTimeout(mostrarMenu, 2000);
}

function guardarMaxPuntaje() {
  const maximo = parseInt(localStorage.getItem("maxScore")) || 0;
  if (puntaje > maximo) {
    localStorage.setItem("maxScore", puntaje);
  }
}

function mostrarMenu() {
  lienzo.style.display = "none";
  menu.style.display = "block";
  textoMaxPuntaje.textContent = localStorage.getItem("maxScore") || 0;
}

// Movimiento del jugador
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && jugador.x > 0) jugador.x -= 20;
  if (e.key === "ArrowRight" && jugador.x + jugador.ancho < lienzo.width) jugador.x += 20;
});

// Iniciar juego
botonInicio.addEventListener("click", () => {
  menu.style.display = "none";
  lienzo.style.display = "block";
  iniciarJuego();
});

mostrarMenu();