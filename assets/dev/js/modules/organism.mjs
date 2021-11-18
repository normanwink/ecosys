import Entity from './helpers/entity.mjs';
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
  sight = 200;

  bias = {
    geo: new GeoBias()
  }

  // decide where to move
  think() {
    if (this.hunger.getEnergy() <= 0) {
      this.kill();
    }

    if (this.alive) {
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
          this.movement.turnTo(1.25 * Math.PI);
        } else if (west) {
          // top left
          this.movement.turnTo(.25 * Math.PI);
        } else {
          this.movement.turnTo(.5 * Math.PI);
        }
      } else if (south) {
        if (east) {
          // bottom right
          this.movement.turnTo(1.25 * Math.PI);
        } else if (west) {
          // bottom left
          this.movement.turnTo(1.75 * Math.PI);
        } else {
          this.movement.turnTo(1.5 * Math.PI);
        }
      } else if (east) {
        // right
        this.movement.turnTo(1 * Math.PI);
      } else if (west) {
        // left
        this.movement.turnTo(0);
      } else {
        const energy = this.hunger.getEnergy();
        const foodChoices = [];

        for (var i = 0; i < this.hunger.memory.length; i++) {
          const foodId = this.hunger.memory[i];
          const food = this.world.getFoodById(foodId);

          if (food) {
            const angle = this.position.getAngle(food.position);
            const distance = this.position.getDistance(food.position);

            foodChoices.push({
              delta: angle,
              distance: distance
            });
          } else {
            // assume it was already eaten
            this.hunger.forget(foodId);
          }
        }

        // increase probability of following food with hunger
        const followFood = Math.random() > 1 - energy;

        if (followFood && foodChoices.length > 0) {
          // sort by distance
          const sortedFoodChoices = foodChoices.sort(function(fA, fB) {
            const a = fA.distance;
            const b = fB.distance;

            if (a < b) {
              return -1; // A comes first
            }
            if (a > b) {
              return 1; // B comes first
            }

            return 0;  // must be equal
          });

          let dir = 0;
          dir = sortedFoodChoices[0].delta;
          this.movement.turnTo(dir);
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
      }
    }
  }

  // apply movement
  move() {
    this.hunger.moved(this.movement);

    const deltaX = this.movement.getDeltaX();
    const deltaY = this.movement.getDeltaY();

    // hunger penalty
    const hungerX = deltaX * this.hunger.getPenalty();
    const hungerY = deltaY * this.hunger.getPenalty();

    this.position.moveBy(hungerX, hungerY);
  }

  eat(foodId) {
    const food = this.world.getFoodById(foodId);

    if (food) {
      this.hunger.reduce(food.energy);
    }
  }

  // get grid which is visible by organism
  getView() {

  }
}

export default Organism;
