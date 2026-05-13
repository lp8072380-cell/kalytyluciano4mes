// ====================================================
// OPTIMIZACIÓN PARA RENDIMIENTO EN MÓVILES Y PC LENTAS
// ====================================================

// Detección de dispositivo mejorada
const isMobile = () => {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isSlowDevice = () => isMobile();

// Variables globales - cachear selectores
const DOM = {
    starsContainer: document.querySelector('.stars-container'),
    stars: document.querySelectorAll('.star'),
    daysElement: document.getElementById('days'),
    hoursElement: document.getElementById('hours'),
    minutesElement: document.getElementById('minutes'),
    secondsElement: document.getElementById('seconds'),
    starMessage: document.getElementById('starMessage'),
    sapito: document.getElementById('sapito'),
    sapitoBubble: document.getElementById('sapitoBubble'),
    sapitoWindow: document.getElementById('sapitoWindow'),
    sapitoClose: document.getElementById('sapitoClose'),
    sapitoChat: document.getElementById('sapitoChat'),
    sapitoForm: document.getElementById('sapitoForm'),
    sapitoInput: document.getElementById('sapitoInput'),
};

// Sistema optimizado de estrellas fugaces
let shootingStarCount = 0;
const MAX_SHOOTING_STARS = isSlowDevice() ? 0 : 1;
const MAX_FRAMES = isSlowDevice() ? 80 : 100;

function createShootingStarWithTrail() {
    if (shootingStarCount >= MAX_SHOOTING_STARS || !DOM.starsContainer) {
        return;
    }

    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.6);
    const angle = 30 + Math.random() * 60;
    const speed = 4 + Math.random() * 2;

    DOM.starsContainer.appendChild(shootingStar);
    shootingStarCount++;

    const radians = (angle * Math.PI) / 180;
    const velocityX = speed * Math.cos(radians);
    const velocityY = speed * Math.sin(radians);

    let x = startX;
    let y = startY;
    let frameCount = 0;
    let animationId;

    const animate = () => {
        frameCount++;
        x += velocityX;
        y += velocityY;

        if (frameCount >= MAX_FRAMES || x < -50 || x > window.innerWidth + 50 || y > window.innerHeight + 50) {
            shootingStar.remove();
            shootingStarCount--;
            cancelAnimationFrame(animationId);
            return;
        }

        shootingStar.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        shootingStar.style.opacity = 1 - (frameCount / MAX_FRAMES);
        animationId = requestAnimationFrame(animate);
    };

    animate();
}

function startShootingStars() {
    if (isSlowDevice()) return; // No ejecutar en móvil

    // Primera lluvia al cargar
    setTimeout(() => {
        createShootingStarWithTrail();
    }, 500);

    // Generar estrellas ocasionalmente
    setInterval(() => {
        if (Math.random() > 0.4 && shootingStarCount < MAX_SHOOTING_STARS) {
            createShootingStarWithTrail();
        }
    }, 3000 + Math.random() * 2000);
}

// Contador optimizado
const TARGET_DATE = new Date('2026-01-14T00:00:00').getTime();

function updateFullCounter() {
    const elapsed = Date.now() - TARGET_DATE;
    if (elapsed < 0) return;

    const totalSeconds = Math.floor(elapsed / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (DOM.daysElement) DOM.daysElement.textContent = String(days).padStart(2, '0');
    if (DOM.hoursElement) DOM.hoursElement.textContent = String(hours).padStart(2, '0');
    if (DOM.minutesElement) DOM.minutesElement.textContent = String(minutes).padStart(2, '0');
    if (DOM.secondsElement) DOM.secondsElement.textContent = String(seconds).padStart(2, '0');
}

function startFullCounter() {
    updateFullCounter();
    // En móvil: cada 10 segundos. En PC: cada 1 segundo
    const interval = isSlowDevice() ? 10000 : 1000;
    setInterval(updateFullCounter, interval);
}

// Audio API - optimizado
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    return audioContext;
}

function playStarSound(frequency) {
    try {
        const context = initAudioContext();
        if (context.state === 'suspended') {
            context.resume();
        }
        const now = context.currentTime;

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    } catch (e) {
        console.warn('Audio error:', e.message);
    }
}

function playFrogSound() {
    try {
        const context = initAudioContext();
        if (context.state === 'suspended') {
            context.resume();
        }

        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(132, now);
        oscillator.frequency.exponentialRampToValueAtTime(62, now + 0.18);
        oscillator.frequency.setValueAtTime(118, now + 0.22);
        oscillator.frequency.exponentialRampToValueAtTime(68, now + 0.44);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(720, now);
        filter.frequency.exponentialRampToValueAtTime(220, now + 0.44);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.24, now + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
    } catch (e) {
        console.warn('Frog audio error:', e.message);
    }
}

function setFrogSpeech(text) {
    if (!DOM.sapitoBubble) return;
    DOM.sapitoBubble.textContent = text;
}

function animateSapito() {
    if (!DOM.sapito) return;
    DOM.sapito.classList.remove('is-croaking');
    void DOM.sapito.offsetWidth;
    DOM.sapito.classList.add('is-croaking');
    window.setTimeout(() => DOM.sapito.classList.remove('is-croaking'), 520);
}

function addChatMessage(text, type = 'frog') {
    if (!DOM.sapitoChat) return;

    const message = document.createElement('div');
    message.classList.add('chat-message', type === 'user' ? 'user-message' : 'frog-message');
    message.textContent = text;
    DOM.sapitoChat.appendChild(message);
    DOM.sapitoChat.scrollTop = DOM.sapitoChat.scrollHeight;
}

function openSapitoWindow() {
    if (!DOM.sapitoWindow) return;

    DOM.sapitoWindow.classList.add('is-open');
    DOM.sapitoWindow.setAttribute('aria-hidden', 'false');
    setFrogSpeech('Hola Kalyt, ¿eres Kalyt verdad?');
    window.setTimeout(() => DOM.sapitoInput?.focus(), 120);
}

function closeSapitoWindow() {
    if (!DOM.sapitoWindow) return;

    DOM.sapitoWindow.classList.remove('is-open');
    DOM.sapitoWindow.setAttribute('aria-hidden', 'true');
}

const sapitoReplies = [
    'Luciano dice que Kalyt no es una estrella: es el cielo completo.',
    'Mi análisis sapito confirma amor extremo, ternura alta y ganas infinitas de cuidarte.',
    'Si Luciano pudiera guardar un momento, guardaría todos los que tiene con vos.',
    'Croac traducción: Luciano te ama muchísimo, muchísimo, muchísimo más.',
    'Kalyt, sos el mensajito bonito que Luciano quiere leer todos los días.',
];

function getSapitoReply(input) {
    const text = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (text.includes('hola')) {
        return 'Hola Kalyt, ¿eres Kalyt verdad? Porque Luciano me habló de alguien preciosa y todo apunta a vos.';
    }

    if (text.includes('luciano')) {
        return 'Luciano está modo corazón gigante: piensa en vos, te presume en secreto y me programó para recordarte que te ama.';
    }

    if (text.includes('amor') || text.includes('ama') || text.includes('quier')) {
        return 'Respuesta oficial del sapito: sí, Luciano te ama con todo su corazoncito y un croac extra.';
    }

    if (text.includes('piquito') || text.includes('poquito') || text.includes('muchisimo')) {
        return '¿Un piquito más? Muchísimo más jeje. Luciano no sabe amar poquito cuando se trata de Kalyt.';
    }

    if (text.includes('kalyt')) {
        return 'Kalyt detectada. Nivel de ternura: altísimo. Nivel de amor de Luciano: fuera de la galaxia.';
    }

    return sapitoReplies[Math.floor(Math.random() * sapitoReplies.length)];
}

let messageTimeout = null;
let sapitoTouches = 0;

function showStarMessage(star) {
    if (!DOM.starMessage) return;

    const message = star.dataset.message;
    if (!message) return;

    window.clearTimeout(messageTimeout);
    DOM.stars.forEach(item => item.classList.remove('is-active'));
    star.classList.add('is-active');
    DOM.starMessage.classList.add('is-changing');

    messageTimeout = window.setTimeout(() => {
        DOM.starMessage.textContent = message;
        DOM.starMessage.classList.remove('is-changing');
    }, 160);

    if (star.dataset.frogLine) {
        setFrogSpeech(star.dataset.frogLine);
    }
}

// Partículas - SOLO EN DESKTOP
function createParticles(x, y) {
    if (isSlowDevice()) return; // No crear partículas en móvil

    const particleCount = 3; // Reducido a 3
    const particles = ['✨', '💫', '⭐'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = particles[i];

        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 60 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1200);
    }
}

// Haptic feedback
function triggerHaptic() {
    if (navigator.vibrate && isSlowDevice()) {
        navigator.vibrate(30); // Menos tiempo de vibración
    }
}

// Inicializar estrellas interactivas
function initializeStars() {
    if (!DOM.stars.length) return;

    const handler = function(e) {
        e.preventDefault?.();

        const frequency = parseFloat(this.getAttribute('data-note'));
        playStarSound(frequency);
        triggerHaptic();

        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createParticles(centerX, centerY);
        showStarMessage(this);
    };

    DOM.stars.forEach(star => {
        star.addEventListener('click', handler);
    });
}

function initializeSapito() {
    if (!DOM.sapito) return;

    DOM.sapito.addEventListener('click', () => {
        sapitoTouches++;
        playFrogSound();
        animateSapito();
        triggerHaptic();

        if (sapitoTouches === 1) {
            setFrogSpeech('Croac. Tengo una mini IA escondida para Kalyt.');
            return;
        }

        openSapitoWindow();
    });

    DOM.sapitoClose?.addEventListener('click', closeSapitoWindow);
    DOM.sapitoWindow?.addEventListener('click', event => {
        if (event.target === DOM.sapitoWindow) {
            closeSapitoWindow();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeSapitoWindow();
        }
    });

    DOM.sapitoForm?.addEventListener('submit', event => {
        event.preventDefault();

        const question = DOM.sapitoInput?.value.trim();
        if (!question) return;

        addChatMessage(question, 'user');
        if (DOM.sapitoInput) {
            DOM.sapitoInput.value = '';
        }

        window.setTimeout(() => {
            const reply = getSapitoReply(question);
            addChatMessage(reply, 'frog');
            setFrogSpeech(reply);
            playFrogSound();
            animateSapito();
        }, 280);
    });
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    startShootingStars();
    startFullCounter();
    initializeStars();
    initializeSapito();
}
