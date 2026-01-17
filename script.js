const timeline = [
    { id: 'scene-start', duration: null },
    { id: 'scene-search', duration: null },
    { id: 'scene-story-1', duration: 3500, text: "That's what I was going to search...", style: 'char-style-1', speed: 30 },
    { id: 'scene-story-2', duration: 3500, text: "But then I stopped and realized...", style: 'char-style-2', speed: 30 },
    { id: 'scene-story-3', duration: 3500, text: "I wanted to make something special...", style: 'char-style-1', speed: 30 },
    { id: 'scene-story-4', duration: 5000, text: "Because YOU are special :)", style: 'char-special', speed: 50 },
    { id: 'scene-1', duration: 4000 },
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
    while (searchText.innerHTML.length > 0) {
        searchText.innerHTML = searchText.innerHTML.slice(0, -1);
        await new Promise(r => setTimeout(r, 25));
    }
}

async function animateCharacters(id, text, style, speed) {
    const el = document.getElementById(id.replace('scene-', 'text-'));
    el.innerHTML = '';
    for (let char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = `char ${style}`;
        el.appendChild(span);
        await new Promise(r => setTimeout(r, speed));
    }
}

function playScene(index) {
    document.querySelector('.scene.active')?.classList.remove('active');
    const step = timeline[index];
    const el = document.getElementById(step.id);
    el.classList.add('active');

    if (step.text) {
        animateCharacters(step.id, step.text, step.style, step.speed);
    }

    if (step.duration) {
        setTimeout(() => playScene(index + 1), step.duration);
    }
}

beginBtn.addEventListener('click', async () => {
    playScene(1);
    await typeWriter("how to text happy birthday");
    await deleteWriter();
    playScene(2);
});