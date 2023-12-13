console.log('sw-sidepanel');
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			const shouldShow = Math.round(Math.random());
			if (shouldShow) {
				chrome.action.setBadgeText(
					{
						text: ':-)',
					},
					() => {
						console.log('hi');
					}
				);
				chrome.action.setBadgeTextColor({
					color: [255, 255, 255, 255],
				});
				chrome.action.setBadgeBackgroundColor({
					color: [0, 255, 0, 255],
				});
			} else {
				chrome.action.setBadgeText(
					{
						text: ':-(',
					},
					() => {
						console.log('hi');
					}
				);
				chrome.action.setBadgeTextColor({
					color: [255, 255, 255, 255],
				});
				chrome.action.setBadgeBackgroundColor({
					color: [255, 0, 0, 255],
				});
			}
			// const queryURL = new URL('https://api.pictos.cl/check');
			// const params = new URLSearchParams({
			// 	url: tabs[0].url,
			// });
			// queryURL.search = params.toString();
			// console.log({ queryURL });
			// fetch(queryURL.toString())
			// 	.then((data) => {
			// 		console.log('chequeado');
			// 	})
			// 	.finally(function (foo, bar) {
			// 		console.log({ arguments, foo, bar });
			// 	});
			console.log(tabs);
		}
	);
});
