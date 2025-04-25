// Game 2: Memory Card Game
const memoryBoard = document.getElementById("memoryBoard");
const memoryTimer = document.getElementById("memoryTimer");
const memoryStart = document.getElementById("memoryStart");
let memoryTimeLeft = 30;
let memoryInterval;
let flippedCards = [];
let matchedPairs = 0;
let memoryGameActive = false;
const symbols = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
let cards = [];

memoryStart.addEventListener("click", startMemoryGame);

function startMemoryGame() {
  if (playerName === "Anonymous") {
    alert("Please enter your name before playing!");
    return;
  }

  // Reset game state
  memoryTimeLeft = 30;
  matchedPairs = 0;
  flippedCards = [];
  memoryGameActive = true;
  memoryStart.disabled = true;
  memoryTimer.textContent = `Time: ${memoryTimeLeft}s`;

  // Create cards
  cards = [...symbols, ...symbols];

  // shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Render board
  memoryBoard.innerHTML = "";
  cards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    card.addEventListener("click", flipCard);
    memoryBoard.appendChild(card);
  });

  // mulai
  memoryInterval = setInterval(() => {
    memoryTimeLeft--;
    memoryTimer.textContent = `Time: ${memoryTimeLeft}s`;

    if (memoryTimeLeft <= 0) {
      endMemoryGame();
    }
  }, 1000);
}

function flipCard() {
  if (
    !memoryGameActive ||
    flippedCards.length >= 2 ||
    this.classList.contains("flipped")
  ) {
    return;
  }

  this.classList.add("flipped");
  this.textContent = this.dataset.symbol;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    // sama
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === symbols.length) {
      endMemoryGame();
    }
  } else {
    // tidak sama
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
      flippedCards = [];
    }, 1000);
  }
}

function endMemoryGame() {
  clearInterval(memoryInterval);
  memoryGameActive = false;
  memoryStart.disabled = false;

  if (memoryTimeLeft > 0 && matchedPairs === symbols.length) {
    // Player menang
    updateLeaderboard("memory", matchedPairs);
  } else if (memoryTimeLeft <= 0) {
    // waktu abis
    alert(`Time's up! You found ${matchedPairs} pairs.`);
    updateLeaderboard("memory", matchedPairs);
  }
}
