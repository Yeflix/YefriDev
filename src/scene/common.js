import {
  Color, CanvasTexture, SRGBColorSpace, MeshStandardMaterial, Sprite, SpriteMaterial,
  AdditiveBlending, NormalBlending,
} from 'three';

/* Paletas por tema.
   dark : neón — materiales emisivos + halos aditivos + mucho contraste.
   light: objetos "sólidos" iluminados (tipo cerámica/vidrio), sin halos, con colores más profundos. */
export const PALETTES = {
  dark: {
    red: new Color(0xff2a3d), blue: new Color(0x5878ff), purple: new Color(0x8f62ff), star: new Color(0xb4bdff),
    ink: new Color(0xcfd6ff), bg: 0x04040a,
    glow: true, emissive: 0.55, rough: 0.28, metal: 0.35, env: 0.3, alpha: 1,
    lights: { red: 2600, blue: 2600, key: 700 },
  },
  light: {
    red: new Color(0xd10a2a), blue: new Color(0x1f3ad6), purple: new Color(0x6a36e8), star: new Color(0x2c3592),
    ink: new Color(0x1a1f5c), bg: 0xc3ccee,
    glow: false, emissive: 0, rough: 0.28, metal: 0.12, env: 1.0, alpha: 1,
    lights: { red: 900, blue: 900, key: 1500 },
  },
};

let sprite;
/** Textura circular suave (puntos y halos) */
export function spriteTexture() {
  if (sprite) return sprite;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,.8)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  sprite = new CanvasTexture(c);
  sprite.colorSpace = SRGBColorSpace;
  return sprite;
}

/** Material estándar (PBR) listo para recolorear con `paint()` */
export const solid = (opts = {}) => new MeshStandardMaterial({ roughness: 0.3, metalness: 0.1, ...opts });

/** Aplica color + emisión según el tema. `glowK` = cuánto brilla en oscuro. */
export function paint(mat, color, p, glowK = 1) {
  mat.color.copy(color);
  mat.emissive.copy(color).multiplyScalar(p.emissive * glowK);
  mat.roughness = p.rough;
  mat.metalness = p.metal;
}

/** Halo aditivo (solo visible en tema oscuro) */
export function halo(size = 1) {
  const s = new Sprite(new SpriteMaterial({ map: spriteTexture(), transparent: true, depthWrite: false, blending: AdditiveBlending }));
  s.scale.setScalar(size);
  return s;
}
export function paintHalo(s, color, p, opacity = 0.5) {
  s.visible = p.glow;
  s.material.color.copy(color);
  s.material.opacity = opacity;
}

/** Mezcla/opacidad de materiales de puntos o líneas */
export function tint(mat, p, base = 1) {
  mat.blending = p.glow ? AdditiveBlending : NormalBlending;
  mat.opacity = base * p.alpha;
  mat.needsUpdate = true;
}

/** Degradado rojo → púrpura → azul, t∈[0,1] */
const tmp = new Color();
export function gradient(p, t, out = tmp) {
  return t < 0.5 ? out.copy(p.red).lerp(p.purple, t * 2) : out.copy(p.purple).lerp(p.blue, (t - 0.5) * 2);
}

export function dispose(group) {
  group.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
  });
}
