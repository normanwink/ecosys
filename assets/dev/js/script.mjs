import Canvas from './modules/canvas.mjs';
import World from './modules/world.mjs';

'use strict';

const c = new Canvas();
const w = new World();

c.setWorld(w);

for (var i = 0; i < w.organisms.length; i++) {
  w.organisms[i].movement.setSpeed(3 + Math.random() * 2);
  w.organisms[i].movement.setTurn(0.07 + Math.random() * .03);
  w.organisms[i].movement.setEfficiency(0.4 + Math.random() * .4);
  w.organisms[i].movement.turnTo((i / w.organisms.length) * 2 * Math.PI)
}
