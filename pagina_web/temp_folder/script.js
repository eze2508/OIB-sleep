function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar las animaciones al hacer scroll
    initScrollReveal();

    // Añadir comportamiento para ocultar/mostrar header al hacer scroll
    initHeaderScrollEffect();

    const modelViewer = document.querySelector('#bed-model');

    if (!modelViewer) return;

    const unitSystem = modelViewer.querySelector('#unit-system');
    const dimElements = [...modelViewer.querySelectorAll('button'), modelViewer.querySelector('#dimLines')];

    // Almacenar las dimensiones originales para conversión
    let dimensions = {
        width: 0,  // x
        height: 0, // y
        depth: 0   // z
    };

    // Función para actualizar las unidades de medida
    function updateUnits() {
        const isMetric = unitSystem.value === 'metric';

        if (!dimensions.width) return; // Si no hay dimensiones aún, no hacer nada

        // Actualizar los textos con las unidades correspondientes
        const widthValue = isMetric ? dimensions.width : dimensions.width / 2.54;
        const heightValue = isMetric ? dimensions.height : dimensions.height / 2.54;
        const depthValue = isMetric ? dimensions.depth : dimensions.depth / 2.54;

        const widthText = isMetric ?
            `${widthValue.toFixed(0)} cm` :
            `${widthValue.toFixed(1)} in`;

        const heightText = isMetric ?
            `${heightValue.toFixed(0)} cm` :
            `${heightValue.toFixed(1)} in`;

        const depthText = isMetric ?
            `${depthValue.toFixed(0)} cm` :
            `${depthValue.toFixed(1)} in`;

        // Actualizar los textos en las etiquetas
        modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = widthText;
        modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent = heightText;
        modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = heightText;
        modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = depthText;
        modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent = depthText;
    }

    // Evento para cambiar de sistema de unidades
    if (unitSystem) {
        unitSystem.addEventListener('change', updateUnits);
    }

    // Función para dibujar líneas
    function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
        if (dotHotspot1 && dotHotspot2) {
            svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
            svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
            svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
            svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

            if (dimensionHotspot && !dimensionHotspot.facingCamera) {
                svgLine.classList.add('hide');
            } else {
                svgLine.classList.remove('hide');
            }
        }
    }

    const dimLines = modelViewer.querySelectorAll('line');

    const renderSVG = () => {
        drawLine(
            dimLines[0],
            modelViewer.queryHotspot('hotspot-dot+X-Y+Z'),
            modelViewer.queryHotspot('hotspot-dot+X-Y-Z'),
            modelViewer.queryHotspot('hotspot-dim+X-Y')
        );
        drawLine(
            dimLines[1],
            modelViewer.queryHotspot('hotspot-dot+X-Y-Z'),
            modelViewer.queryHotspot('hotspot-dot+X+Y-Z'),
            modelViewer.queryHotspot('hotspot-dim+X-Z')
        );
        drawLine(
            dimLines[2],
            modelViewer.queryHotspot('hotspot-dot+X+Y-Z'),
            modelViewer.queryHotspot('hotspot-dot-X+Y-Z')
        );
        drawLine(
            dimLines[3],
            modelViewer.queryHotspot('hotspot-dot-X+Y-Z'),
            modelViewer.queryHotspot('hotspot-dot-X-Y-Z'),
            modelViewer.queryHotspot('hotspot-dim-X-Z')
        );
        drawLine(
            dimLines[4],
            modelViewer.queryHotspot('hotspot-dot-X-Y-Z'),
            modelViewer.queryHotspot('hotspot-dot-X-Y+Z'),
            modelViewer.queryHotspot('hotspot-dim-X-Y')
        );
    };

    modelViewer.addEventListener('load', () => {
        const center = modelViewer.getBoundingBoxCenter();
        const size = modelViewer.getDimensions();
        const x2 = size.x / 2;
        const y2 = size.y / 2;
        const z2 = size.z / 2;

        // Guardar dimensiones en centímetros para conversiones posteriores
        dimensions = {
            width: size.x * 100,  // ancho (x)
            height: size.y * 100, // alto (y)
            depth: size.z * 100   // profundidad (z)
        };

        modelViewer.updateHotspot({
            name: 'hotspot-dot+X-Y+Z',
            position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dim+X-Y',
            position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dot+X-Y-Z',
            position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dim+X-Z',
            position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dot+X+Y-Z',
            position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dim+Y-Z',
            position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dot-X+Y-Z',
            position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dim-X-Z',
            position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dot-X-Y-Z',
            position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dim-X-Y',
            position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
        });

        modelViewer.updateHotspot({
            name: 'hotspot-dot-X-Y+Z',
            position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
        });

        // Actualizar unidades iniciales
        updateUnits();

        renderSVG();

        modelViewer.addEventListener('camera-change', renderSVG);

        setInterval(renderSVG, 16);
    });
});

// Función para detectar elementos en el viewport y aplicar animaciones al hacer scroll
function initScrollReveal() {
    // Seleccionar todos los elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('p, h1, h2, h3, .footer-section');

    // Verificar si estamos en un dispositivo móvil
    const isMobile = window.innerWidth <= 768;

    // Añadir la clase scroll-reveal a todos los elementos que queremos animar
    elementsToAnimate.forEach(element => {
        // No aplicamos a elementos que ya tienen animación
        if (!element.classList.contains('description')) {
            // En dispositivos móviles usamos scroll-reveal, en computadoras usamos text-animation
            if (isMobile) {
                element.classList.add('scroll-reveal');
            } else {
                element.classList.add('text-animation');
            }
        }
    });

    // Función para verificar si un elemento está en el viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    // Función para activar las animaciones de los elementos visibles
    function checkVisibility() {
        elementsToAnimate.forEach(element => {
            if (isElementInViewport(element)) {
                if (element.classList.contains('scroll-reveal')) {
                    element.classList.add('active');
                }
                if (element.classList.contains('text-animation')) {
                    element.classList.add('animate');
                }
            }
        });
    }

    // Verificar visibilidad al cargar la página
    checkVisibility();

    // Verificar visibilidad al hacer scroll
    window.addEventListener('scroll', checkVisibility);
}

// Función para manejar el header al hacer scroll
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Si estamos en la parte superior de la página, siempre mostrar el header
        if (currentScroll <= 50) {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
            return;
        }
        
        // Si scrolleamos hacia abajo más allá de la altura del header, ocultarlo
        if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease';
        } 
        // Si scrolleamos hacia arriba, mostrar el header
        else if (currentScroll < lastScrollTop) {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para navegadores móviles
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las animaciones al hacer scroll
    initScrollReveal();
    
    // Inicializar el efecto del header al hacer scroll
    initHeaderScrollEffect();

    // Manejar el envío del formulario
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // FormSubmit manejará el envío real
            // Aquí solo mostramos un mensaje de confirmación
            setTimeout(function() {
                formMessage.className = 'form-message success';
                formMessage.textContent = '¡Mensaje enviado con éxito! Te responderemos pronto.';
                formMessage.style.display = 'block';
                contactForm.reset();
            }, 1000);
        });
    }
});