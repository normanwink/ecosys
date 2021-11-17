import Canvas from './modules/canvas.mjs';
import World from './modules/world.mjs';

const c = new Canvas();
const w = new World();

c.setWorld(w);
// console.log(c.world.parameters.levels);
