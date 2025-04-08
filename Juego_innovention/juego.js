document.getElementById('final-screen').style.display = 'none';  // Ocultar la pantalla final al principio

let puntos = 0;
let letraAtrapar;
let tiempoRestante = 100;
let intervalBurbuja, intervalTemporizador;
let dificultad = 'facil'; // Nivel por defecto
const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Asignar nivel de dificultad
document.getElementById('easy-btn').addEventListener('click', () => {
    dificultad = 'facil';
    document.getElementById('message').textContent = "¡Dificultad fácil seleccionada!";
});

document.getElementById('medium-btn').addEventListener('click', () => {
    dificultad = 'medio';
    document.getElementById('message').textContent = "¡Dificultad media seleccionada!";
});

document.getElementById('hard-btn').addEventListener('click', () => {
    dificultad = 'dificil';
    document.getElementById('message').textContent = "¡Dificultad difícil seleccionada!";
});

// Obtener la letra aleatoria
function obtenerLetraAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * abecedario.length);
    return abecedario[indiceAleatorio];
}

// Generar burbuja
function generarBurbuja() {
    const burbuja = document.createElement('div');
    burbuja.classList.add('bubble');

    const letra = obtenerLetraAleatoria();
    burbuja.textContent = letra;

    if (Math.random() > 0.80) {  
        burbuja.textContent = letraAtrapar;
    }

    let positionX, positionY;
    let overlap = true;

    while (overlap) {
        overlap = false;
        positionX = Math.floor(Math.random() * (window.innerWidth - 150));
        positionY = Math.floor(Math.random() * (window.innerHeight - 150));

        const burbujasExistentes = document.getElementsByClassName('bubble');
        for (let i = 0; i < burbujasExistentes.length; i++) {
            const burbujaExistente = burbujasExistentes[i];
            const left = parseInt(burbujaExistente.style.left);
            const top = parseInt(burbujaExistente.style.top);

            if (Math.abs(positionX - left) < 150 && Math.abs(positionY - top) < 150) {
                overlap = true;
                break;
            }
        }
    }

    burbuja.style.left = `${positionX}px`;
    burbuja.style.top = `${positionY}px`;

    burbuja.style.animation = 'caer 8s linear infinite';
    document.getElementById('bubbles-container').appendChild(burbuja);

    setTimeout(() => {
        burbuja.remove();
    }, 8000);

    burbuja.addEventListener('click', () => {
        if (burbuja.textContent === letraAtrapar) {
            puntos++;
            burbuja.remove();
            actualizarPuntos();
        }
    });
}

// Actualizar puntos
function actualizarPuntos() {
    document.getElementById('score').textContent = `Puntos: ${puntos}`;
}

// Ajuste en el intervalo según la dificultad
function obtenerIntervaloBurbuja() {
    if (dificultad === 'facil') {
        return 1500; // Lento
    } else if (dificultad === 'medio') {
        return 1000; // Moderado
    } else if (dificultad === 'dificil') {
        return 500; // Rápido
    }
}

// Iniciar el juego
function iniciarJuego() {
    document.getElementById('inicio-cuadro').style.display = 'none';
    document.getElementById('bubbles-container').style.display = 'block';

    // 👇 MOSTRAR elementos que estaban invisibles
    document.getElementById('message').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    document.getElementById('timer').style.display = 'block';

    puntos = 0;
    document.getElementById('score').textContent = 'Puntos: 0';
    tiempoRestante = 100;
    document.getElementById('timer').textContent = '1:40';

    letraAtrapar = obtenerLetraAleatoria();
    document.getElementById('message').textContent = `¡Atrapa la letra: ${letraAtrapar}!`;

    intervalBurbuja = setInterval(generarBurbuja, obtenerIntervaloBurbuja());

    intervalTemporizador = setInterval(() => {
        tiempoRestante--;
        document.getElementById('timer').textContent = `0:${tiempoRestante < 10 ? '0' : ''}${tiempoRestante}`;

        if (tiempoRestante <= 0) {
            clearInterval(intervalBurbuja);
            clearInterval(intervalTemporizador);
            mostrarPantallaFinal();
        }
    }, 1000);
}


// Agregar un listener para el botón de inicio
document.getElementById('start-btn').addEventListener('click', iniciarJuego);

// Mostrar la pantalla final
function mostrarPantallaFinal() {
    // Detener la creación de burbujas
    clearInterval(intervalBurbuja);
    clearInterval(intervalTemporizador);

    // Eliminar todas las burbujas existentes
    document.querySelectorAll('.bubble').forEach(burbuja => burbuja.remove());

    // Mostrar la pantalla final
    document.getElementById('final-points').textContent = `Puntos: ${puntos}`;
    document.getElementById('final-screen').style.display = 'flex';
}


document.getElementById('restart-btn').addEventListener('click', () => {
    // Ocultar la pantalla final
    document.getElementById('final-screen').style.display = 'none';  

    // Mostrar el cuadro de selección de dificultad
    document.getElementById('inicio-cuadro').style.display = 'block';  

    // Ocultar el contenedor de burbujas
    document.getElementById('bubbles-container').style.display = 'none';

    // 👇 Ocultar puntos, temporizador y mensaje
    document.getElementById('message').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('timer').style.display = 'none';

    // Restablecer los puntos y el temporizador
    puntos = 0;
    tiempoRestante = 100;
    document.getElementById('score').textContent = 'Puntos: 0';
    document.getElementById('timer').textContent = '1:40';

    // Restablecer el mensaje de dificultad
    document.getElementById('message').textContent = '¡Selecciona una dificultad para comenzar!';
});
// Mostrar mensaje inicial al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('message').textContent = '¡Selecciona una dificultad para comenzar!';
    document.getElementById('message').style.display = 'block'; // Asegura que esté visible
    document.getElementById('score').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
});


// Botón de salir
document.getElementById('exit-btn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Puedes ajustar la ruta si es necesario
});
