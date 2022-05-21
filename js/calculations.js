const secondsUp = document.getElementById('secondsUp');
const minutesUp = document.getElementById('minutesUp');

function displayMinutesOrSeconds(time) {
	return time <= 9 ? '0' + time : time;
}

function displayTime(minutes, seconds) {
	minutesUp.innerHTML = minutes <= 9 ? '0' + minutes : minutes;
	secondsUp.innerHTML = seconds <= 9 ? '0' + seconds : seconds;
}

export { displayMinutesOrSeconds, displayTime };
