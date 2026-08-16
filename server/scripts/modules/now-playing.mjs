const DISPLAY_TIME = 7000;
let hideTimer;

document.addEventListener('ws4kp:trackchange', (event) => {
	const overlay = document.getElementById('now-playing-overlay');
	const title = overlay?.querySelector('.track-title');
	if (!overlay || !title || !event.detail?.title) return;

	title.textContent = event.detail.title;
	overlay.classList.add('show');

	if (hideTimer) clearTimeout(hideTimer);
	hideTimer = setTimeout(() => {
		overlay.classList.remove('show');
		hideTimer = undefined;
	}, DISPLAY_TIME);
});
