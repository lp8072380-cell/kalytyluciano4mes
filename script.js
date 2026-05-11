// Sistema optimizado de estrellas fugaces
let shootingStarCount = 0;
const maxShootingStars = 3; // Máximo de estrellas en pantalla simultáneamente

function createShootingStarWithTrail() {
    // Limitar cantidad de estrellas
    if (shootingStarCount >= maxShootingStars) {
        return;
    }
    
    const starsContainer = document.querySelector('.stars-container');
    
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    
    // Posición inicial aleatoria
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.6);
    
    // Ángulo para trayectoria diagonal
    const angle = 30 + Math.random() * 60;
    const speed = 4 + Math.random() * 3;
    
    starsContainer.appendChild(shootingStar);
    shootingStarCount++;
    
    const radians = (angle * Math.PI) / 180;
    const velocityX = speed * Math.cos(radians);
    const velocityY = speed * Math.sin(radians);
    
    let x = startX;
    let y = startY;
    let frameCount = 0;
    const maxFrames = 150;
    
    function animate() {
        frameCount++;
        
        x += velocityX;
        y += velocityY;
        
        if (frameCount >= maxFrames || x < -50 || x > window.innerWidth + 50 || y > window.innerHeight + 50) {
            shootingStar.remove();
            shootingStarCount--;
            return;
        }
        
        // Usar transform para mejor rendimiento
        const opacity = 1 - (frameCount / maxFrames);
        shootingStar.style.transform = `translate(${x}px, ${y}px)`;
        shootingStar.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function startShootingStars() {
    // Primera lluvia de estrellas al cargar
    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            createShootingStarWithTrail();
        }, i * 300);
    }
    
    // Generar estrellas fugaces de manera más espaciada
    setInterval(() => {
        if (Math.random() > 0.3 && shootingStarCount < maxShootingStars) {
            createShootingStarWithTrail();
        }
    }, 2000 + Math.random() * 2000); // Cada 2-4 segundos
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

// Sistema de Audio Web API optimizado
let audioContext = null;
const oscillators = [];

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Función para reproducir un sonido con frecuencia específica
function playStarSound(frequency) {
    try {
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
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        // Reproducir sonido
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    } catch (e) {
        console.error('Error reproduciendo sonido:', e);
    }
}

// Event listeners para las estrellas
function initializeStars() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const frequency = parseFloat(this.getAttribute('data-note'));
            playStarSound(frequency);
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
