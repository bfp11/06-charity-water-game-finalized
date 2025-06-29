const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const playAgainBtn = document.getElementById('play-again-btn');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');
const gameArea = document.getElementById('game-area');
const dropSound = document.getElementById('drop-sound');

let difficulty = 'normal';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let timeLeft = 60;
let gameInterval;
let dropInterval;

highScoreEl.textContent = highScore;

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    difficulty = btn.dataset.mode;
    startGame();
  });
});

playAgainBtn.addEventListener('click', () => {
  startScreen.classList.remove('hidden');
  endScreen.classList.add('hidden');
});

function startGame() {
  score = 0;
  timeLeft = 60;
  updateScore(0);
  timerEl.textContent = timeLeft;

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  gameInterval = setInterval(countdown, 1000);
  dropInterval = setInterval(spawnDrop, difficulty === 'hard' ? 500 : 800);
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
  let type;

  // Decide type of drop
  if (difficulty === 'normal') {
    const rand = Math.random();
    if (rand < 0.6) type = 'blue';
    else if (rand < 0.9) type = 'grey';
    else type = 'jug';
  } else {
    type = Math.random() < 0.7 ? 'blue' : 'grey'; // No jugs in hard
  }

  drop.classList.add(type === 'jug' ? 'jug' : 'drop');

  // Assign background image
  switch (type) {
    case 'blue':
      drop.style.backgroundImage = "url('img/drop-blue.PNG')";
      break;
    case 'grey':
      drop.style.backgroundImage = "url('img/drop-grey.PNG')";
      break;
    case 'jug':
      drop.style.backgroundImage = "url('img/jug.PNG')";
      break;
  }

  drop.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  gameArea.appendChild(drop);

  let pos = 0;
  const fallSpeed = difficulty === 'hard' ? 7 : 5;
  const fall = setInterval(() => {
    pos += fallSpeed;
    drop.style.top = pos + 'px';
    if (pos > window.innerHeight) {
      clearInterval(fall);
      drop.remove();
    }
  }, 40);

  drop.addEventListener('click', () => {
    clearInterval(fall);
    drop.remove();
    dropSound.currentTime = 0;
    dropSound.play();

    if (type === 'blue') {
      updateScore(100);
    } else if (type === 'grey') {
      updateScore(-100);
    } else if (type === 'jug') {
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
