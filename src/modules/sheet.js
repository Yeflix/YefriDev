/* Hoja de detalle de proyecto (móvil): toca la tarjeta compacta → se abre desde abajo con toda la info. */
import { PROJECTS, STATUS } from '../data/projects.js';
import { art } from './art.js';
import { icon } from './icons.js';
import { detailHTML, linkFor } from './render.js';

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initSheet(rail) {
  let el = null, opener = null;

  const build = () => {
    el = document.createElement('div');
    el.className = 'sheet';
    el.hidden = true;
    el.innerHTML = '<div class="sheet__bg" data-close></div><section class="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"><div class="sheet__grab" aria-hidden="true"></div><button type="button" class="sheet__x" data-close aria-label="Cerrar">×</button><div class="sheet__body"></div></section>';
    document.body.appendChild(el);
    el.addEventListener('click', (e) => e.target.closest('[data-close]') && close());
    addEventListener('keydown', (e) => e.key === 'Escape' && el && !el.hidden && close());
    // si se pasa a escritorio con la hoja abierta, se cierra
    matchMedia('(min-width: 761px)').addEventListener('change', (e) => e.matches && close());
  };

  function open(i, from) {
    const p = PROJECTS[i];
    if (!p) return;
    if (!el) build();
    const { href, label } = linkFor(p);
    el.className = `sheet accent-${p.accent}`;
    el.querySelector('.sheet__body').innerHTML = `
      <div class="art" role="presentation">${art(p.visual)}</div>
      <div class="sheet__meta"><span class="badge badge--${p.status}">${STATUS[p.status] ?? p.status}</span>${p.featured ? '<span class="star">★ Favorito</span>' : ''}</div>
      <div class="card__cat">${esc(p.category)}</div>
      <h3 class="sheet__title" id="sheetTitle">${esc(p.name)}</h3>
      ${p.rel ? `<span class="rel">${icon('link')}${esc(p.rel)}</span>` : ''}
      <p class="sheet__desc">${esc(p.description)}</p>
      ${detailHTML(p)}
      <a class="btn btn--primary sheet__go" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label} ${icon('arrow')}</a>`;
    opener = from;
    el.hidden = false;
    document.documentElement.classList.add('sheet-open');
    requestAnimationFrame(() => el.classList.add('is-open'));
    el.querySelector('.sheet__panel').scrollTop = 0;
    el.querySelector('.sheet__x').focus({ preventScroll: true });
  }

  function close() {
    if (!el || el.hidden) return;
    el.classList.remove('is-open');
    document.documentElement.classList.remove('sheet-open');
    const done = () => { el.hidden = true; };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? done() : setTimeout(done, 320);
    opener?.focus({ preventScroll: true });
  }

  rail.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) open(+b.dataset.open, b);
  });
}
