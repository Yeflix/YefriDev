import {
  Group, SphereGeometry, CylinderGeometry, InstancedMesh, Object3D, Quaternion, Vector3, Mesh,
  TubeGeometry, CatmullRomCurve3,
} from 'three';
import { solid, paint, dispose } from './common.js';

/* Doble hélice de ADN: dos cadenas (tubos), nucleótidos (esferas) y pares de bases (peldaños bicolores). */
export function createDNA({ pairs = 40, height = 26, radius = 1.9, turns = 2.4 } = {}) {
  const group = new Group();
  const spin = new Group();
  group.add(spin);
  group.rotation.z = 0.45;

  const pa = [], pb = [];
  const at = (t, ph) => new Vector3(Math.cos(t * turns * Math.PI * 2 + ph) * radius, (t - 0.5) * height, Math.sin(t * turns * Math.PI * 2 + ph) * radius);
  const dense = pairs * 4;
  const da = [], db = [];
  for (let i = 0; i <= dense; i++) { da.push(at(i / dense, 0)); db.push(at(i / dense, Math.PI)); }
  for (let i = 0; i < pairs; i++) { const t = i / (pairs - 1); pa.push(at(t, 0)); pb.push(at(t, Math.PI)); }

  const mA = solid(), mB = solid(), mR1 = solid(), mR2 = solid(), mSA = solid(), mSB = solid();
  const tg = (pts) => new TubeGeometry(new CatmullRomCurve3(pts), dense * 2, 0.085, 6, false);
  spin.add(new Mesh(tg(da), mSA), new Mesh(tg(db), mSB));

  const sg = new SphereGeometry(1, 16, 12), cg = new CylinderGeometry(1, 1, 1, 6, 1, true);
  const iA = new InstancedMesh(sg, mA, pairs), iB = new InstancedMesh(sg, mB, pairs);
  const r1 = new InstancedMesh(cg, mR1, pairs), r2 = new InstancedMesh(cg, mR2, pairs);
  const d = new Object3D(), q = new Quaternion(), Y = new Vector3(0, 1, 0), dir = new Vector3(), mid = new Vector3();
  const rung = (mesh, i, a, b) => {
    dir.subVectors(b, a);
    const len = dir.length();
    d.position.copy(a).add(b).multiplyScalar(0.5);
    d.quaternion.copy(q.setFromUnitVectors(Y, dir.normalize()));
    d.scale.set(0.05, len, 0.05);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
  };
  for (let i = 0; i < pairs; i++) {
    mid.addVectors(pa[i], pb[i]).multiplyScalar(0.5);
    rung(r1, i, pa[i], mid); rung(r2, i, mid, pb[i]);
    d.quaternion.identity();
    d.scale.setScalar(0.27);
    d.position.copy(pa[i]); d.updateMatrix(); iA.setMatrixAt(i, d.matrix);
    d.position.copy(pb[i]); d.updateMatrix(); iB.setMatrixAt(i, d.matrix);
  }
  spin.add(iA, iB, r1, r2);

  return {
    group,
    setPalette(p) {
      paint(mA, p.red, p, 1.2); paint(mB, p.blue, p, 1.2);
      paint(mR1, p.red, p, 0.7); paint(mR2, p.blue, p, 0.7);
      paint(mSA, p.red, p, 0.7); paint(mSB, p.blue, p, 0.7);
    },
    update(t, dt, ptr) { spin.rotation.y = t * 0.35 + (ptr?.x ?? 0) * 0.4; },
    dispose: () => dispose(group),
  };
}
