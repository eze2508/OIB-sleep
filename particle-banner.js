/**
 * Efecto de partículas avanzado para el banner "Sobre Nosotros"
 */
class ParticleBanner {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    this.colors = ['#38bdf8', '#1e3a8a', '#f59e0b', '#ffffff'];
    
    this.init();
    this.animate();
  }
  
  init() {
    // Configurar el canvas
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.container.appendChild(this.canvas);
    
    // Crear partículas
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
    
    // Manejar el redimensionamiento
    window.addEventListener('resize', () => {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
    });
  }
  
  createParticle() {
    const size = Math.random() * 5 + 1;
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const directionX = Math.random() * 0.6 - 0.3;
    const directionY = Math.random() * 0.6 - 0.3;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const opacity = Math.random() * 0.6 + 0.1;
    
    this.particles.push({
      x, y, size, directionX, directionY, color, opacity
    });
  }
  
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
    this.ctx.fill();
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = 0.7 - (distance / 120);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Mover la partícula
      p.x += p.directionX;
      p.y += p.directionY;
      
      // Rebote en los bordes
      if (p.x < 0 || p.x > this.canvas.width) {
        p.directionX *= -1;
      }
      
      if (p.y < 0 || p.y > this.canvas.height) {
        p.directionY *= -1;
      }
      
      // Dibujar la partícula
      this.drawParticle(p);
    }
  }
  
  animate() {
    // Limpiar el canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Actualizar y dibujar partículas
    this.updateParticles();
    this.drawConnections();
    
    // Solicitar el siguiente frame
    requestAnimationFrame(() => this.animate());
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const particleEffect = new ParticleBanner('particles-container');
  
  // Inicializar las animaciones al scroll
  initScrollAnimations();
  
  // Inicializar el efecto tilt
  initTiltEffect();
});

// Función para manejar las animaciones al hacer scroll
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Función para inicializar el efecto tilt en las tarjetas de equipo
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.tilt-effect');
  
  tiltElements.forEach(element => {
    element.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 15;
      const moveY = (y - centerY) / 15;
      
      this.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}
