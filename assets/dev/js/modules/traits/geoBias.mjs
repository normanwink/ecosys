'use strict';

class GeoBias {
  constructor() {
    this.preferred = .5;
    this.resilience = 0;
  }

  setElevation(elevation) {
    this.preferred = elevation;
  }

  setResilience(resilience) {
    this.preferred = resilience;
  }
}

export default GeoBias;
