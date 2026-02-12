document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const btnYes1 = document.getElementById('btn-yes-1');
    const btnYes2 = document.getElementById('btn-yes-2');
    const btnThink = document.getElementById('btn-think');
    const countdownEl = document.getElementById('countdown');
    const heartsContainer = document.getElementById('hearts-container');
    
    // Game Elements
    const gameArea = document.getElementById('game-area');
    const scoreVal = document.getElementById('score-val');
    let score = 0;
    const targetScore = 5;

    // --- NAVIGATION ---
    function showScreen(id) {
        console.log("Switching to screen:", id);
        
        // Force all screens to hide
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        const nextScreen = document.getElementById(`screen-${id}`);
        if (nextScreen) {
            nextScreen.style.display = 'flex';
            // Trigger reflow
            void nextScreen.offsetWidth;
            nextScreen.classList.add('active');
            window.scrollTo(0, 0);
            
            if (id === 3) triggerConfetti();
        } else {
            console.error("Screen not found:", id);
        }
    }

    btnYes1.addEventListener('click', () => showScreen(3));
    btnYes2.addEventListener('click', () => showScreen(3));
    btnThink.addEventListener('click', () => showScreen(2));

    // Initialize first screen (Game)
    showScreen(0);
    initGame();

    // --- GAME LOGIC ---
    function initGame() {
        spawnHeart();
    }

    function spawnHeart() {
        if (score >= targetScore) return;

        const heart = document.createElement('div');
        heart.className = 'game-heart';
        heart.innerHTML = '💗';
        
        // Random position within game area
        const x = Math.random() * (gameArea.clientWidth - 50);
        const y = Math.random() * (gameArea.clientHeight - 50);
        
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // Use both touchstart and mousedown for maximum compatibility on older iOS
        const handleInteraction = (e) => {
            e.preventDefault();
            e.stopPropagation();
            catchHeart.call(heart);
        };

        heart.addEventListener('touchstart', handleInteraction, { passive: false });
        heart.addEventListener('mousedown', handleInteraction);

        gameArea.appendChild(heart);

        // Move heart periodically if not caught
        const moveInterval = setInterval(() => {
            if (!heart.parentElement) {
                clearInterval(moveInterval);
                return;
            }
            const newX = Math.random() * (gameArea.clientWidth - 50);
            const newY = Math.random() * (gameArea.clientHeight - 50);
            heart.style.left = `${newX}px`;
            heart.style.top = `${newY}px`;
        }, 1200);
    }

    function catchHeart() {
        score++;
        scoreVal.textContent = score;
        
        // Visual feedback
        if (window.confetti) {
            confetti({
                particleCount: 15,
                spread: 40,
                origin: { 
                    x: (this.getBoundingClientRect().left + 25) / window.innerWidth, 
                    y: (this.getBoundingClientRect().top + 25) / window.innerHeight 
                },
                colors: ['#ff69b4', '#ffffff']
            });
        }

        this.remove();

        if (score >= targetScore) {
            // Success! Move to invite screen
            setTimeout(() => {
                showScreen(1);
            }, 300);
        } else {
            spawnHeart();
        }
    }

    // --- BACKGROUND HEARTS ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '💗';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
            heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 10000);
        }, 1000);
    }

    // --- COUNTDOWN ---
    const targetDate = new Date('2026-02-14T18:00:00+07:00').getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            countdownEl.innerHTML = "It’s time! 💗";
            return;
        }
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        const pad = (n) => String(n).padStart(2, '0');
        countdownEl.innerHTML = `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    function triggerConfetti() {
        if (prefersReducedMotion) return;
        const duration = 3000;
        const end = Date.now() + duration;
        const interval = setInterval(() => {
            if (Date.now() > end) return clearInterval(interval);
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 }, colors: ['#ff69b4', '#ffb6c1', '#ffffff'] });
        }, 250);
    }
});
