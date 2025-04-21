/**
 * Enhanced Smooth Scroll
 * Provides improved smooth scrolling behavior with easing effects
 */

// Opciones para el scroll suave
const scrollOptions = {
  // Velocidad de desplazamiento (ms)
  speed: 800,
  // Margen superior para compensar el header fijo (px)
  offset: 60,
  // Función de easing para una animación más natural
  easing: 'easeInOutQuint'
};

// Funciones de easing para el scroll
const easingFunctions = {
  // Movimiento lineal
  linear: t => t,
  // Aceleración suave al inicio y final
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  // Aceleración más pronunciada al inicio y final
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  // Aceleración y desaceleración muy pronunciada
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
};

// Función principal para scroll suave
function smoothScroll(target, duration = scrollOptions.speed) {
  // Si no es un elemento DOM, buscar por ID
  if (typeof target === 'string') {
    target = document.querySelector(target);
  }
  
  // Si no se encuentra el objetivo, terminar
  if (!target) return;
  
  const startPosition = window.pageYOffset;
  const targetPosition = target.getBoundingClientRect().top + startPosition - scrollOptions.offset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easing = easingFunctions[scrollOptions.easing](progress);
    
    window.scrollTo(0, startPosition + distance * easing);
    
    // Continuar la animación si no ha terminado
    if (elapsedTime < duration) {
      requestAnimationFrame(animation);
    } else {
      // Ajustar final para compensar posibles errores de redondeo
      window.scrollTo(0, targetPosition);
    }
  }
  
  requestAnimationFrame(animation);
}

// Detección y manejo de clics en enlaces de anclaje
document.addEventListener('DOMContentLoaded', function() {
  // Capturar clics en enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignorar si es solo "#" o no existe el elemento destino
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      smoothScroll(targetElement);
      
      // Si es un enlace de navegación y estamos en móvil, cerrar el menú
      if (window.innerWidth <= 768 && this.closest('.nav-links')) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });
  
  // Botón de "volver arriba" que aparece al desplazarse
  createScrollToTopButton();
  
  // Indicador de progreso de scroll
  createScrollProgressIndicator();
});

// Crear botón para volver al inicio
function createScrollToTopButton() {
  // Crear elemento
  const scrollButton = document.createElement('button');
  scrollButton.classList.add('scroll-to-top');
  scrollButton.innerHTML = '&#8679;'; // Flecha hacia arriba
  scrollButton.setAttribute('aria-label', 'Volver arriba');
  scrollButton.style.opacity = '0';
  
  // Añadir al DOM
  document.body.appendChild(scrollButton);
  
  // Mostrar/ocultar botón según la posición de scroll
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollButton.style.opacity = '1';
      scrollButton.style.transform = 'translateY(0)';
    } else {
      scrollButton.style.opacity = '0';
      scrollButton.style.transform = 'translateY(20px)';
    }
  });
  
  // Acción al hacer clic
  scrollButton.addEventListener('click', function() {
    smoothScroll(document.documentElement);
  });
}

// Crear indicador de progreso de scroll
function createScrollProgressIndicator() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
  });
}

// Exportar funcionalidad para posible uso directo
window.smoothScroll = smoothScroll;
