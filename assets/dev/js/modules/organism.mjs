import Entity from './entity.mjs';
import Movement from './traits/movement.mjs';
import Hunger from './traits/hunger.mjs';
import GeoBias from './traits/geoBias.mjs';

'use strict';

class Organism extends Entity {
  hunger = new Hunger();
  thirst = 0;

  size = 10;
  color = {
    r: 255,
    g: 0,
    b: 0
  }

  movement = new Movement();
  sight = 80;

  bias = {
    geo: new GeoBias()
  }

  // decide where to move
  think() {
    const boundaries = this.world.getBoundaries();

    // check if it could possibly reach the edge
    const north = (boundaries.yMin + this.movement.speed + this.size) >= this.position.y;
    const east = (boundaries.xMax - this.movement.speed - this.size) <= this.position.x;
    const south = (boundaries.yMax - this.movement.speed - this.size) <= this.position.y;
    const west = (boundaries.xMin + this.movement.speed + this.size) >= this.position.x;

    // redirect away from edge
    if (north) {
      if (east) {
        // top right
        this.movement.turnTo(25 * Math.PI);
      } else if (west) {
        // top left
        this.movement.turnTo(1.75 * Math.PI);
      } else {
        this.movement.turnTo(0);
      }
    } else if (south) {
      if (east) {
        // bottom right
        this.movement.turnTo(.75 * Math.PI);
      } else if (west) {
        // bottom left
        this.movement.turnTo(1.25 * Math.PI);
      } else {
        this.movement.turnTo(1 * Math.PI);
      }
    } else if (east) {
      // right
      this.movement.turnTo(1.5 * Math.PI);
    } else if (west) {
      // left
      this.movement.turnTo(.5 * Math.PI);
    } else {
      let dir = 0;
      let determination = Math.random();

      if (determination < .3) {
        dir = this.movement.turn;
      }

      if (determination > .7) {
        dir = -this.movement.turn;
      }

      this.movement.turnBy(dir);
    }

    this.move();
  }

  // apply movement
  move() {
    this.hunger.moved(this.movement);

    const deltaX = this.movement.getDeltaX();
    const deltaY = this.movement.getDeltaY();

    // hunger penalty
    const hungerX = deltaX * this.hunger.getPenalty();
    const hungerY = deltaY * this.hunger.getPenalty();

    this.position.x += hungerX;
    this.position.y += hungerY;
  }

  // get grid which is visible by organism
  getView() {

  }
}

export default Organism;