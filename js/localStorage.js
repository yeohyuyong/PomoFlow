const autoStartTimerInput = document.querySelector('#auto-start-timer');
const timerNotificationInput = document.getElementById('timerNotification');
const breakNotificationInput = document.getElementById('breakNotification');
const minimumTimeInput = document.querySelector('#minimum-time');
const xValueInput = document.getElementById('x-value');

let autoStartTimer;
let xValue;
let minimumTime;
let breakNotification;
let timerNotification;
let timerNotificationArr;
let breakNotificationArr;

//Localstorage for autostart timer
if (!localStorage.autoStartTimer) {
	autoStartTimerInput.checked = false;
	autoStartTimer = false;
} else {
	autoStartTimerInput.checked = localStorage.autoStartTimer === 'true';
	autoStartTimer = autoStartTimerInput.checked;
}

autoStartTimerInput.addEventListener('change', () => {
	autoStartTimer = autoStartTimerInput.checked;
	window.localStorage.setItem('autoStartTimer', autoStartTimer);
});

// Localstorage for minimum time input
minimumTimeInput.value = localStorage.minimumTime || 0;

minimumTimeInput.addEventListener('change', (e) => {
	minimumTime = e.target.value;
	window.localStorage.setItem('minimumTime', minimumTime);
	minimumTimeInput.value = minimumTime;
});

// Localstorage for log timings
if (!localStorage.logTimings) {
	logTimings.innerHTML = '';
} else {
	logTimings.innerHTML = localStorage.logTimings;
}

// Localstorage for X-value
xValueInput.value = localStorage.xValue;

xValueInput.addEventListener('change', (e) => {
	xValue = parseFloat(e.target.value);
	window.localStorage.setItem('xValue', xValue);
	xValueInput.value = xValue;
});

// localStorage for timer notification
if (!localStorage.timerNotification) {
	timerNotificationInput.value = '';
} else {
	timerNotificationInput.value = localStorage.timerNotification;
	timerNotificationArr = timerNotificationInput.value.split(',');
	timerNotificationArr = timerNotificationArr.map((time) => parseInt(time));
}

timerNotificationInput.addEventListener('change', (e) => {
	timerNotification = e.target.value;
	window.localStorage.setItem('timerNotification', timerNotification);
	timerNotificationInput.value = timerNotification;
	timerNotificationArr = timerNotification.split(',');
	timerNotificationArr = timerNotificationArr.map((time) => parseInt(time));
});

// localStorage for break notification
if (!localStorage.breakNotification) {
	breakNotificationInput.value = '';
} else {
	breakNotificationInput.value = localStorage.breakNotification;
	breakNotificationArr = breakNotificationInput.value.split(',');
	breakNotificationArr = breakNotificationArr.map((time) => parseInt(time));
}

breakNotificationInput.addEventListener('change', (e) => {
	breakNotification = e.target.value;
	window.localStorage.setItem('breakNotification', breakNotification);
	breakNotificationInput.value = breakNotification;
	breakNotificationArr = breakNotification.split(',');
	breakNotificationArr = breakNotificationArr.map((time) => parseInt(time));
});

export { timerNotificationArr, breakNotificationArr };
