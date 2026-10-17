// --- LÓGICA DEL ROMPECABEZAS (PUZZLE DE 3x3) AL INICIO ---
let puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const winningState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let selectedPieceIndex = null;

window.addEventListener('DOMContentLoaded', () => {
  initPuzzle();
});

function initPuzzle() {
  do {
    puzzleState.sort(() => Math.random() - 0.5);
  } while (isPuzzleSolved());

  renderPuzzle();
}

function renderPuzzle() {
  const board = document.getElementById('puzzleBoard');
  board.innerHTML = '';

  puzzleState.forEach((pieceId, currentIndex) => {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    
    const row = Math.floor(pieceId / 3);
    const col = pieceId % 3;
    
    piece.style.backgroundPosition = `-${col * 90}px -${row * 90}px`;
    
    piece.dataset.index = currentIndex;
    piece.onclick = () => handlePieceClick(currentIndex);

    board.appendChild(piece);
  });
}

function handlePieceClick(index) {
  if (selectedPieceIndex === null) {
    selectedPieceIndex = index;
    document.querySelectorAll('.puzzle-piece')[index].classList.add('selected');
  } else {
    let temp = puzzleState[selectedPieceIndex];
    puzzleState[selectedPieceIndex] = puzzleState[index];
    puzzleState[index] = temp;

    selectedPieceIndex = null;
    renderPuzzle();

    if (isPuzzleSolved()) {
      const statusEl = document.getElementById('puzzle-status');
      statusEl.textContent = '¡Completado! Toca aquí para entrar a nuestro universo 💖';
      statusEl.style.color = '#ffccd5';
      statusEl.style.cursor = 'pointer';
      
      // Toque directo requerido por los navegadores móviles para activar la música sin bloqueos
      document.querySelector('.puzzle-container').onclick = () => {
        const music = document.getElementById('bg-music');
        music.play().catch(e => console.log("Error al reproducir:", e));
        
        document.getElementById('puzzle-screen').classList.remove('active');
        document.getElementById('universe-screen').classList.add('active');
        initGalaxyAnimation();
      };
    }
  }
}

function isPuzzleSolved() {
  return puzzleState.every((val, idx) => val === winningState[idx]);
}

// --- MENSAJE OCULTO EN FOTOS ---
function toggleSecret(card) {
  const currentMessageOpen = card.classList.contains('active-secret');
  document.querySelectorAll('.photo-card').forEach(c => c.classList.remove('active-secret'));
  if (!currentMessageOpen) {
    card.classList.add('active-secret');
  }
}

// --- CONTROL EXCLUSIVO POR BOTONES DEL CARRUSEL ---
let currentSlideIndex = 0;
const totalSlides = 10;

function cambiarSlide(direction) {
  const cards = document.querySelectorAll('.gallery-card, .photo-card');
  if (cards.length === 0) return;

  cards.forEach(c => c.classList.remove('active-secret'));
  cards[currentSlideIndex].classList.remove('active-slide');

  currentSlideIndex += direction;

  if (currentSlideIndex >= totalSlides) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = totalSlides - 1;
  }

  cards[currentSlideIndex].classList.add('active-slide');
  updateCounterDisplay();
  checkLoveLetterVisibility();
}

function updateCounterDisplay() {
  const counterElement = document.getElementById('counter');
  if (counterElement) {
    counterElement.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
  }
}

// Mostrar la carta de amor solo cuando se llega a la última foto (índice 9 = foto 10)
function checkLoveLetterVisibility() {
  const loveLetter = document.getElementById('loveLetter');
  if (!loveLetter) return;

  if (currentSlideIndex === totalSlides - 1) {
    loveLetter.classList.add('show-letter');
  } else {
    loveLetter.classList.remove('show-letter');
  }
}

// --- ANIMACIÓN DE LA GALAXIA Y EL CORAZÓN ---
let canvas, ctx;
let particles = [];
let animationId;

function initGalaxyAnimation() {
  canvas = document.getElementById('galaxyCanvas');
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const width = canvas.width;
  const height = canvas.height;

  particles = [];
  const totalParticles = 1400;

  for (let i = 0; i < totalParticles; i++) {
    let isHeart = i < 400;
    particles.push({
      isHeart: isHeart,
      angle: Math.random() * Math.PI * 2,
      distance: isHeart ? Math.random() * 70 + 10 : Math.random() * Math.min(width, height) * 0.45 + 40,
      speed: (Math.random() * 0.007 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2 + 0.5,
      color: ['#ff758c', '#ff7eb3', '#70a1ff', '#ffffff', '#a29bfe'][Math.floor(Math.random() * 5)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particles.forEach(p => {
      p.angle += p.speed * 0.5;

      let x, y;
      if (p.isHeart) {
        let t = p.angle;
        let hX = 16 * Math.pow(Math.sin(t), 3);
        let hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        let scaleFactor = Math.min(canvas.width, canvas.height) / 38;
        
        x = cx + hX * scaleFactor;
        y = (cy - 120) + hY * scaleFactor;
      } else {
        let spiralFactor = p.distance * 0.0018;
        x = cx + Math.cos(p.angle + spiralFactor) * p.distance;
        y = cy + Math.sin(p.angle + spiralFactor) * (p.distance * 0.35);
      }

      ctx.save();
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    animationId = requestAnimationFrame(animate);
  }

  if (animationId) cancelAnimationFrame(animationId);
  animate();
}
