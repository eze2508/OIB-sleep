/**
 * Model Optimizer para <model-viewer>
 * Optimiza el rendimiento del modelo 3D según las capacidades del dispositivo
 */

class ModelOptimizer {
    constructor(modelViewerId = 'bed-model') {
        this.modelViewer = document.getElementById(modelViewerId);
        this.isMobile = window.innerWidth <= 768;
        this.deviceInfo = this.getDeviceInfo();
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        if (!this.modelViewer) return;
        
        // Aplicar optimizaciones basadas en el dispositivo
        this.applyOptimizations();
        
        // Configurar observadores de rendimiento
        this.setupPerformanceObservers();
        
        // Manejar eventos
        this.setupEventListeners();
    }
    
    getDeviceInfo() {
        return {
            memory: navigator.deviceMemory || 4,
            cores: navigator.hardwareConcurrency || 4,
            connection: navigator.connection ? navigator.connection.effectiveType : '4g',
            powerSaveMode: navigator.powerSavingEnabled || false,
            isLowEnd: this.isMobile && (
                (navigator.deviceMemory && navigator.deviceMemory < 4) || 
                (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
            ),
            isVeryLowEnd: this.isMobile && (
                (navigator.deviceMemory && navigator.deviceMemory < 2) || 
                (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2)
            ),
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }
    
    applyOptimizations() {
        // Optimizaciones básicas para móviles
        if (this.isMobile) {
            // Desactivar rotación automática
            if (this.modelViewer.hasAttribute('auto-rotate')) {
                this.modelViewer.removeAttribute('auto-rotate');
                console.log('Auto-rotate deshabilitado por optimizer');
            }
            
            // Reducir calidad de sombras
            this.modelViewer.setAttribute('shadow-intensity', '0.2');
            this.modelViewer.setAttribute('exposure', '0.7');
            
            // Eliminar fondos y ambiente para ahorrar recursos
            this.modelViewer.removeAttribute('environment-image');
            this.modelViewer.removeAttribute('skybox-image');
            
            // Configurar interacción optimizada
            this.modelViewer.setAttribute('interaction-prompt', 'none');
            this.modelViewer.setAttribute('interaction-prompt-threshold', '0');
            
            // Para dispositivos de gama baja
            if (this.deviceInfo.isLowEnd) {
                this.applyLowEndOptimizations();
            }
            
            // Para dispositivos muy limitados
            if (this.deviceInfo.isVeryLowEnd) {
                this.applyVeryLowEndOptimizations();
            }
        }
    }
    
    applyLowEndOptimizations() {
        // Reducir aún más la calidad visual
        this.modelViewer.setAttribute('min-camera-orbit', 'auto 0deg 105%');
        this.modelViewer.setAttribute('max-camera-orbit', 'auto 90deg 105%');
        this.modelViewer.removeAttribute('shadow-intensity');
        
        // Configurar el poster para cargar más rápido
        this.modelViewer.setAttribute('reveal', 'manual');
        this.modelViewer.setAttribute('loading', 'lazy');
        
        // Ejecutar código cuando el modelo se cargue
        this.modelViewer.addEventListener('load', () => {
            if (this.modelViewer.model) {
                // Reducir calidad del modelo
                if (typeof this.modelViewer.minimumRenderScale !== 'undefined') {
                    this.modelViewer.minimumRenderScale = 0.5;
                }
                
                // Revelar después de optimizar
                setTimeout(() => {
                    this.modelViewer.reveal();
                }, 300);
            }
        });
    }
    
    applyVeryLowEndOptimizations() {
        // Establecer timeout para reemplazar con imagen estática si tarda demasiado
        this.fallbackTimeout = setTimeout(() => {
            if (!this.modelViewer.loaded) {
                this.replaceWithStaticImage();
            }
        }, 5000);
    }
    
    replaceWithStaticImage() {
        // Crear reemplazo estático
        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'model-fallback';
        
        // Usar una imagen estática como fallback
        fallbackContainer.innerHTML = `
            <img src="Img/bed-static-fallback.jpg" alt="Modelo de cama OIB Sleep" class="model-static-fallback">
            <div class="fallback-message">Visualización optimizada para su dispositivo</div>
        `;
        
        // Reemplazar el model-viewer con la imagen estática
        if (this.modelViewer.parentNode) {
            this.modelViewer.parentNode.replaceChild(fallbackContainer, this.modelViewer);
        }
    }
    
    setupPerformanceObservers() {
        // Observar el rendimiento y ajustar según sea necesario
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    for (const entry of entries) {
                        // Si detectamos problemas de rendimiento, aplicar más optimizaciones
                        if (entry.entryType === 'longtask' && entry.duration > 100) {
                            this.handlePerformanceIssue();
                            break;
                        }
                    }
                });
                observer.observe({entryTypes: ['longtask']});
            } catch (e) {
                console.warn('PerformanceObserver not supported or blocked');
            }
        }
    }
    
    handlePerformanceIssue() {
        // Si hay problemas de rendimiento, aplicamos optimizaciones más agresivas
        console.log('Detectado problema de rendimiento, aplicando optimizaciones adicionales');
        
        if (this.modelViewer) {
            // Aplicar optimizaciones temporales
            const currentControls = this.modelViewer.hasAttribute('camera-controls');
            if (currentControls) {
                this.modelViewer.removeAttribute('camera-controls');
                setTimeout(() => {
                    this.modelViewer.setAttribute('camera-controls', '');
                }, 100);
            }
            
            // En casos extremos, reemplazar con imagen
            if (this.deviceInfo.isVeryLowEnd) {
                this.replaceWithStaticImage();
            }
        }
    }
    
    setupEventListeners() {
        if (!this.modelViewer) return;
        
        // Limpiar timeout si el modelo se carga correctamente
        this.modelViewer.addEventListener('load', () => {
            if (this.fallbackTimeout) {
                clearTimeout(this.fallbackTimeout);
            }
        });
        
        // Ajustar rendimiento en cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.applyOptimizations();
            }, 300);
        });
    }
}

// Inicializar el optimizador cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    new ModelOptimizer('bed-model');
});
