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
      document.getElementById('puzzle-status').textContent = '¡Excelente, mi amor! Abriendo universo...';
      document.getElementById('puzzle-status').style.color = '#ffccd5';
      
      setTimeout(() => {
        showUniverseScreen();
      }, 1200);
    }
  }
}

function isPuzzleSolved() {
  return puzzleState.every((val, idx) => val === winningState[idx]);
}

function showUniverseScreen() {
  // Reproduce la música local (cancion.mp3)
  const music = document.getElementById('bg-music');
  music.play().catch(e => console.log("El navegador requiere interacción para reproducir audio:", e));

  document.getElementById('puzzle-screen').classList.remove('active');
  document.getElementById('universe-screen').classList.add('active');
  initGalaxyAnimation();
}

// --- MENSAJE OCULTO EN FOTOS ---
function toggleSecret(card) {
  document.querySelectorAll('.photo-card').forEach(c => {
    if (c !== card) c.classList.remove('active-secret');
  });
  card.classList.toggle('active-secret');
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
  const centerX = width / 2;
  const centerY = height / 2;

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
