import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three';
import { spriteTexture, tint, dispose } from './common.js';
import { Group } from 'three';

/* Campo de partículas a lo largo de todo el recorrido (da profundidad y paralaje) */
export function createStars({ count = 1400, zFar = -260, zNear = 40 } = {}) {
  const pos = new Float32Array(count * 3);
  const pick = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    pos.set([(Math.random() - 0.5) * 120, (Math.random() - 0.5) * 70, zNear + Math.random() * (zFar - zNear)], i * 3);
    const r = Math.random();
    pick[i] = r < 0.14 ? 0 : r < 0.3 ? 1 : 2; // rojo / azul / neutro
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new PointsMaterial({ size: 0.2, map: spriteTexture(), vertexColors: true, transparent: true, depthWrite: false });
  const group = new Group();
  group.add(new Points(geo, mat));
  return {
    group,
    setPalette(p) {
      const c = geo.attributes.color.array;
      for (let i = 0; i < count; i++) {
        const col = pick[i] === 0 ? p.red : pick[i] === 1 ? p.blue : p.star;
        c.set([col.r, col.g, col.b], i * 3);
      }
      geo.attributes.color.needsUpdate = true;
      tint(mat, p, 0.85);
    },
    update() {},
    dispose: () => dispose(group),
  };
}
