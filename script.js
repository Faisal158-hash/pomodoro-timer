let timer;
let isRunning = false;
let isFocus = true;

let timeLeft = 1500; // 25 min

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  document.getElementById("timer").innerText =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;

      playSound();
      saveHistory();

      switchMode();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;

  timeLeft = getFocusTime();
  updateDisplay();
}

function switchMode() {
  isFocus = !isFocus;

  if (isFocus) {
    timeLeft = getFocusTime();
    document.getElementById("mode").innerText = "Focus";
  } else {
    timeLeft = getBreakTime();
    document.getElementById("mode").innerText = "Break";
  }

  updateDisplay();
  startTimer();
}

function getFocusTime() {
  return document.getElementById("focusInput").value * 60;
}

function getBreakTime() {
  return document.getElementById("breakInput").value * 60;
}

function playSound() {
  let audio = new Audio("https://www.soundjay.com/buttons/beep-07.mp3");
  audio.play();
}

function saveHistory() {
  if (!isFocus) return;

  let history = JSON.parse(localStorage.getItem("history")) || [];

  let now = new Date();
  let time = now.toLocaleTimeString();

  history.push(`✓ Focus completed — ${time}`);

  localStorage.setItem("history", JSON.stringify(history));

  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  let list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    list.appendChild(li);
  });
}

window.onload = loadHistory;