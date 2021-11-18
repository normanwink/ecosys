import Position from './position.mjs';

'use strict';

class Entity {
  constructor(world = false) {
    this.position = new Position();

    this.alive = true;

    this.world = world;
  }

  kill() {
    this.alive = false;
  }
}

export default Entity;
