/* ============================================= */
/* VALENTINE'S DAY INTERACTIVE WEBSITE           */
/* All the magic happens here 💜                 */
/* ============================================= */

// =============================================
// 0. SCROLL LOCK — no scrolling until Yes!
// =============================================
document.documentElement.classList.add('scroll-locked');
window.scrollTo(0, 0);

// =============================================
// 1. CURSOR HEART TRAIL
// =============================================
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
let mouseX = 0, mouseY = 0;
let cursorHearts = [];

function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}
resizeCursorCanvas();
window.addEventListener('resize', resizeCursorCanvas);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (Math.random() < 0.35) {
        cursorHearts.push({
            x: mouseX,
            y: mouseY,
            size: Math.random() * 14 + 8,
            life: 1,
            decay: Math.random() * 0.02 + 0.012,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            color: ['#C084FC', '#FFFFFF', '#DDD6FE', '#A78BFA'][Math.floor(Math.random() * 4)]
        });
    }
});

function drawHeart(ctx, x, y, size, rotation, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size / 15;
    ctx.moveTo(0, -s * 3);
    ctx.bezierCurveTo(s * 6.5, -s * 11, s * 16, -s * 2, 0, s * 7);
    ctx.bezierCurveTo(-s * 16, -s * 2, -s * 6.5, -s * 11, 0, -s * 3);
    ctx.fill();
    ctx.restore();
}

function animateCursorHearts() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    for (let i = cursorHearts.length - 1; i >= 0; i--) {
        const h = cursorHearts[i];
        h.x += h.vx;
        h.y += h.vy;
        h.life -= h.decay;
        h.rotation += h.rotSpeed;
        h.vy -= 0.02;

        if (h.life <= 0) {
            cursorHearts.splice(i, 1);
            continue;
        }
        drawHeart(cursorCtx, h.x, h.y, h.size, h.rotation, h.color, h.life);
    }
    requestAnimationFrame(animateCursorHearts);
}
animateCursorHearts();


// =============================================
// 2. BACKGROUND FLOATING HEARTS
// =============================================
const bgContainer = document.getElementById('bg-hearts');
const heartEmojis = ['💜', '🤍', '💜', '💗', '🤍'];

function createBgHeart() {
    const heart = document.createElement('div');
    heart.classList.add('bg-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
    heart.style.animationDuration = (Math.random() * 12 + 10) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    bgContainer.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, 25000);
}

for (let i = 0; i < 12; i++) {
    setTimeout(createBgHeart, i * 900);
}
setInterval(createBgHeart, 2500);


// =============================================
// 3. DODGING "NO" BUTTON
// =============================================
let noClickCount = 0;
let yesBtnScale = 1;

function dodgeNoButton() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    noClickCount++;
    yesBtnScale += 0.15;

    yesBtn.style.transform = `scale(${yesBtnScale})`;
    yesBtn.style.zIndex = '10';

    const heroRect = document.querySelector('.hero-section').getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = heroRect.width - btnRect.width - 40;
    const maxY = heroRect.height - btnRect.height - 40;

    const randX = Math.random() * maxX - maxX / 2;
    const randY = Math.random() * maxY / 2 - maxY / 4;

    noBtn.style.position = 'relative';
    noBtn.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    noBtn.style.left = randX + 'px';
    noBtn.style.top = randY + 'px';

    const noTexts = [
        'No', 'Are you sure? 🥺', 'Really?! 😢', 'Think again! 💔',
        'Pretty please? 🥹', "I'll cry... 😭", 'NOOO 😩', 'Last chance! 💜',
        '...', '💜?'
    ];
    noBtn.textContent = noTexts[Math.min(noClickCount, noTexts.length - 1)];

    const shrink = Math.max(0.5, 1 - noClickCount * 0.08);
    noBtn.style.fontSize = `${shrink}rem`;

    if (noClickCount >= 8) {
        noBtn.style.opacity = '0.3';
        noBtn.style.pointerEvents = 'none';
    }
}


// =============================================
// 4. YES BUTTON HANDLER
// =============================================
function handleYes() {
    const buttonsDiv = document.querySelector('.hero-buttons');
    const response = document.getElementById('yes-response');
    const subtitle = document.querySelector('.hero-subtitle');

    buttonsDiv.classList.add('hidden');
    subtitle.classList.add('hidden');
    response.classList.remove('hidden');

    // Unlock scrolling!
    document.documentElement.classList.remove('scroll-locked');

    launchConfetti();

    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            cursorHearts.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 250,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                size: Math.random() * 22 + 12,
                life: 1,
                decay: Math.random() * 0.007 + 0.004,
                vx: (Math.random() - 0.5) * 7,
                vy: -Math.random() * 4 - 1,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.15,
                color: ['#C084FC', '#FFFFFF', '#DDD6FE', '#FCD34D'][Math.floor(Math.random() * 4)]
            });
        }, i * 50);
    }
}


// =============================================
// 5. CONFETTI SYSTEM
// =============================================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

function launchConfetti() {
    confettiActive = true;
    const colors = ['#C084FC', '#FFFFFF', '#DDD6FE', '#FCD34D', '#A78BFA', '#EDE9FE', '#7C3AED'];

    for (let i = 0; i < 220; i++) {
        confettiPieces.push({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 22,
            vy: (Math.random() - 1) * 20,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3,
            life: 1,
            decay: Math.random() * 0.003 + 0.0015,
            gravity: 0.15
        });
    }
}

function animateConfetti() {
    if (!confettiActive && confettiPieces.length === 0) {
        requestAnimationFrame(animateConfetti);
        return;
    }

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > confettiCanvas.height + 20) {
            confettiPieces.splice(i, 1);
            continue;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation);
        confettiCtx.globalAlpha = p.life;
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
    }

    if (confettiPieces.length === 0) confettiActive = false;
    requestAnimationFrame(animateConfetti);
}
animateConfetti();


// =============================================
// 6. SCROLL REVEAL (all reveal types)
// =============================================
const revealItems = document.querySelectorAll('.reveal-item, .reveal-pop');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, parseInt(delay));
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealItems.forEach(item => revealObserver.observe(item));


// =============================================
// 7. GALLERY SLIDE-IN REVEAL
// =============================================
const galleryItems = document.querySelectorAll('.gallery-reveal');

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = Array.from(galleryItems).indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, idx * 150);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

galleryItems.forEach(item => galleryObserver.observe(item));


// =============================================
// 8. LOVE COUNTER
// =============================================
// ⬇️ CUSTOMIZE THIS DATE: set to when your relationship started!
const relationshipStart = new Date('2024-12-01T00:00:00');
let counterStarted = false;

function updateCounter() {
    const now = new Date();
    const diff = now - relationshipStart;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
}

const counterSection = document.getElementById('counter');
const counterObserverEl = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            updateCounter();
            setInterval(updateCounter, 1000);
        }
    });
}, { threshold: 0.3 });

if (counterSection) counterObserverEl.observe(counterSection);


// =============================================
// 9. LETTER PARAGRAPH REVEAL
// =============================================
const letterBody = document.getElementById('letter-body');
let letterRevealed = false;

if (letterBody) {
    const letterParagraphs = letterBody.querySelectorAll('p');

    const letterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !letterRevealed) {
                letterRevealed = true;
                letterParagraphs.forEach((p, i) => {
                    setTimeout(() => {
                        p.classList.add('letter-visible');
                    }, i * 450);
                });
            }
        });
    }, { threshold: 0.15 });

    letterObserver.observe(letterBody);
}


// =============================================
// 10. FINALE BUTTON
// =============================================
function triggerFinale() {
    const msg = document.getElementById('finale-message');
    msg.classList.remove('hidden');
    launchConfetti();

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            cursorHearts.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 300,
                size: Math.random() * 22 + 10,
                life: 1,
                decay: Math.random() * 0.006 + 0.003,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 5 - 1,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.15,
                color: ['#C084FC', '#FFFFFF', '#DDD6FE', '#FCD34D'][Math.floor(Math.random() * 4)]
            });
        }, i * 40);
    }
}


// =============================================
// 11. POLAROID TILT EFFECT
// =============================================
document.querySelectorAll('.polaroid[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = ((y - midY) / midY) * -8;
        const rotateY = ((x - midX) / midX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotate(var(--rotation, 0deg))`;
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
});


// =============================================
// 12. PARALLAX ON SCROLL
// =============================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            document.querySelectorAll('.floating-heart').forEach((heart, i) => {
                const speed = 0.05 + i * 0.02;
                heart.style.transform = `translateY(${scrollY * speed}px)`;
            });

            // Flowing ribbons parallax — each ribbon moves at a different speed
            document.querySelectorAll('.ribbon').forEach((ribbon, i) => {
                const speed = 0.015 + i * 0.008;
                const yOffset = scrollY * speed;
                ribbon.style.marginTop = `${yOffset}px`;
            });

            ticking = false;
        });
        ticking = true;
    }
});


// =============================================
// 13. CLICK ANYWHERE TO SPAWN HEARTS
// =============================================
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn')) return;

    for (let i = 0; i < 8; i++) {
        cursorHearts.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 18 + 10,
            life: 1,
            decay: Math.random() * 0.01 + 0.008,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 3 - 1,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.12,
            color: ['#C084FC', '#FFFFFF', '#DDD6FE'][Math.floor(Math.random() * 3)]
        });
    }
});


// =============================================
// 14. SMOOTH SCROLL FOR NAVIGATION
// =============================================
document.getElementById('scroll-hint')?.addEventListener('click', () => {
    document.getElementById('counter').scrollIntoView({ behavior: 'smooth' });
});


// =============================================
// LOG
// =============================================
console.log('%c💜 Happy Valentine\'s Day! 💜', 'font-size: 24px; color: #C084FC; font-weight: bold;');
console.log('%cMade with love 💜', 'font-size: 14px; color: #A78BFA;');
