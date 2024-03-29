const API_URL = 'https://dev.api.pictos.cl/api/checkUrl';

chrome?.sidePanel
	?.setPanelBehavior({ openPanelOnActionClick: false })
	?.catch((error) => console.error(error));

const setBadge = (show, tabId) => {
	if (show) {
		chrome.action.setIcon({
			path: '../assets/img/con-apoyo.png',
			tabId,
		});
	} else {
		chrome.action.setIcon({
			path: '../assets/img/sin-apoyo.png',
			tabId,
		});
	}
	// chrome.sidePanel
	// 	.setPanelBehavior({ openPanelOnActionClick: show })
	// 	.catch((error) => console.error(error));
};
const checkAvailableAid = (url, tabId) => {
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
			setBadge(false, tabId);
		}
	);
	queryPictos.then((json) => {
		// No hay ayudas para esta URL.
		if (json === null) {
			setBadge(false, tabId);
			return;
		}
		console.log(json);
		console.log('chequeado', json);
		LAST_URL = json;
		setBadge(true, tabId);
		chrome?.runtime?.sendMessage({
			action: 'pictos__check',
			status: 'success',
			url: json,
		});
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
		checkAvailableAid(changeInfo?.url, tabId);
	}
	if (changeInfo.status === 'complete') {
		// chequear también? → changeInfo.tab.url
		console.info('onUpdated:complete', changeInfo);
		checkAvailableAid(changeInfo?.tab?.url, tabId);
	}
});
chrome.tabs.onCreated.addListener((tab) => {
	console.log({ tab });
});
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log('tabs.onActivated', { activeInfo });
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		console.log('tabs.onActivated::anoymous', tab);
		if (!tab.url) {
			return;
		}
		checkAvailableAid(tab.url, activeInfo.tabId);
	});
});
chrome.action.onClicked.addListener((tab) => {
	console.log('action:onclicked', { tab, LAST_URL });
	chrome.sidePanel.open(
		{
			tabId: tab.id,
		},
		() => {
			chrome.runtime.sendMessage({
				action: 'pictos__check',
				status: 'success',
				url: LAST_URL.replace('#', ''),
			});
		}
	);
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
