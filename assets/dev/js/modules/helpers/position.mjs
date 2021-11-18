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

  getDistance(pos) {
    if ((pos.x == this.x) && (pos.y == this.y)) {
      return 0;
    } else {
      const deltaX = pos.x - this.x;
      const deltaY = pos.y - this.y;

      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
  }
}

export default Position;
