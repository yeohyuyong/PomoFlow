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
