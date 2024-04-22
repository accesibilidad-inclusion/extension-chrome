/**
 * Chequear si hay ayudas disponibles para una URL
 * @param {string} url URL para la que se quiere verificar si hay ayudas disponibles
 * @returns {Promise<null|string>}
 */
function PICTOS_checkAvailableAid(url) {
	// Nunca consultar para URLs que no son HTTP
	if (!url || url.indexOf('http') !== 0) {
		return;
	}
	const API_URL = chrome.i18n.getMessage('extensionApiURL');
	try {
		const queryURL = new URL(API_URL);

		// Consultar únicamente por el dominio.
		const queriedURL = new URL(url);
		queriedURL.pathname = '';

		queryURL.search = new URLSearchParams({
			url: queriedURL,
		}).toString();
		const queryPictos = fetch(queryURL.toString()).then(
			(data) => {
				if (data.status === 404) {
					return null;
				}
				return data.json();
			},
			(reason) => {
				return false;
			}
		);
		const resultUrl = queryPictos.then((json) => {
			try {
				if (!json) {
					return null;
				}
				const iframeURL = new URL(json);
				iframeURL.pathname = iframeURL.pathname
					.split('/')
					.filter((part) => part)
					.slice(0, 3)
					.join('/');
				const iframeParams = new URLSearchParams(
					iframeURL.searchParams.toString()
				);
				iframeParams.set('view', 'embed');
				iframeURL.search = iframeParams.toString();
				return iframeURL.toString();
			} catch (error) {
				console.error(error);
				return null;
			}
		});
		return resultUrl;
	} catch (error) {
		console.error(error);
		return null;
	}
}
