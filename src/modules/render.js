import { icon } from './icons.js';
import { art } from './art.js';
import { PROJECTS, KINDS, STATUS, CTA_CARD } from '../data/projects.js';
import { SERVICES } from '../data/services.js';
import { SITE } from '../data/site.js';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ── Servicios ── */
export function renderServices(root) {
  root.innerHTML = SERVICES.map(
    (s, i) => `
    <div class="reveal" style="--i:${i}">
      <article class="card tilt accent-${s.accent}" data-tilt>
        <span class="card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="card__icon">${icon(s.icon)}</span>
        <div class="card__main">
          <h3 class="card__title">${esc(s.title)}</h3>
          <div class="card__more" id="srvMore${i}"><div class="card__more-in">
            <p class="card__desc">${esc(s.desc)}</p>
            <ul class="hashtags" aria-label="Tecnologías">${s.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div></div>
        </div>
        <button type="button" class="card__tg" aria-expanded="false" aria-controls="srvMore${i}" aria-label="Ver detalle: ${esc(s.title)}"></button>
      </article>
    </div>`,
  ).join('');

  /* Móvil: lista compacta tipo acordeón (una abierta a la vez). En escritorio el botón no se muestra. */
  const set = (card, open) => {
    card.classList.toggle('is-open', open);
    card.querySelector('.card__tg').setAttribute('aria-expanded', String(open));
  };
  root.addEventListener('click', (e) => {
    const tg = e.target.closest('.card__tg');
    if (!tg) return;
    const card = tg.closest('.card');
    const open = !card.classList.contains('is-open');
    root.querySelectorAll('.card.is-open').forEach((c) => set(c, false));
    set(card, open);
    window.dispatchEvent(new Event('yd:layout'));
  });
  if (matchMedia('(max-width: 760px)').matches) set(root.querySelector('.card'), true);
}

/* ── Proyectos ── */
const HOSTS = [
  [/play\.google\.com/, 'Ver en Google Play'],
  [/(^|\.)t\.me|telegram/, 'Abrir en Telegram'],
  [/github\.com/, 'Ver en GitHub'],
];
const hostLabel = (href) => (HOSTS.find(([re]) => re.test(href)) ?? [, 'Ver proyecto'])[1];

const inFilter = (p, f) => f === 'all' || p.kind === f || (p.tags ?? []).includes(f);

/** Enlace + etiqueta del botón de un proyecto (si no hay url propia → GitHub). */
export function linkFor(p) {
  return { href: p.url || SITE.links.github.href, label: p.url ? hostLabel(p.url) : 'Ver en GitHub' };
}

/** Bloques de detalle (qué hace / programas / tecnologías / nota). Los usan la tarjeta de escritorio y la hoja móvil. */
export function detailHTML(p) {
  const parts = p.parts?.length
    ? `<div class="pblock"><h4 class="plabel">Programas que lo usan</h4><ul class="pparts">${p.parts
        .map((x) => `<li><b>${esc(x.name)}</b><span>${esc(x.text)}</span></li>`)
        .join('')}</ul></div>`
    : '';
  const what = p.what?.length
    ? `<div class="pblock"><h4 class="plabel">Qué hace</h4><ul class="pwhat">${p.what.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>`
    : '';
  const note = p.note ? `<p class="pnote">${esc(p.note)}</p>` : '';
  const tech = `<div class="pblock"><h4 class="plabel">Tecnologías usadas</h4><ul class="ptech">${p.tech
    .map(
      (t) => `<li class="tcard"><span class="tcard__ico" aria-hidden="true">${esc(t.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2))}</span><span class="tcard__txt"><b>${esc(t.name)}</b><small>${esc(t.role)}</small></span></li>`,
    )
    .join('')}</ul></div>`;
  return what + parts + tech + note;
}

function projectCard(p, i) {
  const { href, label } = linkFor(p);
  const rel = p.rel ? `<span class="rel">${icon('link')}${esc(p.rel)}</span>` : '';
  const star = p.featured ? `<span class="star" title="Mi favorito">★ Favorito</span>` : '';
  return `
    <div class="proj" data-kind="${p.kind}" data-tags="${(p.tags ?? []).join(' ')}" style="--i:${i}">
      <div class="cf">
      <article class="card tilt accent-${p.accent}${p.featured ? ' is-featured' : ''}" data-tilt>
        <div class="card__l">
          <div class="art" role="presentation">${art(p.visual)}</div>
          <header class="card__head">
            <div class="card__meta">
              <span class="badge badge--${p.status}">${STATUS[p.status] ?? p.status}</span>${star}
            </div>
            <div class="card__cat">${esc(p.category)}</div>
            <h3 class="card__name"><a class="card__link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(p.name)}</a></h3>
            ${rel}
          </header>
          <p class="card__desc">${esc(p.description)}</p>
          <footer class="card__foot"><span class="plink">${label} ${icon('arrow')}</span></footer>
        </div>
        <div class="card__r">
          ${detailHTML(p)}
        </div>
      </article>
      </div>
      <button type="button" class="mcard accent-${p.accent}" data-open="${i}" aria-haspopup="dialog" aria-label="${esc(p.name)}: ver detalles">
        <span class="mcard__bar" aria-hidden="true"><i></i><i></i><i></i><em>${String(i + 1).padStart(2, '0')}</em></span>
        <span class="mcard__ico" aria-hidden="true">${icon(p.icon)}</span>
        <span class="mcard__cat">${esc(p.category)}</span>
        <span class="mcard__name">${esc(p.name)}${p.featured ? ' <span class="star-s" title="Favorito">★</span>' : ''}</span>
        <span class="mcard__sum">${esc(p.summary ?? '')}</span>
        <span class="mcard__foot"><span class="mcard__st mcard__st--${p.status}"><i></i>${STATUS[p.status] ?? p.status}</span><b>Ver detalles +</b></span>
      </button>
    </div>`;
}

function ctaCard(c, i) {
  return `
    <div class="proj proj--cta" data-kind="cta" style="--i:${i}">
      <div class="cf">
      <article class="card card--dashed">
        <div class="card__body card__body--cta">
          <span class="card__icon">${icon('rocket')}</span>
          <div class="card__cat">${esc(c.category)}</div>
          <h3 class="card__name">${esc(c.name)}</h3>
          <p class="card__desc">${esc(c.description)}</p>
          <a class="plink" href="${esc(c.link.href)}">${esc(c.link.label)} ${icon('arrow')}</a>
        </div>
      </article>
      </div>
    </div>`;
}

export function renderProjects(gridRoot, filterRoot) {
  const kinds = ['all', ...new Set(PROJECTS.flatMap((p) => [p.kind, ...(p.tags ?? [])]))].filter((k) => k in KINDS);

  filterRoot.innerHTML = kinds
    .map(
      (k, i) =>
        `<button type="button" class="fchip${i === 0 ? ' is-active' : ''}" data-filter="${k}" aria-pressed="${i === 0}">${KINDS[k]}<span class="fchip__n">${String(PROJECTS.filter((p) => inFilter(p, k)).length).padStart(2, '0')}</span></button>`,
    )
    .join('');

  gridRoot.innerHTML =
    PROJECTS.map(projectCard).join('') + (CTA_CARD ? ctaCard(CTA_CARD, PROJECTS.length) : '');

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const f = btn.dataset.filter;
    filterRoot.querySelectorAll('.fchip').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    let n = 0;
    gridRoot.querySelectorAll('.proj').forEach((el) => {
      const tags = (el.dataset.tags ?? '').split(' ');
      const show = f === 'all' || el.dataset.kind === f || tags.includes(f) || el.dataset.kind === 'cta';
      el.hidden = !show;
      if (show) {
        el.style.setProperty('--i', n++);
        el.classList.remove('is-in');
        void el.offsetWidth; // reinicia la animación de entrada
        el.classList.add('is-in');
      }
    });
    gridRoot.scrollTo({ left: 0 });
    document.dispatchEvent(new CustomEvent('yd:filter', { detail: f }));
    gridRoot.dispatchEvent(new Event('yd:rail'));
    window.dispatchEvent(new Event('yd:layout')); // la escena 3D recalcula estaciones
  });
}

/* ── Stats del hero ── */
export function renderStats(root) {
  const years = new Date().getFullYear() - SITE.since;
  root.innerHTML = SITE.stats
    .map((s) => {
      const val = s.key === 'years' ? years : s.count;
      const inner =
        val !== undefined
          ? `<span data-count="${val}" data-suffix="${s.suffix ?? ''}">0${s.suffix ?? ''}</span>`
          : esc(s.text);
      return `<div class="stat"><div class="stat__num">${inner}</div><div class="stat__label">${esc(s.label)}</div></div>`;
    })
    .join('');
}

/* ── Enlaces de contacto ── */
export function renderContactLinks(root) {
  // Solo se muestran los enlaces que ya tienen href (los vacíos se ocultan hasta que los pegues en site.js)
  root.innerHTML = Object.values(SITE.links)
    .filter((l) => l.href)
    .map((l) => {
      const ext = /^https?:/.test(l.href);
      return `<a class="clink" href="${esc(l.href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="clink__i">${icon(l.icon)}</span><span>${esc(l.label)}</span></a>`;
    })
    .join('');
}

/* ── Iconos de redes en el pie ── */
export function renderFooterLinks(root) {
  if (!root) return;
  root.innerHTML = Object.values(SITE.links)
    .filter((l) => l.href)
    .map((l) => {
      const ext = /^https?:/.test(l.href);
      return `<a href="${esc(l.href)}" aria-label="${esc(l.label)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${icon(l.icon)}</a>`;
    })
    .join('');
}
