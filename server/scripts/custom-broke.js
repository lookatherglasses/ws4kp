// this file is loaded by the main html page (when renamed to custom.js)
// it is intended to allow for customizations that do not get published back to the git repo
// for example, changing the logo

// WBLB-TV customizations

const STATION_NAME_REPLACEMENTS = [
	['Virginia Tech', 'Robin Song'],
	['VIRGINIA TECH', 'ROBIN SONG'],
	['Blacksburg / Virginia Tech', 'Robin Song'],
	['BLACKSBURG / VIRGINIA TECH', 'ROBIN SONG'],
];

const replaceTextInNode = (node) => {
	if (!node || !node.nodeValue) return;

	let text = node.nodeValue;

	STATION_NAME_REPLACEMENTS.forEach(([findText, replaceText]) => {
		text = text.replaceAll(findText, replaceText);
	});

	if (text !== node.nodeValue) {
		node.nodeValue = text;
	}
};

const walkAndReplaceText = (root = document.body) => {
	const walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		null,
		false,
	);

	let node = walker.nextNode();

	while (node) {
		replaceTextInNode(node);
		node = walker.nextNode();
	}
};

const changeLogo = () => {
	const logos = document.querySelectorAll('.logo img');

	logos.forEach((elem) => {
		elem.src = '/images/logos/WBLB-corner-logo.png';
	});
};

const customTask = () => {
	changeLogo();
	walkAndReplaceText();

	const observer = new MutationObserver(() => {
		walkAndReplaceText();
		changeLogo();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', customTask);
} else {
	customTask();
}