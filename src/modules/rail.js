/* Carrusel horizontal de proyectos: scroll-snap nativo + flechas, teclado, arrastre con ratón,
   contador y barra de progreso. Sin librerías. */
export function initRail() {
  const rail = document.getElementById('projectsGrid');
  if (!rail) return;
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const count = document.getElementById('railCount');
  const bar = document.getElementById('railBar');
  const pad = (n) => String(n).padStart(2, '0');
  const cards = () => [...rail.querySelectorAll('.proj:not([hidden])')];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)');
  const step = () => {
    const c = cards();
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : rail.clientWidth * 0.8;
  };
  let active = 0;

  /* Coverflow: cada tarjeta se inclina, se aleja y se atenúa según su distancia al centro del carrusel */
  function update() {
    const c = cards();
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    const max = rail.scrollWidth - rail.clientWidth;
    const ang = small.matches ? 24 : 42;
    const depth = small.matches ? 90 : 190;
    let best = Infinity;
    c.forEach((el, i) => {
      const w = el.offsetWidth;
      const d = (el.offsetLeft + w / 2 - mid) / (w * 0.92); // −1 = tarjeta de la izquierda, 0 = centro, 1 = derecha
      const ad = Math.min(Math.abs(d), 2.2);
      if (Math.abs(d) < best) { best = Math.abs(d); active = i; }
      if (small.matches) {
        // móvil: carrusel plano (tarjetas compactas); sin transformaciones 3D por cuadro → menos trabajo de GPU
        if (el.style.transform) { el.style.transform = ''; el.style.opacity = ''; }
      } else if (!reduce) {
        el.style.transform = `translate3d(${(-d * w * 0.05).toFixed(1)}px,0,${(-ad * depth).toFixed(1)}px) rotateY(${(-Math.sign(d) * Math.min(ad, 1.2) * ang).toFixed(2)}deg) scale(${(1 - ad * 0.05).toFixed(3)})`;
        el.style.opacity = String(Math.max(0.3, 1 - ad * 0.38).toFixed(3));
      }
      el.style.zIndex = String(20 - Math.round(ad * 5));
    });
    c.forEach((el, i) => el.classList.toggle('is-active', i === active));
    if (max - rail.scrollLeft < 4) active = c.length - 1;
    if (count) count.textContent = `${pad(Math.min(active + 1, c.length))} / ${pad(c.length)}`;
    if (bar) bar.style.width = (max > 0 ? Math.max(8, (rail.scrollLeft / max) * 100) : 100) + '%';
    if (prev) prev.disabled = rail.scrollLeft < 4;
    if (next) next.disabled = max - rail.scrollLeft < 4;
  }

  const go = (dir) => rail.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  let raf = 0;
  rail.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  rail.addEventListener('yd:rail', update);
  addEventListener('resize', update);
  small.addEventListener?.('change', update);

  /* Arrastrar con el ratón (el táctil ya desliza solo) */
  let down = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 6) { rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; }
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    // el snap vuelve a actuar al quitar la clase
    requestAnimationFrame(() => rail.classList.remove('is-drag'));
  });
  // un arrastre no debe abrir el enlace de la tarjeta
  rail.addEventListener('click', (e) => {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; return; }
    if (small.matches) return; // móvil: la tarjeta compacta abre la hoja de detalle
    const proj = e.target.closest('.proj');
    if (proj && !proj.classList.contains('is-active') && !proj.classList.contains('proj--cta')) {
      // un toque en una tarjeta lateral la trae al centro; el siguiente toque abre el proyecto
      e.preventDefault(); e.stopPropagation();
      rail.scrollTo({ left: proj.offsetLeft + proj.offsetWidth / 2 - rail.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, true);

  update();
}
