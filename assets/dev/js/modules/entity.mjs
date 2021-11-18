'use strict';

class Entity {
  constructor(world = false) {
    this.position = {
      x: 0,
      y: 0
    }

    this.alive = true;

    this.world = world;
  }
}

export default Entity;
