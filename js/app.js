import { notification } from "./notification.js";

let seconds = "00";
let minutes = "00";
const secondsUp = document.getElementById("secondsUp");
const minutesUp = document.getElementById("minutesUp");
const buttonStart = document.getElementById("button-start");
const xValueInput = document.getElementById("x-value");
const notificationTimeInput = document.getElementById("notificationTime");
const modalForm = document.querySelector("#modalForm");
let startInterval;
let breakInterval;
let xValue;
let notificationTime;
let notificationTimeArr;

xValueInput.value = localStorage.xValue;
notificationTimeInput.value = localStorage.notificationTime;


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
  notificationTimeArr = notificationTimeArr.map(time => parseInt(time))
  alert(notificationTimeArr);
}

// Prevent users from pressing enter to submit modal forms
modalForm.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
  }
});

buttonStart.onclick = function () {
  if (this.textContent === "Start") {
    this.textContent = "Break";
    clearInterval(breakInterval);
    seconds = 0;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
    minutes = 0;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);
    startInterval = setInterval(startTimer, 10);
  } else if (this.textContent === "Break") {
    this.textContent = "Start";
    clearInterval(startInterval);
    calculateBreakDuration();
    breakInterval = setInterval(breakTimer, 10);
  }
};

function calculateBreakDuration() {
  let timeWorkedSeconds = minutes * 60 + seconds;
  let breakDurationSeconds = timeWorkedSeconds * xValueInput.value;
  let breakMinutes = Math.floor(breakDurationSeconds / 60);
  let breakSeconds = Math.ceil(breakDurationSeconds % 60);
  alert(`You have worked for 0:${displayMinutesOrSeconds(minutes)}:${displayMinutesOrSeconds(seconds)} \nBreak time is: 0:${displayMinutesOrSeconds(breakMinutes)}:${displayMinutesOrSeconds(breakSeconds)} `);
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
  seconds++;

  if (seconds <= 9) {
    secondsUp.innerHTML = "0" + seconds;
  }

  if (seconds > 9) {
    secondsUp.innerHTML = seconds;
  }

  if (seconds > 59) {
    minutes++;
    if (notificationTimeArr.includes(minutes)) {
      notification.play();
    }
    minutesUp.innerHTML = "0" + minutes;
    seconds = 0;
    secondsUp.innerHTML = "0" + 0;
  }

  if (minutes > 9) {
    minutesUp.innerHTML = minutes;
  }

  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time to Work!`;
}

function breakTimer() {
  seconds--;
  secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
  if (seconds === 0 && minutes === 0) {
    notification.play();
    clearInterval(breakInterval);
  }

  if (seconds === 0 && minutes > 0) {
    minutes--;
    minutesUp.innerHTML = displayMinutesOrSeconds(minutes);
    seconds = 59;
    secondsUp.innerHTML = displayMinutesOrSeconds(seconds);
  }

  document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
}
