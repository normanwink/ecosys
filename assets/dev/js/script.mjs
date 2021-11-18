import Canvas from './modules/canvas.mjs';
import World from './modules/world.mjs';

'use strict';

const c = new Canvas();
const w = new World();

c.setWorld(w);

w.organisms[0].movement.setSpeed(5);
w.organisms[0].movement.setTurn(.1);
w.organisms[0].movement.setEfficiency(.8);
// console.log(c.world.parameters.levels);
