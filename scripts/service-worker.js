try {
	importScripts('./check-available-aids.js');
} catch (e) {
	console.error(e);
}

chrome?.sidePanel
	?.setPanelBehavior({ openPanelOnActionClick: false })
	?.catch((error) => console.error(error));

/**
 * Cambiar ícono de la extensión dependiendo si existe ayuda disponible
 * @param {boolean} show Mostrar indicador de ayuda disponible
 * @param {number} tabId ID de la pestaña donde se mostrará el indicador
 */
const setBadge = (show, tabId) => {
	if (show) {
		chrome.action.setIcon({
			path: '../assets/img/con-apoyo-alt.png',
			tabId,
		});
	} else {
		chrome.action.setIcon({
			path: '../assets/img/icon48.png',
			tabId,
		});
	}
};

chrome.action.onClicked.addListener((tab) => {
	chrome.sidePanel
		.open({
			tabId: tab.id,
		})
		.then(() => {
			PICTOS_checkAvailableAid(tab.url).then((data) => {
				if (data) {
					chrome.runtime.sendMessage({
						action: 'pictos__sidepanel-show-aid',
						status: 'success',
						url: data,
					});
				} else {
					chrome.runtime.sendMessage({
						action: 'pictos__sidepanel-empty',
						status: 'empty',
						url: tab.url,
					});
				}
			});
		});
});
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
// 	console.log({ tabId, changeInfo, tab });
// 	if (!tab.url) {
// 		console.log('NOURL');
// 		return;
// 	}
// 	if (tab.url.indexOf('pucv') === -1) {
// 		console.log('NOPUCV');
// 		await chrome.sidePanel.setOptions({
// 			tabId,
// 			enabled: false,
// 		});
// 	}
// });

chrome?.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
	if (message?.action === 'pictos__aid-available') {
		setBadge(true, sender.tab.id);
	}

	// El usuario clickeó en el overlay; abrir el sidepanel y enviar la URL para el iframe.
	if (message?.action === 'pictos__open-sidepanel') {
		let openSidebar = chrome.sidePanel.open({
			tabId: sender.tab.id,
		});
		openSidebar.then((foo) => {
			setTimeout(() => {
				chrome.runtime.sendMessage({
					action: 'pictos__sidepanel-show-aid',
					status: 'success',
					url: message.url,
				});
			}, 50);
		});
	}
});
