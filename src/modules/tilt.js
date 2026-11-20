/* Inclinación 3D + brillo que sigue al puntero en tarjetas. Solo con mouse. */
export function initTilt() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MAX = 7; // grados
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('[data-tilt]');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--ry', ((x - 0.5) * 2 * MAX).toFixed(2) + 'deg');
    card.style.setProperty('--rx', ((0.5 - y) * 2 * MAX).toFixed(2) + 'deg');
    card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    card.classList.add('is-hot');
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest?.('[data-tilt]');
    if (!card || card.contains(e.relatedTarget)) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.classList.remove('is-hot');
  });
}
