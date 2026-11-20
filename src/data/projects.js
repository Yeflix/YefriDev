/* ═══════════════════════════════════════════════════
   PROYECTOS — para agregar uno nuevo, copia un bloque.

   url      : ⬅ AQUÍ VA EL ENLACE DE CADA PROYECTO. Toda la tarjeta redirige a él.
              (GitHub, Telegram, Google Play…). Si lo dejas vacío '', la tarjeta
              enlaza a tu perfil de GitHub (SITE.links.github) hasta que lo pongas.
   kind     : 'mobile' | 'bot' | 'desktop' | 'theme' | 'science'
   tags     : filtros extra, p. ej. ['rebecca'] = parte del ecosistema Rebecca
   status   : 'live' | 'done' | 'upgrading' | 'dev'
   accent   : 'red' | 'blue'
   icon     : nombre de icono (src/modules/icons.js)
   visual   : ilustración animada (src/modules/art.js)
   rel      : etiqueta de relación (opcional), p. ej. "Complemento de Rebecca"
   featured : true → sello ★ (tu favorito)
   summary  : 1 frase corta; es el texto de la tarjeta compacta en móvil
   what     : 2-4 frases cortas, lenguaje simple (qué hace por ti)
   parts    : [{ name, text }] programas que forman parte del proyecto
   tech     : [{ name, role }] cada tecnología con su función en el proyecto
   note     : aclaración opcional
   ═══════════════════════════════════════════════════ */
export const KINDS = {
  all: 'Todos',
  mobile: 'Móvil',
  bot: 'Bots',
  desktop: 'Escritorio',
  theme: 'Temas',
  science: 'Ciencia',
  rebecca: 'Ecosistema Rebecca',
};

export const STATUS = {
  live: 'Activo',
  done: 'Terminado',
  upgrading: 'Terminado · mejorando',
  dev: 'En desarrollo',
};

export const PROJECTS = [
  {
    name: 'Dolargo',
    kind: 'mobile',
    category: 'App móvil · Google Play',
    summary: 'Consulta el dólar y el euro oficiales (BCV) y el USDT de Binance P2P, directo en tu celular.',
    status: 'live',
    accent: 'red',
    icon: 'coins',
    visual: 'dolargo',
    url: 'https://play.google.com/store/apps/details?id=com.yefridev.dolargo',
    description:
      'Una app para el celular que te dice, de un vistazo, cuánto vale el dólar y el euro en Venezuela: el precio oficial del Banco Central y el del mercado entre personas (USDT en Binance).',
    what: [
      'Precios al día, sin tener que buscarlos en varias páginas',
      'Conversor y calculadora para no hacer cuentas a mano',
      'Widgets en la pantalla de inicio y avisos cuando el precio cambia',
      'Letra grande y botones claros: pensada para cualquier edad',
    ],
    tech: [
      { name: 'Flutter', role: 'Crea la app una sola vez y se ve fluida en el celular' },
      { name: 'Dart', role: 'El lenguaje de programación en el que está escrita' },
      { name: 'Firebase', role: 'Envía los avisos y guarda datos en la nube' },
      { name: 'Kotlin', role: 'Código propio de Android para los widgets' },
      { name: 'Workmanager', role: 'Actualiza los precios en segundo plano, con la app cerrada' },
      { name: 'Google Play', role: 'Donde se descarga y recibe las actualizaciones' },
    ],
  },
  {
    name: 'Bot de descarga de videos',
    kind: 'bot',
    tags: ['rebecca'],
    category: 'Bot · Telegram',
    summary: 'Pega un enlace en Telegram y el bot te devuelve el video o la música.',
    status: 'live',
    accent: 'blue',
    icon: 'bot',
    visual: 'bot',
    rel: 'Complemento de Rebecca',
    url: 'https://t.me/MusicTubeBot_Bot',
    description:
      'Pegas el enlace de un video o una canción en Telegram y el bot te lo devuelve como archivo, listo para guardar en tu teléfono.',
    what: [
      'Funciona con YouTube, Instagram, TikTok, X y otras redes',
      'Eliges video (MP4) o solo el audio (MP3)',
      'Si el archivo pesa mucho, te lo entrega por Google Drive',
      'Si un método falla, prueba otro automáticamente',
    ],
    tech: [
      { name: 'Python', role: 'El lenguaje en el que está hecho el bot' },
      { name: 'yt-dlp', role: 'El motor que encuentra y descarga el video' },
      { name: 'FFmpeg', role: 'Convierte formatos y extrae el audio' },
      { name: 'Playwright', role: 'Navegador automático de respaldo para sitios difíciles' },
      { name: 'Telegram Bot API', role: 'El chat por el que hablas con el bot' },
      { name: 'Google Drive', role: 'Entrega los archivos que no caben en Telegram' },
    ],
    note: 'Está activo, pero el servidor es mi propia laptop: puede estar apagado a ratos.',
  },
  {
    name: 'Rebecca',
    kind: 'desktop',
    tags: ['rebecca'],
    category: 'Asistente de voz · Windows',
    summary: 'Asistente de voz para Windows: le hablas, te entiende y te responde, sin depender de internet.',
    status: 'dev',
    accent: 'red',
    icon: 'mic',
    visual: 'rebecca',
    rel: 'Núcleo del ecosistema',
    url: '', // ← pega aquí el enlace (GitHub)
    description:
      'Una asistente que controlas con la voz en tu computadora. Dices su nombre y le pides abrir programas, poner una alarma, buscar un archivo o tomar una captura. Ya funciona, y sigue creciendo.',
    what: [
      'Entiende lo que dices y lo básico funciona sin internet',
      'Pide confirmación antes de borrar algo y nunca envía mensajes por ti',
      'Su pantalla muestra tu voz como un instrumento científico',
      'Tiene complementos propios: SPECTRUM, el bot de descargas, YefriPlayer y Switch',
    ],
    tech: [
      { name: 'Python', role: 'El lenguaje que une todas las piezas' },
      { name: 'PyQt6', role: 'Dibuja la ventana y la interfaz' },
      { name: 'Faster-Whisper', role: 'Convierte tu voz en texto, dentro de tu PC' },
      { name: 'Vosk', role: 'Detecta cuándo dices su nombre para despertarla' },
      { name: 'Edge-TTS', role: 'Le da voz para responderte' },
      { name: 'Gemini', role: 'IA opcional para pedidos más complejos' },
    ],
  },
  {
    name: 'Visión Computacional',
    kind: 'desktop',
    category: 'Motor de seguimiento de manos',
    summary: 'Convierte tu mano en un mouse usando solo la cámara web. Base de un juego y un programa de dibujo.',
    status: 'upgrading',
    accent: 'blue',
    icon: 'hand',
    visual: 'vision',
    url: '', // ← pega aquí el enlace (GitHub)
    description:
      'El motor que hace que la computadora vea tu mano. Con una cámara común sigue tus dedos en tiempo real y convierte tus gestos (pellizcar, cerrar el puño, señalar) en órdenes. De él nacen mis programas controlados con la mano.',
    parts: [
      {
        name: 'Juego de mesa + corta frutas',
        text: 'Inclinas un laberinto 3D con la mano o cortas frutas en el aire. Expuesto en el Encuentro con la Física, Química, Matemáticas y Biología 2025 y 2026 (ediciones XV y XVI), por el área de Matemáticas.',
      },
      {
        name: 'Modo Canvas',
        text: 'Dibujas en el aire: pellizcas para pintar. 14 pinceles, figuras que se corrigen solas, zoom, selección y 6 fondos.',
      },
    ],
    what: [
      'Funciona con una webcam normal, sin sensores especiales',
      'Quita el temblor de la mano y adivina hacia dónde va, para que todo se sienta inmediato',
      'Si no hay cámara, también se puede usar con el ratón',
    ],
    tech: [
      { name: 'Python', role: 'El motor: lee la cámara y entiende la mano' },
      { name: 'MediaPipe', role: 'Reconoce la mano y los 21 puntos de los dedos' },
      { name: 'OpenCV', role: 'Lee y mejora la imagen de la webcam' },
      { name: 'Filtros One Euro y Kalman', role: 'Matemática que quita el temblor y predice el movimiento' },
      { name: 'Unity · C#', role: 'Dibuja el Modo Canvas y las versiones nuevas de los juegos' },
      { name: 'Panda3D', role: 'El motor 3D de la primera versión del juego' },
      { name: 'UDP local', role: 'Canal rápido por el que Python y Unity se hablan' },
      { name: 'NumPy', role: 'Cálculo matemático rápido' },
    ],
    note: 'Terminado, y sigo desarrollando mejoras.',
  },
  {
    name: 'SPECTRUM Launcher',
    kind: 'desktop',
    tags: ['rebecca'],
    category: 'Lanzador de apps · Windows',
    summary: 'Lanzador flotante para abrir tus apps y juegos al instante con un atajo.',
    status: 'done',
    accent: 'red',
    icon: 'grid',
    visual: 'spectrum',
    rel: 'Complemento de Rebecca',
    url: '', // ← pega aquí el enlace (GitHub)
    description:
      'Un buscador flotante para abrir cualquier programa o juego al instante: pulsas un atajo, escribes unas letras y Enter. Encuentra solo tus apps instaladas.',
    what: [
      'Entiende siglas y errores: escribir “vsc” abre Visual Studio Code',
      'Favoritas y categorías para ordenar tus apps',
      'Todo queda en tu PC, sin internet ni cuentas',
    ],
    tech: [
      { name: 'Python', role: 'El lenguaje que hace la lógica y la búsqueda' },
      { name: 'PySide6', role: 'Crea la ventana flotante y translúcida' },
      { name: 'Qt 6', role: 'La base gráfica: animaciones suaves y atajos globales' },
    ],
  },
  {
    name: 'Switch',
    kind: 'theme',
    tags: ['rebecca'],
    category: 'Tema · Spicetify para Spotify',
    summary: 'Tema para Spotify que cambia su aspecto completo con un solo clic.',
    status: 'done',
    accent: 'blue',
    icon: 'music',
    visual: 'switch',
    rel: 'Independiente · se integra con Rebecca',
    url: '', // ← pega aquí el enlace (GitHub)
    description:
      'Un cambio de look para Spotify en la computadora. Eliges entre tres estilos: cielo estrellado, la carátula del álbum como fondo, o uno futurista que late con la música.',
    what: [
      'Tres estilos intercambiables con un panel para ajustarlos',
      'Los fondos reaccionan a la canción que suena',
      'Ligero: no hace más lento a Spotify',
      'Funciona solo, pero también se conecta con Rebecca y YefriPlayer',
    ],
    tech: [
      { name: 'Spicetify', role: 'Herramienta que permite personalizar Spotify' },
      { name: 'JavaScript', role: 'La lógica y las animaciones del tema' },
      { name: 'CSS', role: 'Los colores, formas y efectos visuales' },
    ],
  },
  {
    name: 'YefriPlayer',
    kind: 'desktop',
    tags: ['rebecca'],
    category: 'Controlador multimedia · Windows',
    summary: 'Reproductor y controlador multimedia para Windows: el más completo y mi favorito.',
    status: 'done',
    accent: 'red',
    icon: 'music',
    visual: 'player',
    featured: true,
    rel: 'Nació de los complementos de Rebecca',
    url: 'https://github.com/Yeflix/yefriplayer',
    description:
      'Una sola ventana para ver y manejar lo que suena en tu navegador y en apps como Spotify: carátula, letra, visualizador y teclas rápidas. No reproduce música; la acompaña. Mi proyecto más completo y mi favorito.',
    what: [
      'Letras sincronizadas y un visualizador que reacciona al sonido real',
      'Tres formas de verlo: ventana completa, barra compacta o panel lateral',
      'Historial, estadísticas y envío a Last.fm, todo guardado en tu equipo',
      'Se instala en un clic, sin permisos de administrador',
    ],
    tech: [
      { name: 'Python', role: 'El lenguaje en el que está hecho' },
      { name: 'PyQt6', role: 'Dibuja las tres ventanas y la escena 3D' },
      { name: 'WebNowPlaying', role: 'Extensión que le avisa qué suena en el navegador' },
      { name: 'winsdk', role: 'Lee los controles multimedia que ya trae Windows' },
      { name: 'NumPy + PyAudioWPatch', role: 'Capturan y analizan el sonido para el visualizador' },
      { name: 'Nuitka', role: 'Convierte el programa en un instalador .exe' },
      { name: 'lrclib', role: 'Servicio gratuito de letras de canciones' },
    ],
    note: 'Versión 1.5.6 · Windows 10 y 11. Funciona solo o junto a Rebecca.',
  },
  {
    name: 'Astro',
    kind: 'science',
    category: 'Astronomía de precisión · Ciencia',
    summary: 'Calcula posiciones de planetas y estrellas con precisión astronómica.',
    status: 'dev',
    accent: 'blue',
    icon: 'orbit',
    visual: 'astro',
    url: '', // ← pega aquí el enlace (GitHub)
    description:
      'Un laboratorio de astronomía: calcula dónde están el Sol, la Luna, los planetas, asteroides y cometas, y dibuja el cielo tal como lo vería alguien en cualquier punto de la Tierra. Sus resultados se comparan con los de la NASA.',
    what: [
      'Mapa estelar con más de 100 000 estrellas, constelaciones y objetos del cielo profundo',
      'Sistema solar y Tierra en 3D, y una vista desde el suelo con el relieve real del horizonte',
      'Coincide con la NASA (JPL Horizons) con errores de milésimas de segundo de arco',
      'Próximo paso: una app móvil que lo muestre',
    ],
    tech: [
      { name: 'Python', role: 'Hace todo el cálculo físico y matemático' },
      { name: 'Skyfield', role: 'Calcula posiciones de astros con las efemérides de la NASA' },
      { name: 'Astropy', role: 'Cambios de coordenadas y escalas de tiempo' },
      { name: 'FastAPI', role: 'Servidor que entrega los datos a las pantallas' },
      { name: 'JPL Horizons', role: 'La referencia de la NASA contra la que se mide la precisión' },
      { name: 'JavaScript · Canvas', role: 'El visor web: mapa estelar, sistema solar y Tierra 3D' },
      { name: 'Flutter', role: 'La app móvil (siguiente etapa)' },
    ],
  },
];

/* Proyectos que no están en la lista pública por ahora (se conservan por si los quieres volver a mostrar) */
export const PROJECTS_HIDDEN = [
  {
    name: 'Proyectos Personales',
    description: 'Mis primeros proyectos web: un juego de mascotas (Mokepon), una calculadora y páginas para compañeros de clase.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    name: 'YefriBooks',
    description: 'Plataforma para organizar y leer libros desde el celular o el navegador.',
    tech: ['Flutter', 'Firebase'],
  },
];

/** Tarjeta final: invita a proponer una idea */
export const CTA_CARD = {
  category: 'Próximamente',
  name: '[ Tu Proyecto ]',
  description:
    '¿Tienes una idea? Podría estar aquí. Hablemos y construyamos algo extraordinario juntos desde cero.',
  link: { label: 'Proponer idea', href: '#contact' },
};
