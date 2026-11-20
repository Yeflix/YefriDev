import './styles/index.css';
import { SITE } from './data/site.js';
import { hydrateIcons } from './modules/icons.js';
import { renderServices, renderProjects, renderStats, renderContactLinks, renderFooterLinks } from './modules/render.js';
import { initTheme } from './modules/theme.js';
import { initNav } from './modules/nav.js';
import { initReveal, initCounters, initTyped } from './modules/reveal.js';
import { initTilt } from './modules/tilt.js';
import { initContact } from './modules/contact.js';
import { watchArt } from './modules/art.js';
import { initRail } from './modules/rail.js';
import { initExplorer } from './modules/explorer.js';
import { initSheet } from './modules/sheet.js';

const $ = (s) => document.querySelector(s);

/* Sobre mí (móvil): "Leer más" / "Ver todo" despliegan el resto del bloque */
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-more]');
  if (!b) return;
  const open = b.closest('.tile').classList.toggle('is-open');
  b.setAttribute('aria-expanded', String(open));
  b.textContent = open ? 'Ver menos' : b.dataset.moreLabel || 'Leer más';
  window.dispatchEvent(new Event('yd:layout'));
});

hydrateIcons();
renderStats($('#heroStats'));
renderServices($('#servicesGrid'));
renderProjects($('#projectsGrid'), $('#projectFilters'));
watchArt();
initRail();
initSheet($('#projectsGrid'));
initExplorer({ section: $('#projects'), root: $('#projectsXp'), filterRoot: $('#projectFilters') });
renderContactLinks($('#contactLinks'));
renderFooterLinks($('#footLinks'));
$('#year').textContent = new Date().getFullYear();

initTheme();
initNav();
initReveal();
initCounters();
initTyped($('#heroTag'), SITE.roles);
initTilt();
initContact($('#contactForm'));

/* Escena 3D: se descarga en diferido (≈125 KB gzip) cuando el navegador está libre */
const loadScene = () => {
  const s = document.createElement('script');
  s.src = 'dist/scene-entry.js';
  s.async = true;
  s.onerror = () => document.documentElement.classList.add('no-webgl');
  document.body.appendChild(s);
};
if (document.readyState === 'complete') setTimeout(loadScene, 0);
else addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(loadScene, { timeout: 1200 }) : setTimeout(loadScene, 200)));
