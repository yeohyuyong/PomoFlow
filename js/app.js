import { timerNotificationSound, breakNotificationSound } from "./notification.js";

let seconds = "00";
let minutes = "00";
const secondsUp = document.getElementById("secondsUp");
const minutesUp = document.getElementById("minutesUp");
const buttonStart = document.getElementById("button-start");
const xValueInput = document.getElementById("x-value");
const minimumTimeInput = document.querySelector("#minimum-time");
const timerNotificationInput = document.getElementById("timerNotification");
const breakNotificationInput = document.getElementById("breakNotification");
const modalForm = document.querySelector("#modalForm");
const logTimings = document.querySelector("#logTimings");
let startInterval;
let breakInterval;
let xValue;
let minimumTime;
let breakNotification;
let breakNotificationArr;
let timerNotification;
let timerNotificationArr;
let startTime;
let breakDurationSeconds;


minimumTimeInput.value = localStorage.minimumTime;

minimumTimeInput.addEventListener("change", updateMinimumTime);

function updateMinimumTime(e) {
  minimumTime = e.target.value;
  window.localStorage.setItem("minimumTime", minimumTime);
  minimumTimeInput.value = minimumTime;
}

if (localStorage.logTimings === undefined) {
  logTimings.innerHTML = "";
} else {
  logTimings.innerHTML = localStorage.logTimings;
}

xValueInput.value = localStorage.xValue;

if (localStorage.timerNotification === undefined) {
  timerNotificationInput.value = "";
} else {
  timerNotificationInput.value = localStorage.timerNotification;
  timerNotificationArr = timerNotificationInput.value.split(",");
  timerNotificationArr = timerNotificationArr.map((time) => parseInt(time));
}

if (localStorage.breakNotification === undefined) {
  breakNotificationInput.value = "";
} else {
  breakNotificationInput.value = localStorage.breakNotification;
  breakNotificationArr = breakNotificationInput.value.split(",");
  breakNotificationArr = breakNotificationArr.map((time) => parseInt(time));
}

// X-Value change
xValueInput.addEventListener("change", updateXValue);

function updateXValue(e) {
  xValue = parseFloat(e.target.value);
  window.localStorage.setItem("xValue", xValue);
  xValueInput.value = xValue;
}

// Timer notification updated
timerNotificationInput.addEventListener("change", updateNotificationValueTimer);

function updateNotificationValueTimer(e) {
  timerNotification = e.target.value;
  window.localStorage.setItem("timerNotification", timerNotification);
  timerNotificationInput.value = timerNotification;
  timerNotificationArr = timerNotification.split(",");
  timerNotificationArr = timerNotificationArr.map((time) => parseInt(time));
}

// Break notification updated
breakNotificationInput.addEventListener("change", updateNotificationValueBreak);

function updateNotificationValueBreak(e) {
  breakNotification = e.target.value;
  window.localStorage.setItem("breakNotification", breakNotification);
  breakNotificationInput.value = breakNotification;
  breakNotificationArr = breakNotification.split(",");
  breakNotificationArr = breakNotificationArr.map((time) => parseInt(time));
}

// Prevent users from pressing enter to submit modal forms
modalForm.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
  }
});

buttonStart.onclick = function () {
  if (this.textContent === "Start") {
    startTime = Date.now();
    this.textContent = "Break";

    //Make break button disabled to prevent users from taking a break before minimum time is up
    if (parseInt(minimumTimeInput.value) > 0){ //Ensure minimumTimeInput.value is set, else break button will not be disabled
      this.setAttribute('disabled', '');
      this.style.cursor = "not-allowed";
    }

    clearInterval(breakInterval);
    seconds = 0;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
    minutes = 0;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);

    //Disable minimumTimeInput to prevent users from changing value
    minimumTimeInput.setAttribute('disabled', '');

    startInterval = setInterval(startTimer, 1000);
  } else if (this.textContent === "Break") {
    this.textContent = "Start";
    minimumTimeInput.removeAttribute('disabled');
    clearInterval(startInterval);
    createLogItem();
    calculateBreakDuration();
    startTime = Date.now();
    breakInterval = setInterval(breakTimer, 1000);
  }
};

function createLogItem() {
  let newItem = document.createElement("li");
  let span = document.createElement("SPAN");
  let button = document.createElement("button");
  button.textContent = "\u00D7";
  button.setAttribute("onclick", "deleteLog(this)");
  button.classList.add("close-button");
  span.textContent = `0:${displayMinutesOrSeconds(minutes)}:${displayMinutesOrSeconds(seconds)}`;
  span.append(button);
  newItem.append(span);
  logTimings.prepend(newItem);
  localStorage.logTimings = logTimings.innerHTML;
}

function calculateBreakDuration() {
  let timeWorkedSeconds = minutes * 60 + seconds;
  breakDurationSeconds = Math.ceil(timeWorkedSeconds * xValueInput.value);
  let breakMinutes = Math.floor(breakDurationSeconds / 60);
  let breakSeconds = Math.ceil(breakDurationSeconds % 60);
  alert(`Work Time: ${minutes} minutes ${seconds} seconds \nBreak Time: ${breakMinutes} minutes ${breakSeconds} seconds `);
  seconds = breakSeconds;
  minutes = breakMinutes;
  displayTime(minutes, seconds);
  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
}

function displayMinutesOrSeconds(time) {
  if (time <= 9) {
    return "0" + time;
  } else {
    return time;
  }
}

function displayTime(minutes, seconds) {
  if (minutes <= 9) {
    minutesUp.innerHTML = "0" + minutes;
  } else {
    minutesUp.innerHTML = minutes;
  }
  if (seconds <= 9) {
    secondsUp.innerHTML = "0" + seconds;
  } else {
    secondsUp.innerHTML = seconds;
  }
}

function startTimer() {
  let millisecondsPassed = Date.now() - startTime;
  let secondsPassed = Math.floor(millisecondsPassed / 100);
  minutes = Math.floor(secondsPassed / 60);
  seconds = secondsPassed % 60;
  displayTime(minutes, seconds);
  if (minutes >= parseInt(minimumTimeInput.value)){
    buttonStart.removeAttribute('disabled');
    buttonStart.style.cursor = "pointer";
  }
  if (timerNotificationArr !== undefined && timerNotificationArr.indexOf(minutes) !== -1 && seconds === 0) {
    timerNotificationSound.play();
  }
  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for Work!`;
}

function breakTimer() {
  let millisecondsPassed = Date.now() - startTime;
  let secondsPassed = Math.floor(millisecondsPassed / 1000);
  if (breakDurationSeconds === 0) {
    breakNotificationSound.play();
    document.title = "PomoFlow";
    clearInterval(breakInterval);
  } else {
    let secondsRemaining = breakDurationSeconds - secondsPassed;
    minutes = Math.floor(secondsRemaining / 60);
    seconds = secondsRemaining % 60;
    displayTime(minutes, seconds);
    if (breakNotificationArr !== undefined && breakNotificationArr.indexOf(minutes) !== -1 && seconds === 0) {
      breakNotificationSound.play();
    }
    document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
    if (secondsRemaining <= 0) {
      document.title = "PomoFlow";
      breakNotificationSound.play();
      clearInterval(breakInterval);
    }
  }
}

//Nav button Hover effects

const navButtons = document.querySelectorAll(".nav-button");
for (let i=0;i<navButtons.length;i++){
  navButtons[i].addEventListener("mouseover", function(){
    let buttonImgs = this.children
    for (let img of buttonImgs){
    img.classList.toggle("img-hidden");
    }
   }
  )

  navButtons[i].addEventListener("mouseout", function(){
    let buttonImgs = this.children
    for (let img of buttonImgs){
    img.classList.toggle("img-hidden");
    }
   }
  )
}
