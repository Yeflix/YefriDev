/* Vista "Explorador" de proyectos (escritorio): lista a la izquierda, ficha completa a la derecha.
   Un solo proyecto a la vez → todo el detalle visible sin buscar entre tarjetas.
   La ficha entra con una transición de perspectiva. Convive con el carrusel (conmutador). */
import { PROJECTS, STATUS } from '../data/projects.js';
import { art } from './art.js';
import { icon } from './icons.js';
import { detailHTML, linkFor } from './render.js';

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad = (n) => String(n).padStart(2, '0');
const KEY = 'yd-pview';

export function initExplorer({ section, root, filterRoot }) {
  if (!root || !section) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 901px)');
  const toggle = document.getElementById('viewToggle');
  let stored = 'xp';
  try { stored = localStorage.getItem(KEY) || 'xp'; } catch {}

  root.innerHTML = `
    <div class="xp__list" role="tablist" aria-orientation="vertical" aria-label="Proyectos">
      ${PROJECTS.map(
        (p, i) => `<button type="button" role="tab" class="xp__item accent-${p.accent}" id="xpt${i}" data-i="${i}" data-kind="${p.kind}" data-tags="${(p.tags ?? []).join(' ')}" aria-selected="false" aria-controls="xpView" tabindex="-1">
          <span class="xp__n">${pad(i + 1)}</span>
          <span class="xp__ico" aria-hidden="true">${icon(p.icon)}</span>
          <span class="xp__t"><b>${esc(p.name)}</b><small>${esc(p.category)}</small></span>
          <span class="xp__st xp__st--${p.status}" title="${STATUS[p.status] ?? ''}"><i></i></span>
        </button>`,
      ).join('')}
    </div>
    <div class="xp__stage"><article class="xp__view" id="xpView" role="tabpanel" aria-live="polite"></article></div>`;

  const list = root.querySelector('.xp__list');
  const view = root.querySelector('.xp__view');
  const items = [...list.querySelectorAll('.xp__item')];
  let cur = -1;
  const visible = () => items.filter((b) => !b.hidden);

  function show(i, dir = 0) {
    const p = PROJECTS[i];
    if (!p) return;
    const { href, label } = linkFor(p);
    const vis = visible();
    const pos = vis.findIndex((b) => +b.dataset.i === i);
    items.forEach((b) => {
      const on = +b.dataset.i === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    view.setAttribute('aria-labelledby', 'xpt' + i);
    view.className = `xp__view accent-${p.accent}`;
    view.innerHTML = `
      <header class="xp__top">
        <div class="xp__meta"><span class="badge badge--${p.status}">${STATUS[p.status] ?? p.status}</span>${p.featured ? '<span class="star">★ Favorito</span>' : ''}</div>
        <div class="xp__nav" aria-label="Navegar proyectos">
          <span class="railctl__n">${pad(pos + 1)} / ${pad(vis.length)}</span>
          <button type="button" class="railbtn" data-step="-1" aria-label="Proyecto anterior" ${pos <= 0 ? 'disabled' : ''}>${icon('arrow')}</button>
          <button type="button" class="railbtn" data-step="1" aria-label="Proyecto siguiente" ${pos >= vis.length - 1 ? 'disabled' : ''}>${icon('arrow')}</button>
        </div>
      </header>
      <div class="xp__body">
        <div class="xp__l">
          <div class="art" role="presentation">${art(p.visual)}</div>
          <div class="card__cat">${esc(p.category)}</div>
          <h3 class="xp__name">${esc(p.name)}</h3>
          ${p.rel ? `<span class="rel">${icon('link')}${esc(p.rel)}</span>` : ''}
          <p class="xp__desc">${esc(p.description)}</p>
          <a class="btn btn--primary xp__go" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label} ${icon('arrow')}</a>
        </div>
        <div class="xp__r">${detailHTML(p)}</div>
      </div>`;
    if (!reduce && dir) {
      view.classList.remove('in-r', 'in-l');
      void view.offsetWidth;
      view.classList.add(dir > 0 ? 'in-r' : 'in-l');
    }
    const changed = cur !== i;
    cur = i;
    if (changed) window.dispatchEvent(new Event('yd:layout'));
  }

  const select = (i, focus) => {
    const dir = cur < 0 ? 0 : Math.sign(i - cur);
    show(i, dir);
    if (focus) items[i].focus({ preventScroll: true });
  };

  list.addEventListener('click', (e) => {
    const b = e.target.closest('.xp__item');
    if (b) select(+b.dataset.i);
  });
  list.addEventListener('keydown', (e) => {
    const vis = visible();
    const k = vis.indexOf(document.activeElement);
    if (k < 0) return;
    let n = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = vis[Math.min(vis.length - 1, k + 1)];
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = vis[Math.max(0, k - 1)];
    if (e.key === 'Home') n = vis[0];
    if (e.key === 'End') n = vis[vis.length - 1];
    if (n) { e.preventDefault(); select(+n.dataset.i, true); }
  });
  view.addEventListener('click', (e) => {
    const s = e.target.closest('[data-step]');
    if (!s) return;
    const vis = visible();
    const pos = vis.findIndex((b) => +b.dataset.i === cur);
    const n = vis[pos + +s.dataset.step];
    if (n) select(+n.dataset.i);
  });

  /* Filtros: los chips son los mismos del carrusel; render.js avisa con yd:filter */
  document.addEventListener('yd:filter', (e) => {
    const f = e.detail;
    items.forEach((b) => {
      const tags = (b.dataset.tags ?? '').split(' ');
      b.hidden = !(f === 'all' || b.dataset.kind === f || tags.includes(f));
    });
    const vis = visible();
    if (vis.length && !vis.some((b) => +b.dataset.i === cur)) select(+vis[0].dataset.i);
    else if (cur >= 0) show(cur);
  });

  /* Conmutador Explorador / Carrusel (en pantallas estrechas siempre carrusel) */
  const apply = () => {
    const v = wide.matches ? stored : 'rail';
    section.dataset.pview = v;
    toggle?.querySelectorAll('[data-view]').forEach((b) => {
      const on = b.dataset.view === v;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    window.dispatchEvent(new Event('yd:layout'));
    document.getElementById('projectsGrid')?.dispatchEvent(new Event('yd:rail'));
  };
  toggle?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    stored = b.dataset.view;
    try { localStorage.setItem(KEY, stored); } catch {}
    apply();
  });
  wide.addEventListener?.('change', apply);

  select(0);
  apply();
}
