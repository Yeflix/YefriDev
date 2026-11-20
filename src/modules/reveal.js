/* Entrada con perspectiva 3D al hacer scroll (IntersectionObserver, una sola vez) */
export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  // Las tarjetas de proyecto son muy altas (sobre todo en móvil): un umbral del 12 % nunca se cumple, basta con asomar.
  const tall = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); tall.unobserve(en.target); }
    }),
    { threshold: 0, rootMargin: '0px 80px 0px 80px' },
  );
  els.forEach((e) => (e.classList.contains('proj') ? tall : io).observe(e));
}

/* Contadores animados (ease-out) */
export function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function f(t) {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
}

/* Texto rotativo del hero (máquina de escribir) */
export function initTyped(el, phrases) {
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = phrases[0]; return; }
  let p = 0, i = 0, del = false;
  const tick = () => {
    const full = phrases[p];
    i += del ? -1 : 1;
    el.textContent = full.slice(0, i);
    let wait = del ? 28 : 62;
    if (!del && i === full.length) { del = true; wait = 1900; }
    else if (del && i === 0) { del = false; p = (p + 1) % phrases.length; wait = 350; }
    setTimeout(tick, wait);
  };
  setTimeout(tick, 600);
}
