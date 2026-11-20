/* Bundle separado (dist/scene.js): se carga en diferido desde main.js para no bloquear la UI. */
import { initScene } from './modules/scene3d.js';
initScene();
