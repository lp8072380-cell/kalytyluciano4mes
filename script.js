// Función para crear estrellas fugaces animadas
function createShootingStar() {
    const starsContainer = document.querySelector('.stars-container');
    
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    
    // Posición inicial aleatoria en la parte superior
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.5);
    
    // Ángulo aleatorio para la dirección (hacia abajo y a la derecha)
    const angle = 45 + Math.random() * 40; // Entre 45 y 85 grados
    
    shootingStar.style.left = startX + 'px';
    shootingStar.style.top = startY + 'px';
    
    starsContainer.appendChild(shootingStar);
    
    // Crear animación de movimiento
    const duration = 2 + Math.random() * 1; // Entre 2 y 3 segundos
    const distance = 300 + Math.random() * 200; // Distancia que viajará
    
    const radians = (angle * Math.PI) / 180;
    const endX = startX + distance * Math.cos(radians);
    const endY = startY + distance * Math.sin(radians);
    
    let startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / (duration * 1000);
        
        if (progress >= 1) {
            shootingStar.remove();
            return;
        }
        
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        
        // Reducir opacidad hacia el final
        const opacity = 1 - (progress * 0.5);
        
        shootingStar.style.left = currentX + 'px';
        shootingStar.style.top = currentY + 'px';
        shootingStar.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function createShootingStarWithTrail() {
    const starsContainer = document.querySelector('.stars-container');
    
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    
    // Posición inicial aleatoria
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.6);
    
    // Ángulo para trayectoria diagonal
    const angle = 30 + Math.random() * 60;
    const speed = 3 + Math.random() * 4;
    
    let x = startX;
    let y = startY;
    
    shootingStar.style.left = x + 'px';
    shootingStar.style.top = y + 'px';
    
    starsContainer.appendChild(shootingStar);
    
    const radians = (angle * Math.PI) / 180;
    const velocityX = speed * Math.cos(radians);
    const velocityY = speed * Math.sin(radians);
    
    let frameCount = 0;
    const maxFrames = 200;
    
    function animate() {
        frameCount++;
        
        x += velocityX;
        y += velocityY;
        
        if (frameCount >= maxFrames || x < -50 || x > window.innerWidth + 50 || y > window.innerHeight + 50) {
            shootingStar.remove();
            return;
        }
        
        // Reducir opacidad progresivamente
        const opacity = 1 - (frameCount / maxFrames);
        shootingStar.style.left = x + 'px';
        shootingStar.style.top = y + 'px';
        shootingStar.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Generar estrellas fugaces periódicamente
function startShootingStars() {
    // Primera lluvia de estrellas al cargar
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createShootingStarWithTrail();
        }, i * 300);
    }
    
    // Generar estrellas fugaces cada 1-2 segundos
    setInterval(() => {
        if (Math.random() > 0.4) {
            createShootingStarWithTrail();
        }
        
        // Ocasionalmente generar múltiples estrellas
        if (Math.random() > 0.8) {
            setTimeout(() => createShootingStarWithTrail(), 200);
        }
    }, 1500 + Math.random() * 1500);
}

// Función para calcular el tiempo transcurrido completo
function updateFullCounter() {
    const startDate = new Date('2026-01-14T00:00:00').getTime();
    const currentDate = new Date().getTime();
    const totalMilliseconds = currentDate - startDate;
    
    // Calcular días, horas, minutos y segundos
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    
    const remainingHours = totalHours % 24;
    const remainingMinutes = totalMinutes % 60;
    const remainingSeconds = totalSeconds % 60;
    
    // Actualizar elementos
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = remainingHours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = remainingMinutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = remainingSeconds.toString().padStart(2, '0');
}

// Actualizar el contador cada segundo
function startFullCounter() {
    updateFullCounter(); // Actualización inicial
    setInterval(updateFullCounter, 1000); // Actualizar cada segundo
}

// Sistema de Audio Web API
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Función para reproducir un sonido con frecuencia específica
function playStarSound(frequency) {
    const context = initAudioContext();
    const now = context.currentTime;
    
    // Crear oscilador
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    
    oscillator.connect(gain);
    gain.connect(context.destination);
    
    // Configurar sonido
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    // Envelope ADSR simplificado
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    // Reproducir sonido
    oscillator.start(now);
    oscillator.stop(now + 0.5);
}

// Event listeners para las estrellas
function initializeStars() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const frequency = parseFloat(this.getAttribute('data-note'));
            playStarSound(frequency);
            
            // Agregar efecto visual
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
        
        star.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const frequency = parseFloat(this.getAttribute('data-note'));
            playStarSound(frequency);
        });
    });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    startShootingStars();
    startFullCounter();
    initializeStars();
});
