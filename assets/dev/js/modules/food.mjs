import Entity from './helpers/entity.mjs';

'use strict';

class Food extends Entity {
  energy = 200;
  size = 10;
  color = {
    r: 0,
    g: 255,
    b: 0
  }
  idealElevation = 0.45;
  elevationBias = 2;
  id = 0;

  spawn() {
    const wX = this.world.parameters.width;
    const wY = this.world.parameters.height;
    const wT = this.world.parameters.tileSize;

    let tileFound = false;
    let tile = null;

    while (!tileFound) {
      const randX = Math.floor(Math.random() * wX);
      const randY = Math.floor(Math.random() * wX);
      tile = this.world.data[randY][randX];

      // lower chance of re-rollint
      // the closer it is to idealElevation
      const delta = Math.abs(this.idealElevation - tile.elevation);
      tileFound = Math.random() < 1 - Math.max(delta * this.elevationBias, 0);
    }

    const x = tile.x * wT + Math.random() * wT - (wX * wT) / 2;
    const y = tile.y * wT + Math.random() * wT - (wY * wT) / 2;

    this.id = Date.now();

    this.position.moveTo(x, y);
  }
}

export default Food;
