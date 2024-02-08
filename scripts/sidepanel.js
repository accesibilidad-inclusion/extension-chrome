document.addEventListener('DOMContentLoaded', () => {
	console.log('sidepanel here we go');
	chrome.runtime.sendMessage({
		action: 'pictos__iframe-ready',
	});
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		console.info('Message received');
		console.info({ message, sender, sendResponse });
		if (message?.action !== 'pictos__check') {
			return;
		}
		if (!message.url) {
			return;
		}
		const iframe = document.querySelector('#pictos-frame');
		// const baseURL = new URL('https://dev.app.pictos.cl');
		// const params = new URLSearchParams({});
		// baseURL.search = params.toString();
		iframe.src = message.url;
	});
});
