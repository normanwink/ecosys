'use strict';

class Hunger {
  constructor() {
    this.value = 0;
    this.max = 1000;
    this.maxPenalty = .25;
    this.energyDecay = 2;
    this.memory = [];
    this.maxMemory = 10;
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

  remember(id) {
    // forget it first
    const i = this.memory.indexOf(id);
    if (i == -1) {
      this.memory.push(id);
    }

    // limit
    while (this.memory.length > this.maxMemory) {
      this.memory.shift();
    }
  }

  forget(id) {
    let i = 0;
    while (i < this.memory) {
      if (this.memory[i] === id) {
        this.memory.splice(i, 1);
      } else {
        ++i;
      }
    }
  }
}

export default Hunger;
