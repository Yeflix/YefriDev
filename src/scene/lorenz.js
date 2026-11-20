import {
  Group, TubeGeometry, CatmullRomCurve3, Vector3, Float32BufferAttribute, Mesh, MeshBasicMaterial,
  AdditiveBlending, SphereGeometry,
} from 'three';
import { solid, paint, halo, paintHalo, gradient, dispose } from './common.js';

/* Atractor de Lorenz (σ=10, ρ=28, β=8/3) dibujado como cinta tubular con degradado,
   más 3 "cometas" que recorren la trayectoria. Matemática caótica en 3D. */
export function createLorenz({ samples = 1100, radial = 6 } = {}) {
  const S = 0.3, dt = 0.0085, SUB = 6;
  let x = 0.1, y = 0, z = 0;
  const step = () => {
    const dx = 10 * (y - x), dy = x * (28 - z) - y, dz = x * y - (8 / 3) * z;
    x += dx * dt; y += dy * dt; z += dz * dt;
  };
  for (let i = 0; i < 600; i++) step();
  const pts = [];
  for (let i = 0; i < samples; i++) {
    for (let k = 0; k < SUB; k++) step();
    pts.push(new Vector3(x * S, (z - 25) * S, y * S));
  }
  const curve = new CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
  const geo = new TubeGeometry(curve, samples * 2, 0.075, radial, false);
  const count = geo.attributes.position.count;
  geo.setAttribute('color', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  const idxCount = geo.index.count;

  // Dos materiales: neón aditivo (oscuro) y PBR iluminado (claro)
  const neon = new Mesh(geo, new MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }));
  const pbr = new Mesh(geo, solid({ vertexColors: true, roughness: 0.28, metalness: 0.15 }));

  // Cometas
  const cg = new SphereGeometry(0.17, 14, 10);
  const comets = [0, 1, 2].map((i) => {
    const m = new Mesh(cg, solid());
    const h = halo(2.2);
    m.add(h);
    return { m, h, off: i / 3 };
  });

  const group = new Group();
  group.add(neon, pbr, ...comets.map((c) => c.m));

  const paintTube = (p) => {
    const arr = geo.attributes.color.array;
    const seg = geo.parameters.tubularSegments + 1, rad = radial + 1;
    for (let i = 0; i < seg; i++) {
      const c = gradient(p, ((i / seg) * 2) % 1);
      for (let j = 0; j < rad; j++) arr.set([c.r, c.g, c.b], (i * rad + j) * 3);
    }
    geo.attributes.color.needsUpdate = true;
  };

  const p3 = new Vector3();
  return {
    group,
    setPalette(p) {
      paintTube(p);
      neon.visible = p.glow;
      pbr.visible = !p.glow;
      comets.forEach((c, i) => {
        const col = i % 2 ? p.blue : p.red;
        paint(c.m.material, col, p, 1.6);
        paintHalo(c.h, col, p, 0.7);
      });
    },
    update(t, dt, ptr) {
      const grow = Math.min(1, t / 6);
      geo.setDrawRange(0, Math.max(6, Math.floor(idxCount * grow * grow * (3 - 2 * grow))));
      comets.forEach((c) => {
        const u = (t * 0.035 + c.off) % 1;
        curve.getPoint(u * Math.min(1, grow), p3);
        c.m.position.copy(p3);
        c.m.visible = grow > 0.15;
      });
      group.rotation.y = Math.sin(t * 0.12) * 0.7 + (ptr?.x ?? 0) * 0.35;
      group.rotation.x = Math.sin(t * 0.07) * 0.12 + (ptr?.y ?? 0) * 0.2;
    },
    dispose: () => { dispose(group); },
  };
}
