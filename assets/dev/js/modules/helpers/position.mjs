'use strict';

class Position {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  moveBy(x = 0, y = 0) {
    this.x += x;
    this.y += y;
  }

  moveTo(x = null, y = null) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
  }

  getDelta(pos) {
    return {
      x: pos.x - this.x,
      y: pos.y - this.y
    }
  }

  getAngle(pos) {
    const delta = this.getDelta(pos);
    return Math.atan2(delta.y, delta.x);
  }

  getDistance(pos) {
    if ((pos.x == this.x) && (pos.y == this.y)) {
      return 0;
    } else {
      const delta = this.getDelta(pos)

      return Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    }
  }
}

export default Position;
