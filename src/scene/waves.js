import {
  Group, BufferGeometry, Float32BufferAttribute, Points, LineSegments, ShaderMaterial, Color, Vector2,
  AdditiveBlending, NormalBlending,
} from 'three';

/* Interferencia de dos fuentes puntuales: y = A·[sin(k·r₁ − ωt) + sin(k·r₂ − ωt)]·e^(−γr).
   Malla de alambre + puntos, calculada en GPU. */
const COMMON = /* glsl */ `
  uniform float uTime, uSize, uScale;
  uniform vec2 uA, uB;
  varying float vH;
  varying float vFade;
  vec3 wave(vec3 p) {
    float k = 1.15, w = 1.6;
    float r1 = distance(p.xz, uA), r2 = distance(p.xz, uB);
    float env = exp(-0.018 * (r1 + r2));
    float h = (sin(k * r1 - w * uTime) + sin(k * r2 - w * uTime)) * 0.5 * env;
    vH = h;
    p.y = h * 2.4;
    return p;
  }`;
const VERT_P = COMMON + /* glsl */ `
  void main() {
    vec4 mv = modelViewMatrix * vec4(wave(position), 1.0);
    vFade = smoothstep(130.0, 30.0, -mv.z);
    gl_PointSize = uSize * (1.0 + 0.5 * abs(vH)) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;
const VERT_L = COMMON + /* glsl */ `
  void main() {
    vec4 mv = modelViewMatrix * vec4(wave(position), 1.0);
    vFade = smoothstep(130.0, 30.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG_P = /* glsl */ `
  uniform vec3 uColA, uColB; uniform float uAlpha;
  varying float vH; varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 col = mix(uColA, uColB, smoothstep(-0.8, 0.8, vH));
    gl_FragColor = vec4(col, smoothstep(0.5, 0.05, d) * uAlpha * vFade);
  }`;
const FRAG_L = /* glsl */ `
  uniform vec3 uColA, uColB; uniform float uAlpha;
  varying float vH; varying float vFade;
  void main() {
    vec3 col = mix(uColA, uColB, smoothstep(-0.8, 0.8, vH));
    gl_FragColor = vec4(col, uAlpha * 0.5 * vFade);
  }`;

export function createWaves({ grid = 64, spacing = 0.62 } = {}) {
  const pos = new Float32Array(grid * grid * 3);
  const half = ((grid - 1) * spacing) / 2;
  for (let i = 0; i < grid; i++) for (let j = 0; j < grid; j++) pos.set([i * spacing - half, 0, j * spacing - half], (i * grid + j) * 3);
  const idx = [];
  for (let i = 0; i < grid; i++) for (let j = 0; j < grid; j++) {
    if (i < grid - 1) idx.push(i * grid + j, (i + 1) * grid + j);
    if (j < grid - 1) idx.push(i * grid + j, i * grid + j + 1);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const lgeo = new BufferGeometry();
  lgeo.setAttribute('position', geo.attributes.position);
  lgeo.setIndex(idx);

  const uniforms = {
    uTime: { value: 0 }, uSize: { value: 0.22 }, uScale: { value: 400 },
    uA: { value: new Vector2(-6, 0) }, uB: { value: new Vector2(6, 0) },
    uColA: { value: new Color() }, uColB: { value: new Color() }, uAlpha: { value: 1 },
  };
  const base = { uniforms, transparent: true, depthWrite: false };
  const mp = new ShaderMaterial({ ...base, vertexShader: VERT_P, fragmentShader: FRAG_P });
  const ml = new ShaderMaterial({ ...base, vertexShader: VERT_L, fragmentShader: FRAG_L });
  const pts = new Points(geo, mp), lines = new LineSegments(lgeo, ml);
  pts.frustumCulled = lines.frustumCulled = false;
  const group = new Group();
  group.add(lines, pts);
  group.rotation.x = 0.18;

  return {
    group,
    setScale(s) { uniforms.uScale.value = s; },
    setPalette(p) {
      uniforms.uColA.value.copy(p.red);
      uniforms.uColB.value.copy(p.blue);
      uniforms.uAlpha.value = p.glow ? 0.85 : 1;
      uniforms.uSize.value = p.glow ? 0.22 : 0.26;
      [mp, ml].forEach((m) => { m.blending = p.glow ? AdditiveBlending : NormalBlending; m.needsUpdate = true; });
    },
    update(t) { uniforms.uTime.value = t; group.rotation.y = Math.sin(t * 0.08) * 0.15; },
    dispose() { geo.dispose(); lgeo.dispose(); mp.dispose(); ml.dispose(); },
  };
}
