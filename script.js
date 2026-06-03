import cards from './memoryPairs.js';

const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timerDisplay');
const gameAudio = document.getElementById('gameAudio');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameActive = false;
let timerInterval = null;
let elapsedTime = 0;
let matchedPairs = 0;

function getHighScores() {
  const scores = localStorage.getItem('memoryGameScores');
  return scores ? JSON.parse(scores) : [];
}

function saveHighScore(time) {
  const scores = getHighScores();
  scores.push(time);
  scores.sort((a, b) => a - b);
  const topScores = scores.slice(0, 10);
  localStorage.setItem('memoryGameScores', JSON.stringify(topScores));
}

function displayLeaderboard() {
  const scores = getHighScores();
  leaderboardList.innerHTML = '';
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<li>No scores yet. Play to get on the board!</li>';
  } else {
    scores.forEach((score) => {
      const li = document.createElement('li');
      li.textContent = `${(score / 1000).toFixed(2)}s`;
      leaderboardList.appendChild(li);
    });
  }
  
  leaderboard.classList.remove('hidden');
}

function clearLeaderboardScores() {
  if (confirm('Are you sure you want to clear all high scores?')) {
    localStorage.removeItem('memoryGameScores');
    displayLeaderboard();
  }
}

clearLeaderboardBtn.addEventListener('click', clearLeaderboardScores);

function shuffleCards(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createBoard(cardsToUse) {

  cardsToUse.forEach(cardData => {

    const card = document.createElement('div');
    card.classList.add('card');

    card.dataset.match = cardData.matchId;

    card.innerHTML = `
      <div class="front"></div>

      <div class="back">
        <img src="${cardData.image}" />
      </div>
    `;

    card.addEventListener('click', flipCard);

    gameBoard.appendChild(card);

  });

}

function flipCard() {

  if (lockBoard || !gameActive) return;

  if (this === firstCard) return;

  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;

  checkMatch();

}

function checkMatch() {

  const isMatch =
    firstCard.dataset.match === secondCard.dataset.match;

  if (isMatch) {

    disableCards();

  } else {

    unflipCards();

  }

}

function disableCards() {

  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchedPairs++;

  if (matchedPairs === cards.length / 2) {
    endGame();
  }

  resetBoard();

}

function unflipCards() {

  lockBoard = true;

  setTimeout(() => {

    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();

  }, 1000);

}

function resetBoard() {

  [firstCard, secondCard] = [null, null];

  lockBoard = false;

}

function startGame() {

  leaderboard.classList.add('hidden');
  gameBoard.innerHTML = '';
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameActive = true;
  elapsedTime = 0;
  matchedPairs = 0;

  timerDisplay.textContent = '0.00';
  startBtn.textContent = 'Game Started';
  startBtn.disabled = true;

  gameAudio.play().catch(() => {
    console.log('Audio playback started');
  });

  const shuffledCards = shuffleCards(cards);
  createBoard(shuffledCards);

  timerInterval = setInterval(() => {
    elapsedTime += 10;
    const seconds = (elapsedTime / 1000).toFixed(2);
    timerDisplay.textContent = seconds;
  }, 10);

}

function endGame() {

  gameActive = false;
  clearInterval(timerInterval);

  gameAudio.pause();

  saveHighScore(elapsedTime);
  displayLeaderboard();

  startBtn.textContent = `Play Again (${(elapsedTime / 1000).toFixed(2)}s)`;
  startBtn.disabled = false;

}

startBtn.addEventListener('click', startGame);

createBoardInitial();

function createBoardInitial() {
  // Initial board setup (not playable until start)
  cards.slice(0, 10).forEach(cardData => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.match = cardData.matchId;
    card.innerHTML = `
      <div class="front"></div>
      <div class="back">
        <img src="${cardData.image}" />
      </div>
    `;
    gameBoard.appendChild(card);
  });
}