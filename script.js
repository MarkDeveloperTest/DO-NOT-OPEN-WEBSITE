    const timeline = [
            { id: 'scene-start', duration: null },
            { id: 'scene-search', duration: null },
            { id: 'scene-story-1', duration: 3500, text: "Ось що я збирався шукати...", style: 'char-style-1', speed: 30 },
            { id: 'scene-story-2', duration: 3500, text: "Але потім я зупинився і зрозумів...", style: 'char-style-2', speed: 30 },
            { id: 'scene-story-3', duration: 3500, text: "Я хотів зробити щось особливе...", style: 'char-style-1', speed: 30 },
            { id: 'scene-story-4', duration: 4000, text: "Тому що ТИ особливий :)", style: 'char-special', speed: 50 },
            { id: 'scene-pop', duration: null }, 
            { id: 'scene-1', duration: 4000 },
            { id: 'scene-2', duration: 4000 },
            { id: 'scene-3', duration: 4000 },
            { id: 'scene-4', duration: 4000 },
            { id: 'scene-5', duration: null }
        ];

// DOM references
const progressBar = document.getElementById('progress-bar');
const beginBtn = document.getElementById('begin-btn');
const restartBtn = document.getElementById('restart-btn');
const bottleTrigger = document.getElementById('bottle-trigger');
const searchText = document.getElementById('search-text');
const popInstruction = document.getElementById('pop-instruction');
const typingSound = document.getElementById('typing-sound');

// NEW: Tap counter, haptic helper, confetti burst & pop handler
let tapCount = 0;
let currentSceneIndex = 0;
const totalTapsRequired = 3;

// Haptic helper
function triggerHaptic(pattern) {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
}

        async function typeWriter(text) {
            typingSound.play();
            for (let char of text) {
                searchText.innerHTML += char;
                triggerHaptic(10); // Light haptic per character
                await new Promise(r => setTimeout(r, 60));
            }
            typingSound.pause();
            typingSound.currentTime = 0;
        }

        async function deleteWriter() {
            let text = searchText.innerHTML;
            while (text.length > 1) {
                text = text.slice(0, -1);
                searchText.innerHTML = text;
                triggerHaptic(5); // Very light haptic per deletion
                await new Promise(r => setTimeout(r, 25));
            }
            typingSound.pause();
            typingSound.currentTime = 0;
            // Delete the last character silently
            searchText.innerHTML = '';
        }

        async function animateCharacters(containerId, text, styleClass, speed) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';
            const words = text.split(' ');
            
            for (let i = 0; i < words.length; i++) {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'inline-block whitespace-nowrap mr-2 relative';
                
                for (let char of words[i]) {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.className = `char ${styleClass}`;
                    wordSpan.appendChild(charSpan);
                }
                container.appendChild(wordSpan);
                await new Promise(r => setTimeout(r, speed));
            }
        }

        async function playScene(index) {
            currentSceneIndex = index;
            const oldScene = document.querySelector('.scene.active');
            if (oldScene) {
                oldScene.classList.replace('active', 'exit');
            }

            const step = timeline[index];
            const currentEl = document.getElementById(step.id);
            currentEl.classList.remove('enter', 'exit');
            currentEl.classList.add('active');

            // Haptic Pulse on transition
            if (index > 0) {
                triggerHaptic([20, 10, 20]);
            }

            if (step.text) {
                const targetId = step.id.replace('scene-', 'text-');
                await animateCharacters(targetId, step.text, step.style, step.speed);
            }

            if (step.duration) {
                const total = timeline.length - 1;
                progressBar.style.width = `${(index / total) * 100}%`;
                setTimeout(() => playScene(index + 1), step.duration);
            } else if (index === timeline.length - 1) {
                progressBar.style.width = '100%';
            }
        }

        async function handleSearchSequence() {
            playScene(1);
            await new Promise(r => setTimeout(r, 800));
            await typeWriter("як надіслати привіт на день народження");
            await new Promise(r => setTimeout(r, 1200));
            await deleteWriter();
            await new Promise(r => setTimeout(r, 400));
            playScene(2);
        }

        beginBtn.addEventListener('click', () => {
            triggerHaptic(60); // Feedback for starting
            fireCornerConfetti();
            setTimeout(() => handleSearchSequence(), 600);
        });

        restartBtn.addEventListener('click', () => {
            triggerHaptic(40); // Feedback for restart
        });

        function sprayWhiteConfetti() {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2 - 50; // Bottle top position
            const particles = [];
            const startTime = Date.now();
            const duration = 10000; // 10 seconds
            
            // Create upward spray particles - white only
            for (let i = 0; i < 120; i++) {
                // Spread mostly upward with slight spread to sides
                const angle = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4 radians
                const speed = Math.random() * 18 + 12;
                particles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.sin(angle) * speed,
                    vy: -Math.cos(angle) * speed, // Negative for upward
                    color: '#ffffff',
                    size: Math.random() * 6 + 3,
                    gravity: 0.15,
                    drag: 0.98,
                    rotation: Math.random() * 360,
                    rSpeed: (Math.random() - 0.5) * 15,
                    life: 1
                });
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                let active = false;
                
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.vx *= p.drag;
                    p.vy *= p.drag;
                    p.rotation += p.rSpeed;
                    
                    // Fade out as time progresses
                    p.life = Math.max(0, 1 - progress);
                    
                    if (p.life > 0) active = true;
                    
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life * 0.8;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    ctx.restore();
                });
                
                if (active) requestAnimationFrame(animate);
            }
            animate();
        }

        function createBottleBurst() {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const particles = [];
            const colors = ['#fbbf24', '#f59e0b', '#d97706', '#f97316', '#fb923c'];
            
            // Create burst particles
            for (let i = 0; i < 80; i++) {
                const angle = (i / 80) * Math.PI * 2;
                const speed = Math.random() * 12 + 8;
                particles.push({
                    x: centerX, y: centerY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 8 + 4,
                    gravity: 0.2, drag: 0.96, rotation: Math.random() * 360, rSpeed: (Math.random() - 0.5) * 12,
                    life: 1
                });
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let active = false;
                particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= p.drag; p.vy *= p.drag; p.rotation += p.rSpeed;
                    p.life -= 0.015;
                    if (p.life > 0) active = true;
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); ctx.restore();
                });
                if (active) requestAnimationFrame(animate);
            }
            animate();
        }

        bottleTrigger.addEventListener('click', () => {
            tapCount++;
            
            // Visual feedback for tap - scale up more
            bottleTrigger.style.transform = `scale(${1 + tapCount * 0.15})`;
            
            // Progressive Haptic Feedback
            bottleTrigger.classList.remove('shake-1', 'shake-2', 'shake-3');
            void bottleTrigger.offsetWidth; // Force reflow to restart animation
            
            if (tapCount === 1) {
                triggerHaptic(40); 
                bottleTrigger.classList.add('shake-1');
                popInstruction.innerText = "Продовжуй натискати...";
            } else if (tapCount === 2) {
                triggerHaptic([50, 40, 50]); 
                bottleTrigger.classList.add('shake-2');
                popInstruction.innerText = "Майже готово!";
            } else if (tapCount >= totalTapsRequired) {
                triggerHaptic([150, 80, 250]); // Strong celebratory pop
                bottleTrigger.classList.add('shake-3');
                bottleTrigger.classList.add('bottle-pop-anim');
                popInstruction.innerText = "БУМ!";
                fireCornerConfetti();
                setTimeout(() => {
                    playScene(currentSceneIndex + 1); 
                }, 800);
            }
        });

        function createFloatingHearts() {
            const container = document.getElementById('hearts-container');
            const heartSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            setInterval(() => {
                const el = document.createElement('div');
                el.classList.add('floating-heart');
                el.innerHTML = heartSVG;
                el.style.width = `${Math.random() * 10 + 6}px`;
                el.style.left = `${Math.random() * 100}%`;
                el.style.top = '110%';
                container.appendChild(el);
                setTimeout(() => el.remove(), 12000);
            }, 1000);
        }

        function fireCornerConfetti() {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const particles = [];
            const colors = ['#f87171', '#fb7185', '#ffffff', '#fcd34d'];
            function createBurst(x, direction) {
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: x, y: canvas.height,
                        vx: direction * (Math.random() * 14 + 5),
                        vy: Math.random() * -20 - 7,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * 5 + 2,
                        gravity: 0.3, drag: 0.97, rotation: Math.random() * 360, rSpeed: (Math.random() - 0.5) * 8
                    });
                }
            }
            createBurst(0, 1);
            createBurst(canvas.width, -1);
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let active = false;
                particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= p.drag; p.vy *= p.drag; p.rotation += p.rSpeed;
                    if (p.y < canvas.height + 50) active = true;
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color; ctx.globalAlpha = 0.8; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); ctx.restore();
                });
                if (active) requestAnimationFrame(animate);
            }
            animate();
        }

        window.onload = createFloatingHearts;
        window.onresize = () => {
            const c = document.getElementById('confetti-canvas');
            if (c) {
                c.width = window.innerWidth; 
                c.height = window.innerHeight;
            }
        };