const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Dimensiones del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#feffcf"; // Verde pasto

// Función para generar colores pastel aleatorios
function getPastelColor() {
    let r = Math.floor(Math.random() * 127 + 127); // 127-255
    let g = Math.floor(Math.random() * 127 + 127);
    let b = Math.floor(Math.random() * 127 + 127);
    return `rgb(${r},${g},${b})`;
}

// Clase para la flor
class Flower {
    constructor(x, y, size, text, speed) {
        this.posX = x;
        this.posY = y;
        this.size = size;
        this.originalColor = getPastelColor(); // Color pastel aleatorio
        this.color = this.originalColor;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.collisionCooldown = 0; // Contador para "flasheo" azul
    }

    // Método para dibujar una flor
    draw(context) {
        context.save();
        context.translate(this.posX, this.posY);
        
        // Dibujar los pétalos (5 en total)
        for (let i = 0; i < 5; i++) {
            context.beginPath();
            context.rotate((Math.PI * 2) / 5);
            context.fillStyle = this.color;
            context.arc(0, this.size / 2, this.size / 2, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }

        // Dibujar el centro de la flor
        context.beginPath();
        context.fillStyle = "#FFD700"; // Amarillo para el centro
        context.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        // Dibujar el texto en el centro
        context.fillStyle = "black";
        context.font = "16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, 0, 0);

        context.restore();
    }

    update(context, flowers) {
        this.draw(context);

        // Actualizar posición
        this.posX += this.dx;
        this.posY += this.dy;

        // Colisión con los bordes del canvas
        if (this.posX + this.size > window_width || this.posX - this.size < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.size > window_height || this.posY - this.size < 0) {
            this.dy = -this.dy;
        }

        // Verificar colisiones con otras flores
        for (let other of flowers) {
            if (other !== this && this.checkCollision(other)) {
                this.resolveCollision(other);
                this.collisionCooldown = 3; // Flasheo azul por 3 frames
                other.collisionCooldown = 3;
            }
        }

        // Reducir cooldown y restaurar color si ha pasado el tiempo
        if (this.collisionCooldown > 0) {
            this.color = "#0000FF"; // Azul breve tras colisión
            this.collisionCooldown--;
        } else {
            this.color = this.originalColor; // Restaurar color original pastel
        }
    }

    // Detectar colisión usando la distancia entre centros
    checkCollision(other) {
        let dx = this.posX - other.posX;
        let dy = this.posY - other.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size;
    }

    // Resolver colisión rebotando en dirección opuesta
    resolveCollision(other) {
        let angle = Math.atan2(other.posY - this.posY, other.posX - this.posX);
        
        // Invertir velocidades en la dirección del impacto
        this.dx = -Math.cos(angle) * this.speed;
        this.dy = -Math.sin(angle) * this.speed;
        other.dx = Math.cos(angle) * other.speed;
        other.dy = Math.sin(angle) * other.speed;
    }
}

// Crear un array para almacenar las flores
let flowers = [];

// Generar flores aleatorias
function generateFlowers(n) {
    for (let i = 0; i < n; i++) {
        let size = Math.random() * 30 + 20; // Tamaño entre 20 y 50
        let x = Math.random() * (window_width - size * 2) + size;
        let y = Math.random() * (window_height - size * 2) + size;
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `F${i + 1}`; // Etiqueta de la flor
        let newFlower = new Flower(x, y, size, text, speed);

        // Evitar superposición inicial
        let overlap = flowers.some(f => newFlower.checkCollision(f));
        while (overlap) {
            newFlower.posX = Math.random() * (window_width - size * 2) + size;
            newFlower.posY = Math.random() * (window_height - size * 2) + size;
            overlap = flowers.some(f => newFlower.checkCollision(f));
        }

        flowers.push(newFlower);
    }
}

// Animar las flores
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    flowers.forEach(flower => {
        flower.update(ctx, flowers);
    });
    requestAnimationFrame(animate);
}

// Generar 10 flores y comenzar animación
generateFlowers(10);
animate();
