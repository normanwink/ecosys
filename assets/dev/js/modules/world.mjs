import Perlin from './perlin.mjs';

class World {
  constructor() {
    this.parameters = {
      width: 64,
      height: 64,
      upscale: 30,
      elevation: {
        scale: 0.2,
        position: 0,
      },
      biome: {
        scale: 0.1,
        position: 0,
      },
    }

    this.perlin = new Perlin();
    this.data = [];

    this.reseed();
    this.generate();
  }

  generate() {
    this.worldData = [];

    for (var i = 0; i < this.parameters.height; i++) {
      const row = [];
      const yE = i * this.parameters.elevation.scale;

      for (var j = 0; j < this.parameters.width; j++) {
        const xE = j * this.parameters.elevation.scale;
        row.push(this.perlin.get(xE, yE));
      }

      this.data.push(row);
    }
  }

  reseed() {
    const seedFactor = 100;
    this.parameters.elevation.position = Math.random() * seedFactor;
    this.parameters.biome.position = Math.random() * seedFactor;
  }
}

export default World;
