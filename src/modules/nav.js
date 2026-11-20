/* Navegación: menú móvil, sección activa, barra de progreso y puntos laterales */
export function initNav() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');
  const links = [...document.querySelectorAll('[data-nav]')];
  const dots = [...document.querySelectorAll('[data-dot]')];

  const setOpen = (open) => {
    burger.classList.toggle('active', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  // tocar fuera de la barra cierra el menú desplegable
  document.addEventListener('click', (e) => menu.classList.contains('open') && !e.target.closest('.nav') && setOpen(false));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => setOpen(false));

  /* Sección activa (IntersectionObserver: sin handler de scroll) */
  const sections = [...document.querySelectorAll('main section[id]')];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', on);
          on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
        });
        dots.forEach((d) => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  /* Barra de progreso + parallax 3D del hero (un único handler con rAF) */
  const bar = document.getElementById('progress');
  const hero = document.getElementById('hero');
  const toTop = document.getElementById('toTop');
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar.style.transform = `scaleX(${p})`;
    const hp = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.9)));
    hero.style.setProperty('--hp', hp.toFixed(3));
    document.documentElement.classList.toggle('scrolled', scrollY > 24);
    toTop?.classList.toggle('show', scrollY > innerHeight * 1.2);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}
