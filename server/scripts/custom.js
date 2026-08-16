// Channel 78 customizations
console.log('Channel 78 custom.js is loading');

const customTask = () => {
	const logos = document.querySelectorAll('.logo img');

	logos.forEach((elem) => {
		elem.src = '/images/logos/weatherstar-corner-logo.png?v=20260816';
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', customTask);
} else {
	customTask();
}
