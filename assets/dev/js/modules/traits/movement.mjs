'use strict';

class Movement {
  constructor() {
    this.speed = 0;
    this.turn = 0;
    this.efficiency = 0;
    this.direction = Math.random() * 2 * Math.PI;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  setEfficiency(efficiency) {
    this.efficiency = efficiency;
  }

  turnBy(rad) {
    this.direction += rad;
  }

  turnTo(rad) {
    this.direction = rad;
  }

  getDeltaX() {
    return this.speed * Math.cos(this.direction);
  }

  getDeltaY() {
    return this.speed * Math.sin(this.direction);
  }
}

export default Movement;
