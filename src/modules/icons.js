/* Iconos SVG inline (trazo 1.75, estilo "line"). Uso: icon('globe') */
const P = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1.5M15 13v1.5M2 13v3M22 13v3"/><circle cx="12" cy="3.5" r="1"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.8"/><path d="M2.5 19h19"/>',
  rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2M14 5.5a8 8 0 0 1 6.5-2.5 8 8 0 0 1-2.5 6.5L13 14.5 9.5 11z"/><path d="M9.5 11H5.2l2-3.5H11M13 14.5v4.3l3.5-2V13"/><circle cx="15.5" cy="8.5" r="1.2"/>',
  coins: '<circle cx="9" cy="9" r="6"/><path d="M9.8 7.2c-.4-.5-1-.7-1.8-.7-1 0-1.6.5-1.6 1.2 0 1.8 3.6.9 3.6 2.7 0 .8-.8 1.3-1.8 1.3-.8 0-1.5-.3-1.9-.9M9 5.5v7"/><path d="M15.2 8.2A6 6 0 1 1 8.2 15.2"/>',
  hand: '<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v5.5m0-3a1.5 1.5 0 0 1 3 0V13m-9-1V8.5a1.5 1.5 0 0 0-3 0V14c0 4 2.5 7 6.5 7s6.5-2.5 6.5-6.5V10"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  telegram: '<path d="M21.5 3.5 2.8 10.7c-.8.3-.8 1.3 0 1.6l4.7 1.5 1.8 5.6c.2.6.9.8 1.4.4l2.6-2.2 4.6 3.4c.5.4 1.3.1 1.4-.6L22.7 4.8c.2-.9-.6-1.6-1.2-1.3zM7.5 13.8 18.6 7"/>',
  play: '<path d="M6 3.8v16.4a.8.8 0 0 0 1.2.7l13.5-8.2a.8.8 0 0 0 0-1.4L7.2 3.1A.8.8 0 0 0 6 3.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2z"/>',
  cube: '<path d="M12 2.5 3.5 7v10L12 21.5 20.5 17V7zM3.5 7 12 11.5 20.5 7M12 11.5v10"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
  atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3M7.5 15h9"/>',
  sigma: '<path d="M18 5H6l6.5 7L6 19h12"/>',
  dna: '<path d="M7 3c0 5.5 10 5.5 10 9s-10 3.5-10 9M17 3c0 5.5-10 5.5-10 9s10 3.5 10 9M9 7.5h6M9 16.5h6"/>',
  mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9"/>',
  facebook: '<path d="M14 21v-8h2.8l.5-3.3H14V7.6c0-1 .5-1.8 1.9-1.8h1.5V3.1A17 17 0 0 0 15 3c-2.4 0-4 1.5-4 4.1v2.6H8.3V13H11v8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
  orbit: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-30 12 12)"/><circle cx="19" cy="7.6" r="1.4"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
};

export function icon(name, cls = 'i') {
  const d = P[name] ?? P.cube;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
}

/** Reemplaza <i data-icon="nombre"> existentes en el HTML por el SVG */
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}
