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
