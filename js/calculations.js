const secondsUp = document.getElementById('secondsUp');
const minutesUp = document.getElementById('minutesUp');
const buttonStart = document.getElementById('button-start');
const minimumTimeInput = document.querySelector('#minimum-time');

function displayMinutesOrSeconds(time) {
	return time <= 9 ? '0' + time : time;
}

function displayTime(minutes, seconds) {
	minutesUp.innerHTML = minutes <= 9 ? '0' + minutes : minutes;
	secondsUp.innerHTML = seconds <= 9 ? '0' + seconds : seconds;
}

function displayTitle(status) {
	if (status === 'break') {
		document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for a break!`;
	} else if (status === 'work') {
		document.title = `${minutesUp.innerHTML}:${secondsUp.innerHTML} - Time for Work!`;
	}
}

//Check if timer has passed minimum time
//Hide break button and prevent users from changing minimum time if minumum time not reached
function checkMinTime(minutePassed, minimumTime) {
	if (minutePassed >= minimumTime) {
		buttonStart.style.visibility = 'visible';
		minimumTimeInput.removeAttribute('disabled');
	} else if (minimumTime > minutePassed) {
		buttonStart.style.visibility = 'hidden';
		minimumTimeInput.setAttribute('disabled', '');
	}
}

export { displayMinutesOrSeconds, displayTime, displayTitle, checkMinTime };
