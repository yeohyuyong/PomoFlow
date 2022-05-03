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
let start;
let startTime;
let endTime;
let end;
let diff = 0;

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
    startTime = new Date().getTime();
    this.textContent = "Break";
    clearInterval(breakInterval);
    seconds = 0;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
    minutes = 0;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);
    startInterval = setInterval(startTimer, 1000 - diff);
  } else if (this.textContent === "Break") {
    this.textContent = "Start";
    clearInterval(startInterval);
    let newItem = document.createElement("li");
    newItem.textContent = `0:${displayMinutesOrSeconds(minutes)}:${displayMinutesOrSeconds(seconds)}`;
    logTimings.append(newItem);
    calculateBreakDuration();
    breakInterval = setInterval(breakTimer, 1000);
  }
};

function calculateBreakDuration() {
  let timeWorkedSeconds = minutes * 60 + seconds;
  let breakDurationSeconds = timeWorkedSeconds * xValueInput.value;
  let breakMinutes = Math.floor(breakDurationSeconds / 60);
  let breakSeconds = Math.ceil(breakDurationSeconds % 60);
  alert(`Work Time: ${minutes} minutes ${seconds} seconds \nBreak Time: ${breakMinutes} minutes ${breakSeconds} seconds `);
  seconds = breakSeconds;
  secondsUp.innerHTML = displayMinutesOrSeconds(breakSeconds);
  minutes = breakMinutes;
  minutesUp.innerHTML = displayMinutesOrSeconds(breakMinutes);
}

function displayMinutesOrSeconds(time) {
  if (time <= 9) {
    return "0" + time;
  } else {
    return time;
  }
}

function startTimer() {
  end = new Date().getTime();
  diff = end - start - 1000
  console.log(diff)
  seconds++;

  if (seconds <= 9) {
    secondsUp.innerHTML = "0" + seconds;
  }

  if (seconds > 9) {
    secondsUp.innerHTML = seconds;
  }

  if (seconds > 59) {
    minutes++;

    if (notificationTimeArr !== undefined) {
      if (notificationTimeArr.indexOf(minutes) !== -1) {
        endTime = new Date().getTime();
        console.log((endTime - startTime) / 1000)
        notification.play();
      }
    }
    minutesUp.innerHTML = "0" + minutes;
    seconds = 0;
    secondsUp.innerHTML = "0" + 0;
  }

  if (minutes > 9) {
    minutesUp.innerHTML = minutes;
  }

  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time to Work!`;
  start = new Date().getTime();
}

function breakTimer() {
  if (seconds === 0 && minutes === 0) {
    notification.play();
    document.title = "PomoX"
    clearInterval(breakInterval);
  } else if (seconds === 0 && minutes > 0) {
    minutes--;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);
    seconds = 59;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
  } else {
    seconds--;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
    document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
  }
}