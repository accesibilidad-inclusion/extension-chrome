# Extensión para navegador de PICTOS

# Descripción

La extensión para navegadores basados en Chromium de PICTOS permite integrar las ayudas de tareas web en el navegador.

Agrega un ícono de la extensión a la barra del navegador que indica cuando existen ayudas disponibles para el sitio que la persona está usando.

Puedes [conocer más sobre PICTOS](https://www.pictos.cl/) en su sitio web [https://www.pictos.cl/](https://www.pictos.cl/).

[Más información sobre la extensión en el sitio web de PICTOS](https://www.pictos.cl/que-es-pictos/pictos-en-tu-navegador/).

# Instalación en modo desarrollo

- Clona el repositorio [https://github.com/accesibilidad-inclusion/extension-chrome](https://github.com/accesibilidad-inclusion/extension-chrome) a una carpeta local.
- Cambia de branch.

En Chromium/Chrome, ingresa a `chrome://extensions/` y habilita el **Modo de desarrollador**.

Clickea el botón para **Cargar extensión sin empaquetar** y abre la carpeta donde clonaste el repo.

## Initialización del proyecto

```sh
npm install
```

### Type-Check y compila para produccion en la carpeta `dist`

```sh
npm run build
```

### Corre Unit Tests con [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint con [ESLint](https://eslint.org/)

```sh
npm run lint
```
