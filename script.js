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

// Función para calcular las horas transcurridas
function updateHoursCounter() {
    const startDate = new Date('2026-01-14T00:00:00').getTime();
    const currentDate = new Date().getTime();
    const hoursElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60));
    
    const hoursDisplay = document.getElementById('hoursDisplay');
    if (hoursDisplay) {
        hoursDisplay.textContent = hoursElapsed.toLocaleString('es-ES');
    }
}

// Actualizar el contador cada minuto
function startHoursCounter() {
    updateHoursCounter(); // Actualización inicial
    setInterval(updateHoursCounter, 60000); // Actualizar cada minuto
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    startShootingStars();
    startHoursCounter();
});
