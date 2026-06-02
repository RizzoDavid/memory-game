import cards from './memoryPairs.js';

const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timerDisplay');
const gameAudio = document.getElementById('gameAudio');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameActive = false;
let timerInterval = null;
let elapsedTime = 0;
let matchedPairs = 0;

function createBoard() {

  cards.forEach(cardData => {

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

  gameBoard.innerHTML = '';
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameActive = true;
  elapsedTime = 0;
  matchedPairs = 0;

  timerDisplay.textContent = '0';
  startBtn.textContent = 'Game Started';
  startBtn.disabled = true;

  gameAudio.play().catch(() => {
    console.log('Audio playback started');
  });

  createBoard();

  timerInterval = setInterval(() => {
    elapsedTime++;
    timerDisplay.textContent = elapsedTime;
  }, 1000);

}

function endGame() {

  gameActive = false;
  clearInterval(timerInterval);

  gameAudio.pause();
  gameAudio.currentTime = 0;

  startBtn.textContent = `Play Again (${elapsedTime}s)`;
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