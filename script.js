const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const highScoreEl = document.getElementById('high-score');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const finalScoreEl = document.getElementById('final-score');
const gameArea = document.getElementById('game-area');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let timeLeft = 60;
let gameInterval;
let dropInterval;

highScoreEl.textContent = highScore;

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

function startGame() {
  score = 0;
  timeLeft = 60;
  updateScore(0);
  timerEl.textContent = timeLeft;
  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameInterval = setInterval(countdown, 1000);
  dropInterval = setInterval(spawnDrop, 800);
}

function countdown() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(dropInterval);
  gameArea.innerHTML = '';
  finalScoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreEl.textContent = highScore;
  }
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
}

function spawnDrop() {
  const drop = document.createElement('div');
  const type = Math.random();
  if (type < 0.6) {
    drop.classList.add('drop', 'blue');
  } else if (type < 0.9) {
    drop.classList.add('drop', 'grey');
  } else {
    drop.classList.add('jug');
  }

  drop.style.left = Math.random() * (window.innerWidth - 40) + 'px';
  gameArea.appendChild(drop);

  let topPos = 0;
  const fall = setInterval(() => {
    topPos += 5;
    drop.style.top = topPos + 'px';
    if (topPos > window.innerHeight) {
      clearInterval(fall);
      drop.remove();
    }
  }, 50);

  drop.addEventListener('click', () => {
    clearInterval(fall);
    drop.remove();
    if (drop.classList.contains('blue')) {
      updateScore(100);
    } else if (drop.classList.contains('grey')) {
      updateScore(-100);
    } else if (drop.classList.contains('jug')) {
      timeLeft += 5;
      timerEl.textContent = timeLeft;
    }
  });
}

function updateScore(change) {
  score += change;
  scoreEl.textContent = score;
  scoreEl.classList.remove('glow', 'shake');
  if (change > 0) {
    scoreEl.classList.add('glow');
  } else if (change < 0) {
    scoreEl.classList.add('shake');
  }
  setTimeout(() => {
    scoreEl.classList.remove('glow', 'shake');
  }, 500);
}
