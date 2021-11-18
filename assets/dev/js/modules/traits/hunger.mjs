'use strict';


class Hunger {
  constructor() {
    this.value = 0;
    this.max = 1000;
    this.maxPenalty = .25;
    this.energyDecay = 2;
  }

  reduce(value) {
    this.value = Math.max(this.value - value, 0);
  }

  // return a value between 1 and 0
  getEnergy() {
    const normalized = 1 - Math.pow(this.value / this.max, this.energyDecay);
    return Math.max(normalized, 0);
  }

  getPenalty() {
    return Math.max(this.getEnergy(), this.maxPenalty);
  }

  moved(movement) {
    this.value += movement.speed * (1 - movement.efficiency);
  }
}

export default Hunger;
