const API_URL = 'https://dev.api.pictos.cl/api/checkUrl';

chrome?.sidePanel
	?.setPanelBehavior({ openPanelOnActionClick: false })
	?.catch((error) => console.error(error));

const setBadge = (show) => {
	if (show) {
		chrome.action.setBadgeText({
			text: ':-)',
		});
		chrome.action.setBadgeTextColor({
			color: [255, 255, 255, 255],
		});
		chrome.action.setBadgeBackgroundColor({
			color: [0, 0, 0, 128],
		});
	} else {
		chrome.action.setBadgeText({
			text: ':-(',
		});
		chrome.action.setBadgeTextColor({
			color: [255, 255, 255, 255],
		});
		chrome.action.setBadgeBackgroundColor({
			color: [255, 0, 0, 255],
		});
	}
};
const checkAvailableAid = (url) => {
	if (!url || url.indexOf('http') !== 0) {
		return;
	}
	console.log(url);
	const queryURL = new URL(API_URL);
	const params = new URLSearchParams({ url });
	queryURL.search = params.toString();
	const queryPictos = fetch(queryURL.toString()).then(
		(data) => {
			console.log(data);
			return data.status === 404 ? null : data.json();
		},
		(reason) => {
			console.warning('rejected', reason);
			setBadge(false);
			chrome.sidePanel
				.setPanelBehavior({ openPanelOnActionClick: false })
				.catch((error) => console.error(error));
		}
	);
	queryPictos.then((json) => {
		// No hay ayudas para esta URL.
		if (json === null) {
			setBadge(false);
			chrome.sidePanel
				.setPanelBehavior({ openPanelOnActionClick: false })
				.catch((error) => console.error(error));
			return;
		}
		console.log(json);
		console.log('chequeado', json);
		chrome?.runtime?.sendMessage({
			action: 'pictos__check',
			status: 'success',
			url: json,
		});
		LAST_URL = json;
		setBadge(true);
		chrome.sidePanel
			.setPanelBehavior({ openPanelOnActionClick: true })
			.catch((error) => console.error(error));
	});
};

let LAST_URL = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log({ tabId, changeInfo, tab });

	// Si no estamos en la pestaña activa, salir.
	if (!tab.active) {
		return;
	}

	// Al navegar a otra página dentro de la misma pestaña.
	if (changeInfo.status === 'loading' && changeInfo.url) {
		// chequear → changeInfo.url
		console.info('onUpdated:loading', changeInfo);
		checkAvailableAid(changeInfo?.url);
	}
	if (changeInfo.status === 'complete') {
		// chequear también? → changeInfo.tab.url
		console.info('onUpdated:complete', changeInfo);
		checkAvailableAid(changeInfo?.tab?.url);
	}
});
chrome.tabs.onCreated.addListener((tab) => {
	console.log({ tab });
});
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log({ activeInfo });
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		console.log(tab);
		if (!tab.url) {
			return;
		}
		checkAvailableAid(tab.url);
		// checkAvailableAid();
	});
	// chrome.tabs.query(
	// 	{
	// 		active: true,
	// 		currentWindow: true,
	// 	},
	// 	(tabs) => {
	// 		console.log(tabs);
	// 		const currentTab = tabs[0];
	// 		if (currentTab.url.indexOf('http') !== 0) {
	// 			return setBadge(false);
	// 		}
	// 		const shouldShow = Math.round(Math.random());
	// 		setBadge(shouldShow);

	// 		console.log({ queryURL });

	// 		// const sidePanelOptions = chrome.sidePanel.getOptions();
	// 		// const currentSidePanel = chrome.sidePanel.getPanelBehavior();
	// 		// console.debug({ sidePanelOptions, currentSidePanel });

	// 		// window.sessionStorage.setItem('currentUrl', queryURL.toString());

	// 		// ServiceWorker.postMessage()?

	// 		console.log(tabs);
	// 	}
	// );
});
chrome.action.onClicked.addListener((tab) => {
	console.log('action:onclicked', tab);
	console.info({ LAST_URL });
	chrome.runtime.sendMessage({
		action: 'pictos__check',
		status: 'success',
		url: LAST_URL,
	});
});
chrome?.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
	if (message?.action === 'pictos__iframe-ready') {
		chrome.runtime.sendMessage({
			action: 'pictos__check',
			status: 'success',
			url: LAST_URL,
		});
	}
});
