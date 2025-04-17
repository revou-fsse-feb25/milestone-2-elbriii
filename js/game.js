document.addEventListener("DOMContentLoaded", function () {
  // Player name handling
  const playerNameInput = document.getElementById("playerName");
  const saveNameBtn = document.getElementById("saveName");
  let playerName = localStorage.getItem("playerName") || "Anonymous";
  playerNameInput.value = playerName;

  saveNameBtn.addEventListener("click", function () {
    playerName = playerNameInput.value.trim() || "Anonymous";
    localStorage.setItem("playerName", playerName);
    alert(`Player name set to: ${playerName}`);
  });

  // Initialize leaderboards from localStorage
  const leaderboards = {
    clicker: JSON.parse(localStorage.getItem("clickerLeaderboard")) || [],
    memory: JSON.parse(localStorage.getItem("memoryLeaderboard")) || [],
    rps: JSON.parse(localStorage.getItem("rpsLeaderboard")) || [],
  };

  function updateLeaderboard(game, score) {
    if (playerName === "Anonymous") {
      alert("Please enter your name before playing!");
      return;
    }

    leaderboards[game].push({ name: playerName, score: score });
    leaderboards[game].sort((a, b) => b.score - a.score);
    leaderboards[game] = leaderboards[game].slice(0, 10); // Keep top 10
    localStorage.setItem(
      `${game}Leaderboard`,
      JSON.stringify(leaderboards[game])
    );
    renderLeaderboards();
  }

  function renderLeaderboards() {
    // Clicker leaderboard
    const clickerLB = document.getElementById("clickerLeaderboard");
    clickerLB.innerHTML = leaderboards.clicker
      .map(
        (entry) =>
          `<li><span>${entry.name}</span><span>${entry.score} clicks</span></li>`
      )
      .join("");

    // Memory leaderboard
    const memoryLB = document.getElementById("memoryLeaderboard");
    memoryLB.innerHTML = leaderboards.memory
      .map(
        (entry) =>
          `<li><span>${entry.name}</span><span>${entry.score} pairs</span></li>`
      )
      .join("");

    // RPS leaderboard
    const rpsLB = document.getElementById("rpsLeaderboard");
    rpsLB.innerHTML = leaderboards.rps
      .map(
        (entry) =>
          `<li><span>${entry.name}</span><span>${entry.score} wins</span></li>`
      )
      .join("");
  }

  renderLeaderboards();

  // Game 1: Clicker Game
  const clickerButton = document.getElementById("clickerButton");
  const clickerDisplay = document.getElementById("clickerDisplay");
  const clickerTimer = document.getElementById("clickerTimer");
  const clickerStart = document.getElementById("clickerStart");
  let clickCount = 0;
  let clickerTimeLeft = 15;
  let clickerInterval;

  clickerStart.addEventListener("click", startClickerGame);

  function startClickerGame() {
    if (playerName === "Anonymous") {
      alert("Please enter your name before playing!");
      return;
    }

    clickCount = 0;
    clickerTimeLeft = 15;
    clickerDisplay.textContent = "0 clicks";
    clickerTimer.textContent = `Time: ${clickerTimeLeft}s`;
    clickerButton.disabled = false;
    clickerStart.disabled = true;

    clickerInterval = setInterval(() => {
      clickerTimeLeft--;
      clickerTimer.textContent = `Time: ${clickerTimeLeft}s`;

      if (clickerTimeLeft <= 0) {
        endClickerGame();
      }
    }, 1000);
  }

  function endClickerGame() {
    clearInterval(clickerInterval);
    clickerButton.disabled = true;
    clickerStart.disabled = false;
    updateLeaderboard("clicker", clickCount);
  }

  clickerButton.addEventListener("click", function () {
    if (clickerTimeLeft > 0) {
      clickCount++;
      clickerDisplay.textContent = `${clickCount} clicks`;
    }
  });

  // Game 2: Memory Card Game
  const memoryBoard = document.getElementById("memoryBoard");
  const memoryTimer = document.getElementById("memoryTimer");
  const memoryStart = document.getElementById("memoryStart");
  let memoryTimeLeft = 60;
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
    memoryTimeLeft = 60;
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

  // Game 3: Rock Paper Scissors
  const rpsScoreDisplay = document.getElementById("rpsScore");
  const rpsResultDisplay = document.getElementById("rpsResult");
  const rpsButtons = document.querySelectorAll(".rps-btn");
  const rpsResetBtn = document.getElementById("rpsReset");
  let playerScore = 0;
  let computerScore = 0;
  const choices = ["rock", "paper", "scissors"];

  rpsButtons.forEach((button) => {
    button.addEventListener("click", playRPS);
  });

  rpsResetBtn.addEventListener("click", resetRPS);

  function playRPS() {
    if (playerName === "Anonymous") {
      alert("Please enter your name before playing!");
      return;
    }

    if (playerScore >= 5 || computerScore >= 5) {
      return;
    }

    const playerChoice = this.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result;

    if (playerChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      result = `You win! ${playerChoice} beats ${computerChoice}`;
      playerScore++;
    } else {
      result = `You lose! ${computerChoice} beats ${playerChoice}`;
      computerScore++;
    }

    rpsScoreDisplay.textContent = `Player: ${playerScore} - Computer: ${computerScore}`;
    rpsResultDisplay.textContent = result;

    if (playerScore === 5) {
      rpsResultDisplay.textContent = "You won the game!";
      updateLeaderboard("rps", playerScore);
    } else if (computerScore === 5) {
      rpsResultDisplay.textContent = "Computer won the game!";
    }
  }

  function resetRPS() {
    playerScore = 0;
    computerScore = 0;
    rpsScoreDisplay.textContent = `Player: 0 - Computer: 0`;
    rpsResultDisplay.textContent = "Choose your weapon!";
  }
});
