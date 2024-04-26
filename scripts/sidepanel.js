chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const iframe = document.getElementById('pictos-frame');
	if (message?.action === 'pictos__sidepanel-show-aid' && message.url) {
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
		iframe.src = iframeURL.toString();
	}
	if (message?.action === 'pictos__sidepanel-empty') {
		const iframe = document.getElementById('pictos-frame');
		const iframeURL = new URL(
			chrome.i18n.getMessage('extensionNotFoundUrl')
		);
		iframeURL.search = new URLSearchParams({ url: message.url }).toString();
		iframe.src = iframeURL.toString();
	}
});
