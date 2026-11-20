# YefriDev — Portafolio

Portafolio de **Yefferson Hernandez (YefriDev)**: sitio estático con escena 3D (WebGL / Three.js) controlada por el scroll, modo claro/oscuro y contenido editable desde archivos de datos.

## Estructura

```
YefriDev/
├─ index.html              ← estructura de la página (hero, sobre mí, contacto…)
├─ assets/                 ← favicon e imágenes
├─ dist/                   ← ⚠ generado por `npm run build` (se sube al hosting)
│   ├─ main.css / main.js      UI (≈7 KB gzip)
│   └─ scene-entry.js          escena 3D, se carga en diferido (≈125 KB gzip)
└─ src/
   ├─ main.js              ← punto de entrada de la UI
   ├─ scene-entry.js       ← punto de entrada de la escena 3D
   ├─ data/                ← ✏️ AQUÍ se edita el contenido
   │   ├─ projects.js          proyectos (agregar/editar/ocultar)
   │   ├─ services.js          servicios
   │   └─ site.js              nombre, frases del hero, stats, enlaces, contacto
   ├─ modules/             ← comportamiento de la interfaz
   │   ├─ theme.js · nav.js · reveal.js · tilt.js · contact.js · render.js · icons.js · scene3d.js
   ├─ scene/               ← escena 3D (un archivo por "estación")
   │   ├─ engine.js            cámara, scroll, tema, calidad adaptativa
   │   ├─ lorenz.js · atom.js · lattice.js · dna.js · waves.js · stars.js · common.js
   └─ styles/              ← tokens.css (colores/tema) · base · layout · components · sections · responsive
```

## Uso

```bash
npm install        # una vez
npm run dev        # servidor local en http://localhost:5173 (recompila al guardar)
npm run build      # genera dist/ (minificado) — ejecútalo antes de subir cambios
```

> Si solo abres `index.html` con doble clic también funciona (los scripts no usan módulos ES), siempre que `dist/` exista.

## Agregar un proyecto

Edita `src/data/projects.js` y copia un bloque de `PROJECTS`:

```js
{
  name: 'Mi App',
  kind: 'mobile',          // mobile | bot | desktop | web | platform
  category: 'App móvil · Flutter',
  status: 'live',          // live | upgrading | dev
  accent: 'blue',          // red | blue
  icon: 'phone',           // ver src/modules/icons.js
  description: '…',
  highlights: ['logro 1', 'logro 2'],
  tech: ['Flutter', 'Firebase'],
  links: [{ label: 'Ver en GitHub', href: 'https://…' }],
},
```
Los filtros (Todos / Móvil / Bots…) se generan solos a partir de `kind`. Luego `npm run build`.

## Layout
Nav tipo píldora flotante (barra delgada con menú desplegable en móvil) · hero con franja de estadísticas · «Sobre mí» y «Servicios» en bento · «Proyectos» con dos vistas: **Explorador** (lista + ficha completa, escritorio ≥ 901 px, por defecto) y **Carrusel** coverflow; en móvil, tarjetas compactas (`summary` en `projects.js`) que abren una hoja de detalle · contacto en dos columnas. Puntos de quiebre en `src/styles/responsive.css`.

## Tema claro / oscuro
Variables en `src/styles/tokens.css` (`:root` y `:root[data-theme='light']`). Se respeta la preferencia del sistema, se puede cambiar con el botón ☀/☾ y se recuerda en `localStorage`. La escena 3D cambia de paleta y de modo de mezcla (aditivo en oscuro, normal en claro).
El modo claro («Aurora de día») usa un lienzo periwinkle `--bg`, tarjetas de cristal teñido y **paneles de tinta** (nav, estadísticas, lista del Explorador) que redefinen las variables en azul noche: para añadir otro panel oscuro, agrégalo al selector `:is(.hero__stats, .xp__list)` de `tokens.css`. Si cambias `--bg` claro, cambia también `PALETTES.light.bg` en `src/scene/common.js`.

## Escena 3D (cómo funciona)
- Cada `<section data-station>` corresponde, en orden, a una estación de `STATIONS` en `src/scene/engine.js`:
  **Hero → Atractor de Lorenz (cinta tubular + cometas) · Sobre mí → Átomo de Bohr · Servicios → Red cristalina NaCl · Proyectos → ADN · Contacto → Interferencia de ondas (malla).**
- Geometría sólida con iluminación PBR y reflejos de entorno. En **oscuro** se usa un look neón (emisivo + halos aditivos); en **claro**, materiales tipo cerámica con luces cálidas. Las paletas por tema están en `src/scene/common.js` (`PALETTES`).
- Las esferas/enlaces usan `InstancedMesh` (un solo draw call por tipo).
- La cámara vuela entre estaciones según el scroll (se detiene en cada sección). Las anclas se recalculan solas si cambia la altura de la página.
- Rendimiento: bundle separado y diferido · DPR limitado (1.5 móvil / 2 escritorio) · calidad adaptativa (baja la resolución si <40 fps) · menos partículas en móvil/equipos modestos · pausa con la pestaña oculta · botón 🧊 para desactivar el 3D (se recuerda) · `prefers-reduced-motion` → una imagen estática · sin WebGL → fondo degradado.

## Contacto
El formulario no tiene backend. Por defecto copia el mensaje y abre tu Telegram. Para envío real pon una URL (p. ej. Formspree) en `SITE.contact.endpoint` de `src/data/site.js`.

## Despliegue
`dist/` está incluido en el repo, así que **GitHub Pages** y **Vercel** funcionan sin paso de build (raíz del repo, sin framework). Si prefieres que Vercel compile, usa `npm run build` como Build Command.

## Enlaces de proyectos y redes (lo que tienes que pegar)

- **Proyectos** → `src/data/projects.js`, campo `url` de cada proyecto (GitHub, Telegram, Play…). Toda la tarjeta redirige a ese enlace;
  si `url` está vacío (`''`), enlaza a tu perfil de GitHub hasta que lo pongas. Tras editar: `npm run build`.
- **Redes y contacto** → `src/data/site.js`, bloque `links` (`instagram`, `facebook`, `email` con `mailto:`). Los que tengan `href` vacío no se muestran.
- **Layout de proyectos**: carrusel horizontal (`src/modules/rail.js` + estilos `.rail` en `components.css`): flechas, teclado ← →, arrastre con ratón, deslizar en móvil.
