//Nav buttons hover effects
//Hide white icon and show black icon when hovering over nav buttons
const navButtons = document.querySelectorAll('.nav-button');

for (let button of navButtons) {
	button.addEventListener('mouseover', function () {
		let buttonIcons = this.children;
		for (let icon of buttonIcons) {
			icon.classList.toggle('icon-hidden');
		}
	});

	button.addEventListener('mouseout', function () {
		let buttonIcons = this.children;
		for (let icon of buttonIcons) {
			icon.classList.toggle('icon-hidden');
		}
	});
}

const clearLogButton = document.querySelector('.clear-log-button');
const logTimings = document.querySelector('#logTimings');

clearLogButton.addEventListener('click', function () {
	logTimings.innerHTML = '';
	localStorage.logTimings = logTimings.innerHTML;
});
