(function () {
	/**
	 * Construir overlay que indica que existen ayudas disponibles.
	 */
	const setupOverlay = (iframeURL) => {
		// Elemento contenedor.
		const overlay = document.createElement('div');
		overlay.classList.add('pictos-overlay');
		overlay.classList.add('pictos-overlay--hidden');
		overlay.id = 'pictos-overlay';

		// Mensaje del overlay.
		const overlayText = document.createElement('div');
		overlayText.classList.add('pictos-overlay__text');

		const overlayTextMessage = document.createElement('span');
		overlayTextMessage.id = 'pictos-overlay__message';
		overlayTextMessage.textContent = chrome.i18n.getMessage('overlayText');

		// Ícono mirón.
		const overlayIcon = document.createElement('span');
		overlayIcon.id = 'pictos-overlay__icon';
		overlayIcon.classList.add('pictos-overlay__icon');
		overlayText.prepend(overlayIcon);

		// Call to action.
		const overlayTextCallToAction = document.createElement('span');
		overlayTextCallToAction.id = 'pictos-overlay__cta';
		overlayTextCallToAction.classList.add('pictos-overlay__cta');
		overlayTextCallToAction.textContent = chrome.i18n.getMessage(
			'overlayTextCallToAction'
		);
		overlayTextCallToAction.addEventListener('click', (e) => {
			e.preventDefault();
			chrome.runtime.sendMessage({
				action: 'pictos__open-sidepanel',
				url: iframeURL,
			});
			overlay.classList.remove('pictos-overlay--visible');
		});
		overlayTextMessage.appendChild(overlayTextCallToAction);
		overlayText.appendChild(overlayTextMessage);
		overlay.appendChild(overlayText);

		// Botón para cerrar overlay.
		const overlayClose = document.createElement('button');
		overlayClose.textContent = chrome.i18n.getMessage('overlayTextClose');
		overlayClose.classList.add('pictos-overlay__close');
		overlayClose.addEventListener('click', (e) => {
			e.preventDefault();
			overlay.classList.remove('pictos-overlay--visible');
		});
		overlay.appendChild(overlayClose);

		document.body.appendChild(overlay);

		// Le damos un breve respiro antes de mostrar el overlay.
		setTimeout(() => {
			overlay.classList.add('pictos-overlay--visible');
		}, 350);

		// Efecto de mirar a la izquierda o derecha del ícono.
		document.addEventListener('mousemove', (e) => {
			const theIcon = document.getElementById('pictos-overlay__icon');
			const middle = theIcon.offsetLeft + theIcon.offsetWidth / 2;
			if (e.clientX < middle) {
				theIcon.classList.remove('pictos-overlay__icon--looking-right');
			} else {
				theIcon.classList.add('pictos-overlay__icon--looking-right');
			}
		});
	};

	// Chequear si la página tiene ayudas disponibles.
	const hasAids = PICTOS_checkAvailableAid(window.location.href);
	hasAids.then((data) => {
		if (data) {
			// Si hay ayudas disponibles, mostrar overlay.
			setupOverlay(data);

			// Informar a la extensión que hay ayudas disponibles.
			chrome.runtime.sendMessage({
				action: 'pictos__aid-available',
				url: data,
			});
		}
	});
})();
