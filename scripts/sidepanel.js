chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('Message incoming on sidepanel', {
		message,
		sender,
		sendResponse,
	});
	if (message?.action === 'pictos__sidepanel-show-aid' && message.url) {
		// console.log('pictos__open-sidepanel', {
		// 	message,
		// 	sender,
		// 	sendResponse,
		// });
		// return;
		const iframe = document.getElementById('pictos-frame');
		const iframeURL = new URL(message.url);
		iframeURL.pathname = iframeURL.pathname
			.split('/')
			.filter((part) => part)
			.slice(0, 3)
			.join('/');
		console.log(iframeURL.toString());
		const iframeParams = new URLSearchParams(
			iframeURL.searchParams.toString()
		);
		iframeParams.set('view', 'embed');
		iframeURL.search = iframeParams.toString();
		// const baseURL = new URL('https://app.pictos.cl');
		// const params = new URLSearchParams({});
		// baseURL.search = params.toString();
		iframe.src = iframeURL.toString();
		iframe.style.display = 'block';
		iframe.style.border = 'none';

		const noHelp = document.getElementById('no-help');
		noHelp.style.display = 'none';
	}
});
// document.addEventListener('DOMContentLoaded', () => {
// 	console.log('sidepanel here we go');
// 	chrome.runtime.sendMessage({
// 		action: 'pictos__iframe-ready',
// 	});
// 	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 		console.info('Message received');
// 		console.info({ message, sender, sendResponse });
// 		if (message?.action === 'pictos__open-sidepanel') {
// 			console.log('pictos__open-sidepanel', {
// 				message,
// 				sender,
// 				sendResponse,
// 			});
// 			return;
// 		}
// 		if (message?.action !== 'pictos__check') {
// 			return;
// 		}
// 		if (!message.url) {
// 			return;
// 		}
// 		const iframe = document.querySelector('#pictos-frame');
// 		const iframeURL = new URL(message.url);
// 		const iframeParams = new URLSearchParams(
// 			iframeURL.searchParams.toString()
// 		);
// 		iframeParams.set('view', 'embed');
// 		// const baseURL = new URL('https://app.pictos.cl');
// 		// const params = new URLSearchParams({});
// 		// baseURL.search = params.toString();
// 		iframe.src = message.url;
// 	});
// });
