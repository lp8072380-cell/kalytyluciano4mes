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
    sapitoSuggestions: document.querySelectorAll('.sapito-suggestions button'),
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
const frogAudio = new Audio('assets/sounds/pigfrog-evergladesnp.ogg');
frogAudio.preload = 'auto';
frogAudio.volume = 0.85;
const SAPITO_AI_NAME = 'Lunacroac';

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
    frogAudio.currentTime = 0;
    frogAudio.play().catch(() => playSyntheticFrogSound());
}

function playSyntheticFrogSound() {
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

function showTypingIndicator() {
    if (!DOM.sapitoChat) return null;

    const message = document.createElement('div');
    message.classList.add('chat-message', 'frog-message', 'typing-message');
    message.textContent = `${SAPITO_AI_NAME} está pensando...`;
    DOM.sapitoChat.appendChild(message);
    DOM.sapitoChat.scrollTop = DOM.sapitoChat.scrollHeight;
    return message;
}

function openSapitoWindow() {
    if (!DOM.sapitoWindow) return;

    DOM.sapitoWindow.classList.add('is-open');
    DOM.sapitoWindow.setAttribute('aria-hidden', 'false');
    setFrogSpeech(`Hola, soy ${SAPITO_AI_NAME}. ¿Eres Kalyt verdad?`);
    window.setTimeout(() => DOM.sapitoInput?.focus(), 120);
}

function closeSapitoWindow() {
    if (!DOM.sapitoWindow) return;

    DOM.sapitoWindow.classList.remove('is-open');
    DOM.sapitoWindow.setAttribute('aria-hidden', 'true');
}

const sapitoMemory = {
    interactions: 0,
    lastTopic: 'saludo',
    lastQuestion: '',
    lastReply: '',
    mood: 'romantico',
    history: [],
};

const sapitoReplies = {
    saludo: [
        `Hola Kalyt, ¿eres Kalyt verdad? Soy ${SAPITO_AI_NAME}, tu sapito lunar con licencia para hablar bonito.`,
        `Croac, Kalyt detectada. ${SAPITO_AI_NAME} entrando en modo ternura.`,
    ],
    identidad: [
        `Me llamo ${SAPITO_AI_NAME}: mitad luna, mitad croac, cien por ciento enviado por Luciano.`,
        `Soy ${SAPITO_AI_NAME}, una mini IA sapito que vive entre estrellas para recordarte cuánto te quiere Luciano.`,
    ],
    luciano: [
        'Luciano está modo corazón gigante: piensa en vos, te presume en secreto y me programó para recordarte que te ama.',
        'Luciano no te quiere poquito: te quiere con plan de quedarse, cuidarte y hacerte sonreír hasta en días raros.',
        'Si Luciano pudiera ponerle nombre a su lugar favorito, probablemente sería Kalyt.',
    ],
    kalyt: [
        'Kalyt detectada. Nivel de ternura: altísimo. Nivel de amor de Luciano: fuera de la galaxia.',
        'Kalyt, sos el mensajito bonito que Luciano quiere leer todos los días.',
        'Según mis cálculos de sapito lunar, Kalyt hace que todo brille más bonito.',
    ],
    amor: [
        'Respuesta oficial de Lunacroac: sí, Luciano te ama con todo su corazoncito y un croac extra.',
        'Luciano dice que Kalyt no es una estrella: es el cielo completo.',
        'Croac traducción: Luciano te ama muchísimo, muchísimo, muchísimo más.',
    ],
    ternura: [
        'Mensaje tierno: Luciano te mira como quien encontró una constelación que no quiere perder.',
        'Si hoy necesitás una señal bonita, acá va: Luciano elegiría coincidir con vos otra vez.',
        'Ternura activada: sos ese pedacito de universo donde Luciano se queda tranquilo.',
    ],
    risa: [
        'Chiste sapito: Luciano me pidió ser serio, pero yo dije croac... y se me cayó la dignidad al charquito.',
        'Dato científico inventado: cada vez que Kalyt sonríe, un sapito aprende a bailar en la luna.',
        'Modo gracioso: no soy celoso, pero si una estrella mira mucho a Kalyt, le hago croac de advertencia.',
    ],
    estrellas: [
        'Las estrellas hacen ruido bajito cuando Kalyt aparece. No lo digo yo, lo dice mi antenita lunar.',
        'El universo es enorme, pero Luciano igual encontró su rincón favorito: vos.',
        'Si una estrella cae hoy, seguro viene a pedirle consejos a Kalyt para brillar así.',
    ],
    animo: [
        'Si hoy estás bajita, Lunacroac se sienta cerquita: Luciano te quiere incluso en tus días nublados.',
        'Respirá, Kalyt. No tenés que brillar todo el tiempo para que Luciano te mire con amor.',
        'Croac suavecito: sos querida, sos importante y Luciano está feliz de tenerte.',
    ],
    poquito: [
        '¿Un poquito más? Muchísimo más jeje. Luciano no sabe amar poquito cuando se trata de Kalyt.',
        'Poquito dice... pero el corazón de Luciano escuchó “muchísimo, con repetición y croac incluido”.',
    ],
    default: [
        'Estoy pensando con mi cerebro de charquito lunar... y mi conclusión es que Luciano te quiere demasiado bonito.',
        'No sé todo del universo, pero sí sé esto: Luciano y Kalyt suenan como una historia preciosa.',
        'Lunacroac responde: si tiene que ver con amor, Luciano ya está levantando la mano por Kalyt.',
    ],
};

function normalizeText(input) {
    return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function rememberExchange(question, reply, topic) {
    sapitoMemory.lastQuestion = question;
    sapitoMemory.lastReply = reply;
    sapitoMemory.lastTopic = topic;
    sapitoMemory.history.push({ question, reply, topic });

    if (sapitoMemory.history.length > 6) {
        sapitoMemory.history.shift();
    }
}

function chooseReply(topic) {
    const replies = sapitoReplies[topic] || sapitoReplies.default;
    const reply = replies[sapitoMemory.interactions % replies.length];
    sapitoMemory.interactions++;

    if (sapitoMemory.interactions > 2 && sapitoMemory.interactions % 4 === 0) {
        return `${reply} Ya guardé ${sapitoMemory.interactions} croacs de esta charla en mi lunita.`;
    }

    return reply;
}

function detectSapitoIntent(text) {
    if (text.includes('carta') || text.includes('mensaje largo') || text.includes('dedicatoria')) return 'carta';
    if (text.includes('poema') || text.includes('verso') || text.includes('rima')) return 'poema';
    if (text.includes('consejo') || text.includes('ayuda') || text.includes('que hago')) return 'consejo';
    if (text.includes('pregunta') || text.includes('preguntame')) return 'pregunta';
    if (text.includes('lista') || text.includes('ideas') || text.includes('sorpresa')) return 'ideas';
    if (text.includes('resumen') || text.includes('explica') || text.includes('porque') || text.includes('por que')) return 'explicar';
    if (text.includes('repite') || text.includes('otra vez') || text.includes('mas')) return 'continuar';
    return null;
}

function buildLongFormReply(intent, originalInput) {
    const intro = 'Claro, Kalyt. Modo Lunacroac tipo chat activado.';

    if (intent === 'carta') {
        return `${intro}\n\nPara Kalyt:\nDesde que llegaste, Luciano tiene una forma más bonita de mirar los días. No es solo que te quiera: es que contigo todo se vuelve más suave, más gracioso y más suyo.\n\nSi alguna vez dudás de lo especial que sos, acordate de esto: Luciano hizo hasta un sapito lunar para decirte, de mil maneras, que te ama muchísimo más.\n\nCon amor, croacs y estrellitas,\nLunacroac.`;
    }

    if (intent === 'poema') {
        return `Kalyt, lunita en el cielo,\nLuciano te mira y sonríe,\nsi el mundo se pone feo,\ntu nombre bonito lo guía.\n\nNo es poquito, no es normal,\nes amor con brillo espacial.`;
    }

    if (intent === 'consejo') {
        return `${intro}\n\nMi consejo bonito: no midas el amor solo por palabras enormes. Miralo en los detalles: en quien se queda, en quien intenta, en quien quiere hacerte reír aunque sea con un sapito medio dramático.\n\nY de Luciano para vos: dejate querer tranquila, porque su cariño viene con ganas de cuidarte.`;
    }

    if (intent === 'pregunta') {
        return 'Pregunta tierna para Kalyt: si pudieras guardar un momento con Luciano en una estrellita, ¿cuál guardarías y por qué?';
    }

    if (intent === 'ideas') {
        return `Ideas de Lunacroac para una sorpresa:\n1. Una notita que diga “un poquito más no: muchísimo más”.\n2. Una foto de ustedes con una frase cortita.\n3. Una mini playlist para escuchar juntos.\n4. Un mensaje a medianoche diciendo algo simple pero real.\n5. Tocar una estrella de esta web y dejar que el sapito haga su show.`;
    }

    if (intent === 'explicar') {
        return `${intro}\n\nTe lo explico simple: esta mini IA no es ChatGPT real con internet; es Lunacroac usando reglas, memoria cortita y respuestas preparadas para sonar más natural. Lo importante es que puede seguir el tono de lo que pedís: carta, poema, consejo, risa o ternura.\n\nY su tema favorito, obviamente, es cuánto ama Luciano a Kalyt.`;
    }

    if (intent === 'continuar' && sapitoMemory.lastReply) {
        return `Sigo con eso:\n\n${sapitoMemory.lastReply}\n\nY agrego un croac extra: Luciano no quiere que esto sea solo bonito hoy, quiere que siga siendo bonito mañana también.`;
    }

    return null;
}

function getSapitoReply(input) {
    const text = normalizeText(input);
    const intent = detectSapitoIntent(text);

    if (intent) {
        const reply = buildLongFormReply(intent, input);
        if (reply) {
            sapitoMemory.interactions++;
            rememberExchange(input, reply, intent);
            return reply;
        }
    }

    let topic = 'default';

    if (text.includes('hola')) {
        topic = 'saludo';
    } else if (text.includes('quien eres') || text.includes('como te llamas') || text.includes('nombre')) {
        topic = 'identidad';
    } else if (text.includes('luciano')) {
        topic = 'luciano';
    } else if (text.includes('amor') || text.includes('ama') || text.includes('quier')) {
        topic = 'amor';
    } else if (text.includes('poquito') || text.includes('muchisimo')) {
        topic = 'poquito';
    } else if (text.includes('kalyt')) {
        topic = 'kalyt';
    } else if (text.includes('tierno') || text.includes('bonito') || text.includes('lindo')) {
        topic = 'ternura';
    } else if (text.includes('risa') || text.includes('gracioso') || text.includes('chiste') || text.includes('reir')) {
        topic = 'risa';
    } else if (text.includes('estrella') || text.includes('luna') || text.includes('universo') || text.includes('galaxia')) {
        topic = 'estrellas';
    } else if (text.includes('triste') || text.includes('mal') || text.includes('llorar') || text.includes('extraño')) {
        topic = 'animo';
    }

    const reply = chooseReply(topic);
    rememberExchange(input, reply, topic);
    return reply;
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

function handleSapitoQuestion(question) {
    addChatMessage(question, 'user');
    if (DOM.sapitoInput) {
        DOM.sapitoInput.value = '';
    }

    const typingMessage = showTypingIndicator();
    const thinkingTime = Math.min(950, 360 + question.length * 12);

    window.setTimeout(() => {
        typingMessage?.remove();
        const reply = getSapitoReply(question);
        addChatMessage(reply, 'frog');
        setFrogSpeech(reply);
        playFrogSound();
        animateSapito();
    }, thinkingTime);
}

function initializeSapito() {
    if (!DOM.sapito) return;

    DOM.sapito.addEventListener('click', () => {
        sapitoTouches++;
        playFrogSound();
        animateSapito();
        triggerHaptic();

        if (sapitoTouches === 1) {
            setFrogSpeech(`${SAPITO_AI_NAME} despierto. Tengo amor lunar para Kalyt.`);
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

        handleSapitoQuestion(question);
    });

    DOM.sapitoSuggestions.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.dataset.question;
            if (question) {
                handleSapitoQuestion(question);
            }
        });
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
