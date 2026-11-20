import { store } from './storage.js';

const KEY = 'yd-theme';
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;

export const getTheme = () => (root.dataset.theme === 'light' ? 'light' : 'dark');

function apply(theme, persist) {
  root.dataset.theme = theme;
  if (persist) store.set(KEY, theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#c3ccee' : '#04040a');
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(theme === 'dark'));
    b.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    b.title = b.getAttribute('aria-label');
  });
  window.dispatchEvent(new CustomEvent('yd:theme', { detail: theme }));
}

export function initTheme() {
  // El <script> inline del <head> ya fijó data-theme (evita parpadeo). Aquí solo se enlaza la UI.
  apply(getTheme(), false);
  document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
    b.addEventListener('click', () => apply(getTheme() === 'dark' ? 'light' : 'dark', true)),
  );
  // Si el usuario nunca eligió, seguir al sistema
  mq.addEventListener?.('change', (e) => {
    if (!store.get(KEY)) apply(e.matches ? 'dark' : 'light', false);
  });
}
