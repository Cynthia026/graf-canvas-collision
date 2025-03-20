const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#feffcf"; // fondo de color

let removedFlowers = 0; // Contador de flores eliminadas

class Flower {
    constructor(x, size, petalColor) {
        this.posX = x;
        this.posY = -size; // Siempre inicia fuera de la pantalla (arriba)
        this.size = size;
        this.petalColor = petalColor;
        this.centerColor = "#FFD700"; // Amarillo
        this.speed = Math.random() * 2 + 1; // Velocidad fija aleatoria entre 1 y 3
    }

    draw(context) {
        context.save();
        context.translate(this.posX, this.posY);

         // Dibujar pétalos (5 pétalos en forma de estrella)
          context.fillStyle = this.petalColor;
          for (let i = 0; i < 5; i++) {
              context.beginPath();
              context.rotate((Math.PI * 2) / 5);
              context.fillStyle = this.color;
              context.arc(0, this.size / 2, this.size / 2, 0, Math.PI * 2);
              context.fill();
              context.closePath();
          }

        // Dibujar centro de la flor
        context.beginPath();
        context.fillStyle = this.centerColor;
        context.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    update(context) {
        this.draw(context);
        this.posY += this.speed;

        // Si la flor sale de la pantalla, reaparece arriba con nueva velocidad
        if (this.posY - this.size > window_height) {
            this.resetPosition();
        }
    }

    // Verifica si el mouse está sobre la flor
    isClicked(mouseX, mouseY) {
        let dx = mouseX - this.posX;
        let dy = mouseY - this.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size * 1.5;
    }

    // Reiniciar posición y velocidad de la flor
    resetPosition() {
        this.posX = Math.random() * window_width;
        this.posY = -this.size;
        this.speed = Math.random() * 2 + 1; // Nueva velocidad fija entre 1 y 3
    }
}

// Array de flores
let flowers = [];

// Generar flores iniciales
function generateFlowers(n) {
    for (let i = 0; i < n; i++) {
        addNewFlower();
    }
}

// Agregar una nueva flor en la parte superior
function addNewFlower() {
    let size = Math.random() * 20 + 30; // Tamaño entre 30 y 50
    let x = Math.random() * window_width;
    let petalColor = `hsl(${Math.random() * 360}, 80%, 80%)`; // Colores pastel
    flowers.push(new Flower(x, size, petalColor));
}

// Detectar clic y eliminar flor
canvas.addEventListener("click", function (event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let initialLength = flowers.length;
    flowers = flowers.filter(flower => {
        if (flower.isClicked(mouseX, mouseY)) {
            removedFlowers++; // Aumentar contador de eliminaciones
            return false; // Eliminar la flor
        }
        return true; // Mantener la flor
    });

    // Agregar nuevas flores si faltan
    while (flowers.length < 10) {
        addNewFlower();
    }
});

// Dibujar contador en pantalla
function drawCounter() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Eliminadas: ${removedFlowers}`, window_width - 150, 30);
}

// Animar las flores
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    flowers.forEach(flower => {
        flower.update(ctx);
    });

    drawCounter(); // Mostrar el contador actualizado
    requestAnimationFrame(animate);
}

// Generar 10 flores y comenzar animación
generateFlowers(10);
animate();
