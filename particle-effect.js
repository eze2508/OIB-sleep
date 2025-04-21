class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        // Tamaño más pequeño para un efecto más sutil
        this.size = Math.random() * 3 + 1; 
        this.color = color || '#38bdf8'; // Cambiado a celeste en lugar de naranja
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.lifespan = 100;
        this.opacity = 0.8; // Reducida ligeramente la opacidad inicial
    }

    // Actualizar posición y estado
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifespan -= 2;
        this.opacity = this.lifespan / 100;
        this.size -= 0.05;
    }

    // Dibujar la partícula
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba');
        ctx.fill();
    }
}

class PatronusEffect {
    constructor() {
        // Crear el canvas y añadirlo al body
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // No interfiere con los clics
        this.canvas.style.zIndex = '999'; // Por encima de todo
        document.body.appendChild(this.canvas);
        
        // Obtener contexto y ajustar tamaño
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Variables para el efecto
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.isMoving = false;
        this.moveThreshold = 5;
        this.timeoutId = null;
        
        // Inicializar eventos y animación
        this.initEvents();
        this.animate();
        
        // Colores temáticos cambiados con tonos celestes
        this.colors = [
            'rgb(56, 189, 248)', // Celeste principal - #38bdf8
            'rgb(30, 58, 138)',  // Azul oscuro - #1e3a8a (mantenido)
            'rgb(14, 165, 233)'  // Celeste más oscuro - #0ea5e9
        ];
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initEvents() {
        // Actualizar posición del mouse
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Determinar si se está moviendo el mouse lo suficiente
            const dx = this.mouseX - this.lastX;
            const dy = this.mouseY - this.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.moveThreshold) {
                this.isMoving = true;
                this.createParticles();
                this.lastX = this.mouseX;
                this.lastY = this.mouseY;
                
                // Reiniciar el temporizador
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => {
                    this.isMoving = false;
                }, 100);
            }
        });
        
        // Ajustar canvas si cambia el tamaño de la ventana
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    createParticles() {
        // Crear menos partículas para un efecto más sutil
        const numParticles = Math.floor(Math.random() * 3) + 2; // 2-4 partículas
        
        for (let i = 0; i < numParticles; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.particles.push(new Particle(this.mouseX, this.mouseY, color));
        }
    }
    
    animate() {
        // Limpiar el canvas con transparencia
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Actualizar y dibujar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            
            // Eliminar partículas que ya no son visibles
            if (particle.lifespan <= 0 || particle.size <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            particle.draw(this.ctx);
        }
        
        // Continuar la animación
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar el efecto cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new PatronusEffect();
});
