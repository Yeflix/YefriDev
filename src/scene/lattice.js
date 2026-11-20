import { Group, SphereGeometry, CylinderGeometry, InstancedMesh, Object3D, Quaternion, Vector3 } from 'three';
import { solid, paint, dispose } from './common.js';

/* Red cristalina cúbica tipo NaCl: iones grandes/pequeños alternados unidos por enlaces.
   Una onda de "vibración" recorre los iones (escala radial). */
export function createLattice({ n = 5, spacing = 1.55 } = {}) {
  const group = new Group();
  const off = ((n - 1) * spacing) / 2;
  const sg = new SphereGeometry(1, 18, 12);
  const big = [], small = [], bonds = [];
  const P = (i, j, k) => new Vector3(i * spacing - off, j * spacing - off, k * spacing - off);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    ((i + j + k) % 2 ? small : big).push(P(i, j, k));
    if (i < n - 1) bonds.push([P(i, j, k), P(i + 1, j, k)]);
    if (j < n - 1) bonds.push([P(i, j, k), P(i, j + 1, k)]);
    if (k < n - 1) bonds.push([P(i, j, k), P(i, j, k + 1)]);
  }
  const mBig = solid(), mSmall = solid(), mBond = solid();
  const iBig = new InstancedMesh(sg, mBig, big.length);
  const iSmall = new InstancedMesh(sg, mSmall, small.length);
  const cg = new CylinderGeometry(1, 1, 1, 6, 1, true);
  const iBond = new InstancedMesh(cg, mBond, bonds.length);

  const d = new Object3D(), q = new Quaternion(), Y = new Vector3(0, 1, 0), dir = new Vector3();
  bonds.forEach(([a, b], i) => {
    dir.subVectors(b, a);
    const len = dir.length();
    d.position.copy(a).add(b).multiplyScalar(0.5);
    d.quaternion.copy(q.setFromUnitVectors(Y, dir.normalize()));
    d.scale.set(0.04, len, 0.04);
    d.updateMatrix();
    iBond.setMatrixAt(i, d.matrix);
  });
  d.quaternion.identity();
  group.add(iBond, iBig, iSmall);

  const place = (mesh, arr, r, t) => {
    arr.forEach((v, i) => {
      const wave = 1 + 0.2 * Math.sin(t * 2.2 - v.length() * 0.9);
      d.position.copy(v);
      d.scale.setScalar(r * wave);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  return {
    group,
    setPalette(p) {
      paint(mBig, p.red, p, 1); paint(mSmall, p.blue, p, 1);
      paint(mBond, p.star, p, 0.35);
      mBond.roughness = 0.5;
    },
    update(t, dt, ptr) {
      place(iBig, big, 0.36, t); place(iSmall, small, 0.25, t);
      group.rotation.y = t * 0.14 + (ptr?.x ?? 0) * 0.3;
      group.rotation.x = 0.5 + Math.sin(t * 0.18) * 0.2 + (ptr?.y ?? 0) * 0.2;
      group.rotation.z = Math.sin(t * 0.11) * 0.15;
    },
    dispose: () => dispose(group),
  };
}
