import { WebGLRenderer, Scene, PerspectiveCamera, FogExp2, MathUtils, PointLight, PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PALETTES } from './common.js';
import { createLorenz } from './lorenz.js';
import { createAtom } from './atom.js';
import { createLattice } from './lattice.js';
import { createDNA } from './dna.js';
import { createWaves } from './waves.js';
import { createStars } from './stars.js';

const SPACING = 46; // distancia en Z entre estaciones
const FOV = 55;

/** Cada <section data-station> del DOM se corresponde, en orden, con una estación 3D. */
const STATIONS = [
  { make: (q) => createLorenz({ samples: q.lorenz }), side: 1, k: 0.27, y: 0.5, dist: 24, scale: 1.1 },
  { make: () => createAtom(), side: 1, k: 0.22, y: 2.2, dist: 20, scale: 1.1 },
  { make: () => createLattice(), side: 1, k: 0.44, y: 1, dist: 20, scale: 0.85 },
  { make: () => createDNA(), side: 1, k: 0.47, y: 0, dist: 22, scale: 0.62 },
  { make: (q) => createWaves({ grid: q.grid }), side: 0, k: 0, y: -8.5, dist: 26, scale: 1 },
];

const smooth = (u) => u * u * (3 - 2 * u);

export function createScene(canvas, { reducedMotion = false } = {}) {
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || navigator.deviceMemory <= 4;
  const q = mobile || lowEnd
    ? { lorenz: 700, grid: 44, stars: 700, maxPR: innerWidth < 640 ? 1 : 1.5 } // móvil pequeño: 1 px por píxel CSS
    : { lorenz: 1100, grid: 64, stars: 1500, maxPR: 2 };
  // Tope de 30 fps en móvil / equipos modestos: mitad de GPU y batería, el movimiento sigue suave por la interpolación
  const frameGap = mobile || lowEnd ? 1000 / 30 - 2 : 0;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: mobile ? 'low-power' : 'high-performance' });
  } catch {
    return null; // sin WebGL → el CSS muestra el fondo de respaldo
  }
  renderer.setClearColor(0x000000, 0);
  let pr = Math.min(devicePixelRatio || 1, q.maxPR);
  renderer.setPixelRatio(pr);

  const scene = new Scene();
  scene.fog = new FogExp2(0x04040a, 0.019);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 400);
  camera.position.set(0, 0, 0);
  scene.add(camera);

  /* Iluminación: 3 luces ligadas a la cámara (rojo, azul, clave) + reflejos de entorno (RoomEnvironment) */
  const lRed = new PointLight(0xff3344, 1, 0, 2), lBlue = new PointLight(0x4d6fff, 1, 0, 2), lKey = new PointLight(0xffffff, 1, 0, 2);
  lRed.position.set(-9, 7, 6); lBlue.position.set(9, -5, 6); lKey.position.set(0, 9, 10);
  camera.add(lRed, lBlue, lKey);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  /* Objetos */
  const stars = createStars({ count: q.stars, zFar: -(STATIONS.length * SPACING + 40) });
  scene.add(stars.group);
  const stations = STATIONS.map((cfg, i) => {
    const obj = cfg.make(q);
    obj.group.scale.setScalar(cfg.scale);
    scene.add(obj.group);
    return { ...cfg, obj, z: -i * SPACING };
  });
  const everything = [stars, ...stations.map((s) => s.obj)];

  /* Layout: posiciona objetos según el ancho visible y calcula anclas de scroll por sección */
  let anchors = [0];
  const sections = () => [...document.querySelectorAll('main section[data-station]')];

  function layout() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const narrow = camera.aspect < 0.85;
    stations.forEach((s) => {
      const visW = 2 * s.dist * Math.tan(MathUtils.degToRad(FOV / 2)) * camera.aspect;
      const k = narrow ? s.k * 0.35 : s.k;
      s.obj.group.position.set(s.side * visW * k, narrow ? s.y + 3 : s.y, s.z - s.dist);
      s.obj.group.scale.setScalar(s.scale * (narrow ? 0.72 : 1));
    });
    const scale = renderer.domElement.height / 2;
    stations.forEach((s) => s.obj.setScale?.(scale));

    const max = Math.max(0, document.documentElement.scrollHeight - h);
    const list = sections().slice(0, stations.length);
    anchors = list.map((el, i) => {
      if (i === 0) return 0;
      const r = el.getBoundingClientRect();
      return MathUtils.clamp(r.top + scrollY + r.height / 2 - h / 2, 0, max);
    });
    if (anchors.length) anchors[anchors.length - 1] = Math.max(max, anchors[anchors.length - 1]);
    for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1); // monótono
  }

  function setTheme(name) {
    const p = PALETTES[name] || PALETTES.dark;
    scene.fog.color.setHex(p.bg);
    scene.fog.density = p.glow ? 0.019 : 0.007; /* en claro la niebla lavaba los objetos lejanos */
    everything.forEach((o) => o.setPalette(p));
    scene.environmentIntensity = p.env;
    lRed.intensity = p.lights.red; lBlue.intensity = p.lights.blue; lKey.intensity = p.lights.key;
    if (!running) renderOnce();
  }

  /* Cámara: interpola Z entre estaciones con "easing" (se detiene en cada sección y vuela entre ellas) */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  let cur = scrollY, vel = 0;
  function placeCamera(scrollPos) {
    const n = anchors.length;
    let k = 0;
    while (k < n - 2 && scrollPos >= anchors[k + 1]) k++;
    const a = anchors[k] ?? 0, b = anchors[k + 1] ?? a + 1;
    const u = MathUtils.clamp((scrollPos - a) / (b - a), 0, 1);
    const e = smooth(u);
    const z0 = -k * SPACING, z1 = -(k + 1) * SPACING;
    const dir = k % 2 ? 1 : -1;
    const sway = Math.sin(u * Math.PI) * 2.2 * dir; // trayectoria curva entre estaciones
    camera.position.z = n < 2 ? 0 : MathUtils.lerp(z0, z1, e);
    camera.position.x = sway + pointer.x * 0.9;
    camera.position.y = -pointer.y * 0.6 + Math.sin(u * Math.PI) * 0.8;
    camera.rotation.y = -sway * 0.025 - pointer.x * 0.02;
    camera.rotation.x = pointer.y * 0.012;
    camera.rotation.z = MathUtils.clamp(vel * -0.00004, -0.07, 0.07); // inclinación según velocidad de scroll
  }

  /* Bucle */
  let running = false, raf = 0, last = 0, t = 0, ema = 0.016, frames = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!last) last = now;
    if (frameGap && now - last < frameGap) return; // salta el cuadro: no renderiza ni actualiza
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now; t += dt;

    const target = scrollY;
    const next = cur + (target - cur) * (1 - Math.exp(-dt * 5.5));
    vel = (next - cur) / Math.max(dt, 0.001);
    cur = next;
    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));

    placeCamera(cur);
    everything.forEach((o) => o.update(t, dt, pointer));
    renderer.render(scene, camera);

    // Calidad adaptativa: si el equipo no sostiene ~40fps, baja la resolución de render
    ema += (dt - ema) * 0.05;
    if (++frames > 150 && ema > (frameGap ? 0.045 : 0.026) && pr > 1) {
      pr = Math.max(1, pr - 0.25);
      renderer.setPixelRatio(pr);
      layout();
      frames = 100;
      ema = 0.016;
    }
  }

  function renderOnce() {
    everything.forEach((o) => o.update(reducedMotion ? 5 : t, 0, pointer));
    placeCamera(0);
    renderer.render(scene, camera);
  }

  const api = {
    start() {
      if (running || reducedMotion) { renderOnce(); return; }
      running = true; last = 0; cur = scrollY;
      raf = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    setTheme,
    relayout() { layout(); if (!running) renderOnce(); },
  };

  /* Eventos */
  let lw = innerWidth, lh = innerHeight;
  addEventListener('resize', () => {
    // en móvil la barra del navegador cambia innerHeight al hacer scroll: ignorar cambios pequeños
    if (innerWidth === lw && Math.abs(innerHeight - lh) < 120) return;
    lw = innerWidth; lh = innerHeight;
    api.relayout();
  });
  addEventListener('yd:layout', () => api.relayout());
  if ('ResizeObserver' in window) {
    let pend = 0;
    new ResizeObserver(() => { cancelAnimationFrame(pend); pend = requestAnimationFrame(() => api.relayout()); }).observe(document.body);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (running) { last = 0; raf = requestAnimationFrame(frame); }
  });

  layout();
  return api;
}
