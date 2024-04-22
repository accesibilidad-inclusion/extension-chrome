# Extensión para navegador de PICTOS

# Descripción

La extensión para navegadores basados en Chromium de PICTOS permite integrar las ayudas de tareas web en el navegador.

Agrega un ícono de la extensión a la barra del navegador que indica cuando existen ayudas disponibles para el sitio que la persona está usando.

# Instalación en modo desarrollo

Clona el repositorio [https://github.com/accesibilidad-inclusion/extension-chrome](https://github.com/accesibilidad-inclusion/extension-chrome) a una carpeta local.

En Chromium/Chrome, ingresa a `chrome://extensions/` y habilita el **Modo de desarrollador**.

Clickea el botón para **Cargar extensión sin empaquetar** y abre la carpeta donde clonaste el repo.

# TOREAD

- [ ] https://developer.chrome.com/docs/extensions/develop/concepts/messaging
- [ ] https://developer.chrome.com/docs/extensions/reference/api/tabs#method-sendMessage
- [ ] https://web.dev/articles/two-way-communication-guide
- [ ] https://groups.google.com/a/chromium.org/g/chromium-extensions/c/Y5pYf1iv2k4

---

# TODO

- [x] mejorar diseño ícono de extensión y estados
- [x] modificar ícono de acuerdo a disponibilidad de ayudas
- [x] limitar visibilidad de sidepanel según disponibilidad de ayuda
- [x] enlazar URL de pestaña con sidepanel (para abrir pictos en ayuda para el sitio visible)
- [x] mostrar overlay sobre página al encontrar ayudas
- [x] modificar ícono de disponibilidad
- [ ] si no hay ayuda → pantalla evaluar / pedir ayuda
- [ ] cambiar "cerrar" por "salir" en la app
- [ ] preparar contenidos y assets para subir extensión a store
