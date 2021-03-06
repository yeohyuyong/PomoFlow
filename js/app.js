import { timerNotificationSound, breakNotificationSound, notifyMe } from './notification.js';
import { timerNotificationArr, breakNotificationArr, autoStartTimer, desktopNotification } from './localStorage.js';
import { displayMinutesOrSeconds, displayTime, checkMinTime } from './calculations.js';
import { testingDivide } from './testing.js';

let seconds = '00';
let minutes = '00';
const buttonStart = document.getElementById('button-start');
const xValueInput = document.getElementById('x-value');
const minimumTimeInput = document.querySelector('#minimum-time');
const logTimings = document.querySelector('#logTimings');
const extendBreakModalButton = document.querySelector('#extend-break-button');

let startInterval;
let breakInterval;
let startTime;
let breakDurationSeconds;

buttonStart.onclick = function () {
	if (this.textContent === 'Start') {
		startTimerLoop();
	} else if (this.textContent === 'Break') {
		clearInterval(startInterval);
		this.textContent = 'Start';
		minimumTimeInput.removeAttribute('disabled');
		extendBreakModalButton.classList.remove('modal-invisible');
		createLogItem();
		calculateBreakDuration();
		startTime = Date.now();
		breakInterval = setInterval(breakTimer, 1000);
	}
};

//Timer running
function startTimerLoop() {
	startTime = Date.now();
	clearInterval(breakInterval);
	buttonStart.textContent = 'Break';
	extendBreakModalButton.classList.add('modal-invisible');
	seconds = 0;
	minutes = 0;
	checkMinTime(minutes, parseInt(minimumTimeInput.value));
	startInterval = setInterval(startTimer, 1000);
}

function startTimer() {
	let millisecondsPassed = Date.now() - startTime;
	let secondsPassed = Math.floor(millisecondsPassed / (1000 / testingDivide));
	minutes = Math.floor(secondsPassed / 60);
	seconds = secondsPassed % 60;
	displayTime(minutes, seconds, 'work');
	checkMinTime(minutes, parseInt(minimumTimeInput.value));
	if (timerNotificationArr && timerNotificationArr.indexOf(minutes) !== -1 && seconds === 0) {
		timerNotificationSound.play();
	}
}

function breakTimer() {
	let millisecondsPassed = Date.now() - startTime;
	let secondsPassed = Math.floor(millisecondsPassed / (1000 / testingDivide));
	let secondsRemaining = breakDurationSeconds - secondsPassed;
	minutes = Math.floor(secondsRemaining / 60);
	seconds = secondsRemaining % 60;
	displayTime(minutes, seconds, 'break');
	if (breakDurationSeconds === 0 || secondsRemaining <= 0) {
		clearInterval(breakInterval);
		minutes = 0;
		seconds = 0;
		breakNotificationSound.play();
		displayTime(minutes, seconds, 'end');
		extendBreakModalButton.classList.add('modal-invisible');
		desktopNotification && notifyMe();
		autoStartTimer && startTimerLoop();
	} else if (breakNotificationArr && breakNotificationArr.indexOf(minutes) !== -1 && seconds === 0) {
		breakNotificationSound.play();
	}
}

function calculateBreakDuration() {
	let timeWorkedSeconds = minutes * 60 + seconds;
	breakDurationSeconds = Math.ceil(timeWorkedSeconds / xValueInput.value);
	seconds = Math.ceil(breakDurationSeconds % 60);
	minutes = Math.floor(breakDurationSeconds / 60);
	displayTime(minutes, seconds, 'break');
}

function createLogItem() {
	let newItem = document.createElement('li');
	let span = document.createElement('SPAN');
	let button = document.createElement('button');
	button.textContent = '\u00D7';
	//Delete log item when close button is clicked
	button.addEventListener('click', function (evt) {
		deleteLog(this);
		evt.stopPropagation(); //prevents copying to clipboard when close button is clicked
	});
	button.setAttribute('onclick', 'deleteLog(this)'); //allow log item to be deleted after page refresh
	button.classList.add('close-button');
	span.textContent = `${displayMinutesOrSeconds(minutes)}:${displayMinutesOrSeconds(seconds)}`;
	span.append(button);
	span.setAttribute('onclick', 'copyToClipboard(this.textContent)');
	span.style.cursor = 'copy';
	newItem.append(span);
	logTimings.prepend(newItem);
	localStorage.logTimings = logTimings.innerHTML;
}

//Extend break buttons
//Break extends by X minute depending on the button clicked
const extendBreakButtons = document.querySelectorAll('#extend-break-modal .extend-break');
for (let button of extendBreakButtons) {
	button.addEventListener('click', function () {
		let extraMinute = this.textContent.split(' ')[0];
		breakDurationSeconds += parseInt(extraMinute) * 60;
	});
}
