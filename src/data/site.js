/* ═══════════════════════════════════════════════════
   Configuración general del sitio.
   Edita aquí textos, enlaces y estadísticas.
   ═══════════════════════════════════════════════════ */
export const SITE = {
  name: 'YefriDev',
  fullName: 'Yefferson Hernandez',
  since: 2022, // año en que empezó a programar → "años programando" se calcula solo

  /** Frases que rota el tag del hero */
  roles: [
    'Desarrollador Full-Stack',
    'Apps móviles · Flutter',
    'Bots & Automatización',
    'Ciencia + Código',
  ],

  /** Estadísticas del hero. `count` = número animado; `text` = valor fijo. */
  stats: [
    { key: 'years', label: 'Años programando', suffix: '+' },
    { key: 'projects', label: 'Proyectos', count: 22, suffix: '+' },
    { key: 'play', label: 'App en Google Play', count: 1 },
    { key: 'lines', label: 'Líneas de código', text: '∞' },
  ],

  /**
   * Redes y contacto. Pega tu enlace en `href` y aparece solo (si está vacío '', se oculta).
   *   instagram → https://instagram.com/tu_usuario
   *   facebook  → https://facebook.com/tu.perfil
   *   email     → mailto:tucorreo@ejemplo.com
   * `label` es el texto que se ve junto al icono.
   */
  links: {
    github: { label: 'github.com/Yeflix', href: 'https://github.com/Yeflix', icon: 'github' },
    telegram: { label: 't.me/YefriDev', href: 'https://t.me/YefriDev', icon: 'telegram' },
    instagram: { label: 'Instagram', href: '', icon: 'instagram' }, // ← pega aquí
    facebook: { label: 'Facebook', href: '', icon: 'facebook' }, // ← pega aquí
    email: { label: 'Correo', href: '', icon: 'mail' }, // ← pega aquí (mailto:...)
  },

  /**
   * Formulario de contacto.
   * - Si `endpoint` tiene una URL (p. ej. Formspree: https://formspree.io/f/xxxx),
   *   el mensaje se envía por POST (JSON).
   * - Si está vacío, el mensaje se copia al portapapeles y se abre tu Telegram.
   */
  contact: {
    endpoint: '',
    telegramUser: 'YefriDev',
  },
};
