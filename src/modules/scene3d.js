import { createScene } from '../scene/engine.js';
import { store } from './storage.js';
import { getTheme } from './theme.js';

/* Orquesta la escena 3D: tema, activar/desactivar efectos y preferencias del sistema */
export function initScene() {
  const root = document.documentElement;
  const canvas = document.getElementById('scene');
  const toggles = document.querySelectorAll('[data-fx-toggle]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  const engine = createScene(canvas, { reducedMotion: reduced });
  if (!engine) { root.classList.add('no-webgl'); toggles.forEach((b) => (b.hidden = true)); return; }

  const pref = store.get('yd-fx'); // 'on' | 'off' | null
  let on = pref ? pref === 'on' : !saveData;

  const apply = () => {
    root.classList.toggle('fx-off', !on);
    toggles.forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      const l = on ? 'Desactivar efectos 3D' : 'Activar efectos 3D';
      b.title = l; b.setAttribute('aria-label', l);
    });
    if (on) { engine.setTheme(getTheme()); engine.relayout(); engine.start(); }
    else engine.stop();
  };
  toggles.forEach((b) => b.addEventListener('click', () => { on = !on; store.set('yd-fx', on ? 'on' : 'off'); apply(); }));
  addEventListener('yd:theme', (e) => on && engine.setTheme(e.detail));

  apply();
  // Tras cargar fuentes/imágenes cambia la altura del documento: recalcular anclas
  document.fonts?.ready.then(() => on && engine.relayout());
  addEventListener('load', () => on && engine.relayout());
}
