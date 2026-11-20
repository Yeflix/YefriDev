import {
  Group, SphereGeometry, InstancedMesh, Object3D, TubeGeometry, CatmullRomCurve3, Vector3, Mesh,
} from 'three';
import { solid, paint, halo, paintHalo, dispose } from './common.js';

/* Átomo tipo Bohr: núcleo de protones (rojo) y neutrones (azul), 3 órbitas elípticas inclinadas y electrones con halo. */
export function createAtom() {
  const group = new Group();
  const sg = new SphereGeometry(1, 20, 14);

  // Núcleo: 16 nucleones en distribución de Fibonacci sobre una esfera de radio ~0.6
  const N = 16, d = new Object3D();
  const pMat = solid(), nMat = solid();
  const protons = new InstancedMesh(sg, pMat, N / 2), neutrons = new InstancedMesh(sg, nMat, N / 2);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const yy = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - yy * yy), th = ga * i;
    const rad = 0.55 * (i % 3 === 0 ? 0.55 : 1);
    d.position.set(Math.cos(th) * r * rad, yy * rad, Math.sin(th) * r * rad);
    d.scale.setScalar(0.27);
    d.updateMatrix();
    (i % 2 ? neutrons : protons).setMatrixAt(i >> 1, d.matrix);
  }
  const nucHalo = halo(4.4);
  group.add(protons, neutrons, nucHalo);

  // Órbitas y electrones
  const A = 3.6, B = 2.2, orbitMats = [], electrons = [], eHalos = [];
  const ell = [];
  for (let i = 0; i < 96; i++) { const a = (i / 96) * Math.PI * 2; ell.push(new Vector3(Math.cos(a) * A, Math.sin(a) * B, 0)); }
  const curve = new CatmullRomCurve3(ell, true);
  const og = new TubeGeometry(curve, 120, 0.028, 6, true);
  for (let k = 0; k < 3; k++) {
    const g = new Group();
    g.rotation.set(1.1, 0, (k * Math.PI) / 3);
    const om = solid();
    const orbit = new Mesh(og, om);
    const em = solid();
    const e = new Mesh(sg, em);
    e.scale.setScalar(0.2);
    const eh = halo(1.9 / 0.2); // escala relativa al electrón
    e.add(eh);
    g.add(orbit, e);
    group.add(g);
    orbitMats.push(om); electrons.push({ mesh: e, mat: em, speed: 0.9 + k * 0.35, phase: k * 2.1 }); eHalos.push(eh);
  }

  return {
    group,
    setPalette(p) {
      paint(pMat, p.red, p, 1.2); paint(nMat, p.blue, p, 1.2);
      paintHalo(nucHalo, p.purple, p, 0.35);
      orbitMats.forEach((m, i) => paint(m, i % 2 ? p.blue : p.red, p, 0.9));
      electrons.forEach((e, i) => { paint(e.mat, p.ink, p, 1.8); e.mat.emissive.copy(p.glow ? p.ink : p.ink).multiplyScalar(p.emissive * 1.6); paintHalo(eHalos[i], i % 2 ? p.blue : p.red, p, 0.8); });
    },
    update(t, dt, ptr) {
      electrons.forEach((e) => {
        const a = t * e.speed + e.phase;
        e.mesh.position.set(Math.cos(a) * A, Math.sin(a) * B, 0);
      });
      group.rotation.y = t * 0.18 + (ptr?.x ?? 0) * 0.3;
      group.rotation.x = Math.sin(t * 0.2) * 0.25 + (ptr?.y ?? 0) * 0.2;
    },
    dispose: () => dispose(group),
  };
}
