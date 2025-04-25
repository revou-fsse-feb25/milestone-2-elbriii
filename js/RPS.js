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
