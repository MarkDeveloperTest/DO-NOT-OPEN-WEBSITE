       const timeline = [
            { id: 'scene-start', duration: null },
            { id: 'scene-search', duration: null },
            { id: 'scene-story-1', duration: 3500, text: "That's what I was going to search...", style: 'char-style-1', speed: 30 },
            { id: 'scene-story-2', duration: 3500, text: "But then I stopped and realized...", style: 'char-style-2', speed: 30 },
            { id: 'scene-story-3', duration: 3500, text: "I wanted to make something special...", style: 'char-style-1', speed: 30 },
            { id: 'scene-story-4', duration: 5000, text: "Because YOU are special :)", style: 'char-special', speed: 50, sparkle: true },
            { id: 'scene-1', duration: 4000 },
            { id: 'scene-2', duration: 4000 },
            { id: 'scene-3', duration: 4000 },
            { id: 'scene-4', duration: 4000 },
            { id: 'scene-5', duration: null }
        ];

        let currentSceneIndex = 0;
        const progressBar = document.getElementById('progress-bar');
        const beginBtn = document.getElementById('begin-btn');
        const searchText = document.getElementById('search-text');

        async function typeWriter(text) {
            for (let char of text) {
                searchText.innerHTML += char;
                await new Promise(r => setTimeout(r, 60));
            }
        }

        async function deleteWriter() {
            let text = searchText.innerHTML;
            while (text.length > 0) {
                text = text.slice(0, -1);
                searchText.innerHTML = text;
                await new Promise(r => setTimeout(r, 25));
            }
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

        function createTwinkleSparkles() {
            const layer = document.getElementById('text-sparkle-layer');
            const target = document.getElementById('text-story-4');
            if (!layer || !target) return;

            const interval = setInterval(() => {
                if (!document.getElementById('scene-story-4').classList.contains('active')) {
                    clearInterval(interval);
                    return;
                }

                const s = document.createElement('div');
                s.className = 'text-sparkle';
                s.style.left = Math.random() * 90 + 5 + '%';
                s.style.top = Math.random() * 80 + 10 + '%';
                s.style.animationDelay = Math.random() * 2 + 's';
                
                layer.appendChild(s);
                setTimeout(() => s.remove(), 2500);
            }, 300);
        }

        async function playScene(index) {
            const oldScene = document.querySelector('.scene.active');
            if (oldScene) {
                oldScene.classList.replace('active', 'exit');
            }

            const step = timeline[index];
            const currentEl = document.getElementById(step.id);
            currentEl.classList.remove('enter', 'exit');
            currentEl.classList.add('active');

            if (step.text) {
                const targetId = step.id.replace('scene-', 'text-');
                await animateCharacters(targetId, step.text, step.style, step.speed);
                
                if (step.sparkle) {
                    createTwinkleSparkles();
                }
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
            await typeWriter("how to text happy birthday");
            await new Promise(r => setTimeout(r, 1200));
            await deleteWriter();
            await new Promise(r => setTimeout(r, 400));
            playScene(2);
        }

        beginBtn.addEventListener('click', () => {
            fireCornerConfetti();
            setTimeout(() => handleSearchSequence(), 600);
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
                for (let i = 0; i < 40; i++) {
                    particles.push({
                        x: x, y: canvas.height,
                        vx: direction * (Math.random() * 10 + 3),
                        vy: Math.random() * -15 - 5,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * 4 + 2,
                        gravity: 0.25, drag: 0.98, rotation: Math.random() * 360, rSpeed: (Math.random() - 0.5) * 5
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
            c.width = window.innerWidth; c.height = window.innerHeight;
        };