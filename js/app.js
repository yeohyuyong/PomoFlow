import {
  notification
} from "./notification.js";

let seconds = "00";
let minutes = "00";
const secondsUp = document.getElementById("secondsUp");
const minutesUp = document.getElementById("minutesUp");
const buttonStart = document.getElementById("button-start");
const xValueInput = document.getElementById("x-value");
const notificationTimeInput = document.getElementById("notificationTime");
const modalForm = document.querySelector("#modalForm");
const logTimings = document.querySelector("#logTimings");
let startInterval;
let breakInterval;
let xValue;
let notificationTime;
let notificationTimeArr;
let startTime;

let breakDurationSeconds;


xValueInput.value = localStorage.xValue;
notificationTimeInput.value = localStorage.notificationTime;
notificationTimeArr = notificationTimeInput.value.split(",");
notificationTimeArr = notificationTimeArr.map(time => parseInt(time));

// X-Value change
xValueInput.addEventListener("change", updateXValue);

function updateXValue(e) {
  xValue = parseFloat(e.target.value);
  window.localStorage.setItem("xValue", xValue);
  xValueInput.value = xValue;
}

// Notification time change
notificationTimeInput.addEventListener("change", updateNotificationValue);

function updateNotificationValue(e) {
  notificationTime = e.target.value;
  window.localStorage.setItem("notificationTime", notificationTime);
  notificationTimeInput.value = notificationTime;
  notificationTimeArr = notificationTime.split(",");
  notificationTimeArr = notificationTimeArr.map(time => parseInt(time));
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
    clearInterval(breakInterval);
    seconds = 0;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
    minutes = 0;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);
    startInterval = setInterval(startTimer, 1000);
  } else if (this.textContent === "Break") {
    this.textContent = "Start";
    clearInterval(startInterval);
    let newItem = document.createElement("li");
    newItem.textContent = `0:${displayMinutesOrSeconds(minutes)}:${displayMinutesOrSeconds(seconds)}`;
    logTimings.prepend(newItem);
    calculateBreakDuration();
    startTime = Date.now();
    breakInterval = setInterval(breakTimer, 1000);
  }
};

function calculateBreakDuration() {
  let timeWorkedSeconds = minutes * 60 + seconds;
  breakDurationSeconds = Math.ceil(timeWorkedSeconds * xValueInput.value);
  let breakMinutes = Math.floor(breakDurationSeconds / 60);
  let breakSeconds = Math.ceil(breakDurationSeconds % 60);
  alert(`Work Time: ${minutes} minutes ${seconds} seconds \nBreak Time: ${breakMinutes} minutes ${breakSeconds} seconds `);
  seconds = breakSeconds;
  minutes = breakMinutes;
  displayTime(minutes, seconds)
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
    minutesUp.innerHTML = "0" + minutes
  } else {
    minutesUp.innerHTML = minutes
  }
  if (seconds <= 9) {
    secondsUp.innerHTML = "0" + seconds
  } else {
    secondsUp.innerHTML = seconds
  }
}

function startTimer() {
  let millisecondsPassed = Date.now() - startTime;
  let secondsPassed = Math.floor(millisecondsPassed / 1000);
  minutes = Math.floor(secondsPassed / 60);
  seconds = secondsPassed % 60;
  displayTime(minutes, seconds)
  if (notificationTimeArr.indexOf(minutes) !== -1 && seconds === 0) {
    notification.play();
  }
  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for Work!`;
}

function breakTimer() {
  let millisecondsPassed = Date.now() - startTime;
  let secondsPassed = Math.floor(millisecondsPassed / 1000);
  if (breakDurationSeconds === 0) {
    notification.play();
    document.title = "PomoX"
    clearInterval(breakInterval);
  } else {
    let secondsRemaining = breakDurationSeconds - secondsPassed;
    minutes = Math.floor(secondsRemaining / 60);
    seconds = secondsRemaining % 60;
    displayTime(minutes, seconds)
    document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
    if (secondsRemaining <= 0) {
      document.title = "PomoX"
      notification.play();
      clearInterval(breakInterval);
    }
  }
}