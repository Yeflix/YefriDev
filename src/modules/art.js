/* ═══════════════════════════════════════════════════
   Ilustraciones animadas de cada proyecto (SVG + CSS, sin imágenes).
   Usan los colores del tema (var(--ac-red) / var(--ac-blue)), así
   se ven bien en modo claro y oscuro. Se pausan fuera de pantalla.
   ═══════════════════════════════════════════════════ */

const open = (label) =>
  `<svg class="art-svg" viewBox="0 0 220 130" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">`;

/** Curva de Lissajous x=sin(a·t), y=sin(b·t) como path SVG */
function lissajous(cx, cy, rx, ry, a, b, n = 90) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    d += (i ? 'L' : 'M') + (cx + rx * Math.sin(a * t + 0.6)).toFixed(1) + ' ' + (cy + ry * Math.sin(b * t)).toFixed(1);
  }
  return d + 'Z';
}

const bars = (n, x0, gap, w, baseY, h, cls) =>
  Array.from({ length: n }, (_, i) => {
    const hh = h * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.7)));
    return `<rect class="${cls} eq" style="--d:${(i * 0.11).toFixed(2)}s" x="${x0 + i * gap}" y="${baseY - hh}" width="${w}" height="${hh.toFixed(1)}" rx="${w / 2}"/>`;
  }).join('');

export const ART = {
  /* Dolargo: celular con precios, gráfica y monedas flotando */
  dolargo: () => `${open('Celular mostrando el precio del dólar y el euro con una gráfica')}
    <rect class="l-m p-s" x="76" y="6" width="68" height="118" rx="11"/>
    <rect class="p-r" opacity=".14" x="84" y="18" width="52" height="19" rx="5"/>
    <text class="t" x="89" y="31">$ BCV</text>
    <text class="t pulse" x="112" y="31">36,4</text>
    <rect class="p-b" opacity=".14" x="84" y="42" width="52" height="19" rx="5"/>
    <text class="t" x="89" y="55">€ BCV</text>
    <text class="t pulse" style="--d:.5s" x="112" y="55">39,1</text>
    <path class="l-r draw" pathLength="1" d="M84 100 L94 90 L103 95 L113 80 L122 84 L136 68"/>
    <circle class="p-r blip" cx="136" cy="68" r="2.6"/>
    <g class="float" style="--d:0s"><circle class="l-r p-s" cx="38" cy="38" r="15"/><text class="t big" x="33" y="44">$</text></g>
    <g class="float" style="--d:1.2s"><circle class="l-b p-s" cx="186" cy="52" r="15"/><text class="t big" x="181" y="58">€</text></g>
    <g class="float" style="--d:2.2s"><circle class="l-m p-s" cx="44" cy="92" r="12"/><text class="t" x="40" y="96">₮</text></g>
  </svg>`,

  /* Bot: chat con enlace → archivo que llega con barra de progreso */
  bot: () => `${open('Chat de Telegram: se envía un enlace y el bot devuelve un video')}
    <g class="bub1"><rect class="l-b p-s" x="14" y="12" width="104" height="26" rx="9"/>
      <text class="t" x="24" y="29">youtu.be/…</text></g>
    <g class="bub2"><rect class="l-r p-s" x="64" y="52" width="142" height="62" rx="10"/>
      <rect class="p-r" opacity=".18" x="74" y="62" width="50" height="34" rx="6"/>
      <path class="p-r" d="M93 73 L93 88 L106 80.5Z"/>
      <text class="t" x="132" y="74">video.mp4</text>
      <rect class="p-m" opacity=".25" x="132" y="84" width="64" height="5" rx="2.5"/>
      <rect class="p-r fill" x="132" y="84" width="64" height="5" rx="2.5"/>
      <text class="t sm" x="74" y="107">✓ Listo para guardar</text></g>
    <g class="dots3"><circle class="p-m" cx="150" cy="25" r="2.4"/><circle class="p-m" style="--d:.2s" cx="159" cy="25" r="2.4"/><circle class="p-m" style="--d:.4s" cx="168" cy="25" r="2.4"/></g>
  </svg>`,

  /* Rebecca: micrófono + onda de voz + figura de Lissajous */
  rebecca: () => `${open('Micrófono, onda de voz y osciloscopio de Lissajous')}
    <rect class="l-r p-s" x="26" y="14" width="26" height="44" rx="13"/>
    <path class="l-r" d="M17 44a22 22 0 0 0 44 0M39.5 66v14M30 80h19"/>
    <circle class="l-r ring" cx="39.5" cy="36" r="30"/>
    <g>${bars(15, 18, 7.5, 4, 112, 34, 'p-b')}</g>
    <circle class="l-m p-s" cx="160" cy="50" r="46"/>
    <path class="l-m" opacity=".4" d="M114 50h92M160 4v92"/>
    <path class="l-r draw loop" pathLength="1" d="${lissajous(160, 50, 38, 34, 3, 2)}"/>
  </svg>`,

  /* Visión Computacional: mano detectada por la cámara → laberinto inclinado con bola */
  vision: () => `${open('Una mano detectada por la webcam controla un laberinto 3D')}
    <path class="l-m" d="M12 30V14h16M92 14h16v16M12 100v16h16M108 100v16H92" transform="translate(0,-4)"/>
    <g class="hand" style="transform-origin:60px 86px">
      <path class="l-b" d="M60 86 L34 62M60 86 L46 38M60 86 L62 28M60 86 L77 36M60 86 L88 56"/>
      <g class="p-b"><circle cx="34" cy="62" r="3.2"/><circle cx="46" cy="38" r="3.2"/><circle cx="62" cy="28" r="3.2"/><circle cx="77" cy="36" r="3.2"/><circle cx="88" cy="56" r="3.2"/></g>
      <circle class="l-b p-s" cx="60" cy="86" r="9"/>
    </g>
    <g class="tilt3d">
      <path class="l-r p-s" d="M126 44 L206 30 L206 100 L126 114Z"/>
      <path class="l-m" d="M142 52V100M158 49V106M174 46V108M190 40V104M132 72L206 60M132 90L206 80" opacity=".6"/>
      <circle class="p-r ball" cx="136" cy="62" r="5"/>
    </g>
  </svg>`,

  /* SPECTRUM: panel flotante con búsqueda y apps */
  spectrum: () => `${open('Lanzador flotante con búsqueda de aplicaciones')}
    <rect class="l-r p-s" x="28" y="10" width="164" height="110" rx="14"/>
    <rect class="l-m" x="40" y="22" width="140" height="22" rx="11"/>
    <circle class="l-m" cx="54" cy="33" r="4.5"/><path class="l-m" d="M58 37l4 4"/>
    <text class="t type" x="70" y="37"><tspan class="k1">v</tspan><tspan class="k2">s</tspan><tspan class="k3">c</tspan></text>
    <rect class="p-r caret" x="92" y="27" width="1.6" height="12"/>
    <g>
      <rect class="p-r hit" x="40" y="54" width="30" height="30" rx="8"/>
      <rect class="l-b" x="78" y="54" width="30" height="30" rx="8"/>
      <rect class="l-m" x="116" y="54" width="30" height="30" rx="8"/>
      <rect class="l-m" x="154" y="54" width="26" height="30" rx="8"/>
      <rect class="l-m" x="40" y="90" width="30" height="22" rx="8" opacity=".6"/>
      <rect class="l-m" x="78" y="90" width="30" height="22" rx="8" opacity=".6"/>
      <text class="t sm" x="46" y="73" style="fill:#fff">VS</text>
    </g>
  </svg>`,

  /* Switch: carátula girando, estrellas y ecualizador */
  switch: () => `${open('Disco girando con estrellas y ecualizador de música')}
    <g class="stars">
      <circle class="p-b tw" cx="22" cy="20" r="1.8"/><circle class="p-r tw" style="--d:.7s" cx="60" cy="12" r="1.4"/>
      <circle class="p-b tw" style="--d:1.4s" cx="30" cy="104" r="1.6"/><circle class="p-r tw" style="--d:.3s" cx="196" cy="18" r="1.8"/>
      <circle class="p-b tw" style="--d:1s" cx="204" cy="70" r="1.4"/><circle class="p-r tw" style="--d:1.8s" cx="14" cy="64" r="1.5"/>
    </g>
    <g class="spin" style="transform-origin:96px 65px">
      <circle class="l-r p-s" cx="96" cy="65" r="46"/>
      <circle class="l-m" cx="96" cy="65" r="34" opacity=".5"/><circle class="l-m" cx="96" cy="65" r="22" opacity=".5"/>
      <path class="p-r" opacity=".85" d="M96 65 L96 19 A46 46 0 0 1 130 33.5Z"/>
      <path class="p-b" opacity=".85" d="M96 65 L96 111 A46 46 0 0 1 62 96.5Z"/>
      <circle class="p-s l-r" cx="96" cy="65" r="8"/>
    </g>
    <g>${bars(7, 158, 9, 5, 100, 56, 'p-b')}</g>
  </svg>`,

  /* Proyectos personales: ventana de navegador con código, calculadora */
  web: () => `${open('Ventana de navegador con código escribiéndose y una calculadora')}
    <rect class="l-m p-s" x="14" y="10" width="192" height="110" rx="10"/>
    <path class="l-m" d="M14 30H206"/>
    <circle class="p-r" cx="26" cy="20" r="3"/><circle class="p-m" cx="37" cy="20" r="3"/><circle class="p-b" cx="48" cy="20" r="3"/>
    <g>
      <rect class="p-b line" style="--d:0s;--w:1" x="26" y="42" width="70" height="5" rx="2.5"/>
      <rect class="p-r line" style="--d:.4s" x="34" y="54" width="52" height="5" rx="2.5"/>
      <rect class="p-m line" style="--d:.8s" x="34" y="66" width="62" height="5" rx="2.5"/>
      <rect class="p-b line" style="--d:1.2s" x="26" y="78" width="40" height="5" rx="2.5"/>
      <rect class="p-r line" style="--d:1.6s" x="26" y="90" width="58" height="5" rx="2.5"/>
    </g>
    <g class="calc">
      <rect class="l-r" x="118" y="40" width="76" height="14" rx="4"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => `<rect class="key" style="--d:${(i * 0.25).toFixed(2)}s" x="${118 + (i % 4) * 20}" y="${60 + Math.floor(i / 4) * 25}" width="16" height="20" rx="4"/>`)
        .join('')}
    </g>
  </svg>`,

  /* YefriBooks: libro abierto con página que se voltea y barra de lectura */
  book: () => `${open('Libro abierto con una página pasando y barra de progreso de lectura')}
    <path class="l-b p-s" d="M110 22 C90 14 60 14 34 22 V92 C60 84 90 84 110 92Z"/>
    <path class="l-r p-s" d="M110 22 C130 14 160 14 186 22 V92 C160 84 130 84 110 92Z"/>
    <path class="l-m" opacity=".6" d="M46 36c18-4 40-4 54 2M46 48c18-4 40-4 54 2M46 60c18-4 40-4 54 2M122 38c14-6 36-6 54-2M122 50c14-6 36-6 54-2M122 62c14-6 36-6 54-2"/>
    <g class="flip" style="transform-origin:110px 57px">
      <path class="l-r p-s" d="M110 22 C130 14 160 14 186 22 V92 C160 84 130 84 110 92Z"/>
    </g>
    <rect class="p-m" opacity=".25" x="48" y="108" width="124" height="6" rx="3"/>
    <rect class="p-r fill" x="48" y="108" width="124" height="6" rx="3"/>
  </svg>`,
  /* YefriPlayer: ventana con vinilo, progreso, ecualizador y panel lateral */
  player: () => `${open('Ventana del reproductor con vinilo girando, barra de progreso y ecualizador')}
    <rect class="l-r p-s" x="16" y="12" width="168" height="92" rx="12"/>
    <g class="spin" style="transform-origin:62px 58px">
      <circle class="l-r p-s" cx="62" cy="58" r="30"/>
      <circle class="l-m" cx="62" cy="58" r="21" opacity=".5"/><circle class="l-m" cx="62" cy="58" r="12" opacity=".5"/>
      <path class="p-r" opacity=".85" d="M62 58 L62 28 A30 30 0 0 1 86 40Z"/>
      <circle class="p-s l-r" cx="62" cy="58" r="5"/>
    </g>
    <rect class="p-m" opacity=".5" x="106" y="28" width="62" height="6" rx="3"/>
    <rect class="p-m" opacity=".25" x="106" y="40" width="42" height="5" rx="2.5"/>
    <g>${bars(8, 106, 8, 5, 82, 28, 'p-b')}</g>
    <rect class="p-m" opacity=".25" x="28" y="94" width="144" height="4" rx="2"/>
    <rect class="p-r fill" x="28" y="94" width="144" height="4" rx="2"/>
    <g class="dockwave"><path class="l-b" d="M196 44a14 14 0 0 1 0 28M203 36a24 24 0 0 1 0 44"/></g>
    <rect class="l-b p-s" x="186" y="48" width="12" height="20" rx="4"/>
  </svg>`,

  /* Astro: cielo con constelación que se traza y órbitas */
  astro: () => `${open('Cielo estrellado con una constelación trazándose y planetas en órbita')}
    <path class="l-m" d="M8 112 Q110 88 212 112" opacity=".7"/>
    <g>
      <circle class="p-b tw" cx="20" cy="22" r="1.5"/><circle class="p-r tw" style="--d:.6s" cx="48" cy="44" r="1.3"/>
      <circle class="p-b tw" style="--d:1.2s" cx="30" cy="70" r="1.4"/><circle class="p-r tw" style="--d:1.8s" cx="198" cy="26" r="1.5"/>
      <circle class="p-b tw" style="--d:.9s" cx="206" cy="64" r="1.3"/><circle class="p-r tw" style="--d:.3s" cx="12" cy="96" r="1.2"/>
    </g>
    <path class="l-b draw loop" pathLength="1" d="M150 14 L170 30 L186 22 M170 30 L176 52 L158 62"/>
    <g class="p-b"><circle cx="150" cy="14" r="2.4"/><circle cx="170" cy="30" r="3"/><circle cx="186" cy="22" r="2.2"/><circle cx="176" cy="52" r="2.4"/><circle cx="158" cy="62" r="2.2"/></g>
    <ellipse class="l-m" cx="78" cy="66" rx="54" ry="22" opacity=".6"/>
    <ellipse class="l-m" cx="78" cy="66" rx="32" ry="13" opacity=".6"/>
    <circle class="p-r" cx="78" cy="66" r="7"/>
    <g class="spin" style="transform-origin:78px 66px"><circle class="p-b" cx="110" cy="66" r="3.6"/></g>
    <g class="spin slow" style="transform-origin:78px 66px"><circle class="p-r" cx="132" cy="66" r="4.6"/></g>
  </svg>`,
};

export const art = (key) => (ART[key] ? ART[key]() : '');

/** Pausa las animaciones de las ilustraciones que no están en pantalla (ahorra CPU/batería) */
export function watchArt(root = document) {
  const els = root.querySelectorAll('.art');
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)),
    { rootMargin: '80px' },
  );
  els.forEach((e) => { e.classList.add('is-off'); io.observe(e); });
}
