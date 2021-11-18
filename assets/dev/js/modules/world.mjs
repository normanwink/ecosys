import Perlin from './perlin.mjs';
import Organism from './organism.mjs';
import Food from './food.mjs';

'use strict';

class Elevation {
  constructor(x, y, e, totalX, totalY) {
    this.x = x;
    this.y = y;
    this.elevation = e + .5;
    this.colorCached = false;
    this.color = {
      r: 0,
      g: 0,
      b: 0
    }

    this.total = {
      x: totalX,
      y: totalY,
    }

    this.adjacted = {
      n: this.y > 0 ? [this.x, this.y-1] : false,
      ne: this.y > 0 && this.x < this.total.x-1 ? [this.x+1, this.y-1] : false,
      e: this.x < this.total.x-1 ? [this.x+1, this.y] : false,
      se: this.x < this.total.x-1 && this.y < this.total.y-2 ? [this.x+1, this.y+1] : false,
      s: this.y < this.total.y-1 ? [this.x, this.y+1] : false,
      sw: this.x > 0 && this.y < this.total.y-1 ? [this.x-1, this.y+1] : false,
      w: this.x > 0 ? [this.x-1, this.y] : false,
      sw: this.x > 0 && this.y > 0 ? [this.x-1, this.y-1] : false,
    }
  }

  setColor(r, g, b) {
    this.color = {
      r: r,
      g: g,
      b: b
    };
    this.colorCached = true;
  }
}

class World {
  constructor() {
    this.parameters = {
      width: 5,
      height: 5,
      tileSize: 100,
      organisms: 1,
      foodRate: 0.1,
      elevation: {
        scale: 0.08,
        position: 0,
      },
      biome: {
        scale: 0.1,
        position: 0,
      },
      levels: [
        {
          elevation: .1,
          name: "water"
        },
        {
          elevation: .2,
          name: "sand"
        },
        {
          elevation: .70,
          name: "grass"
        },
        {
          elevation: .90,
          name: "rock"
        },
        {
          elevation: 1.00,
          name: "snow"
        }
      ],
      colors: {
        grass: {
          from: {
            r: 19,
            g: 186,
            b: 49
          },
          to: {
            r: 1,
            g: 105,
            b: 18
          }
        },
        rock: {
          from: {
            r: 63,
            g: 41,
            b: 4
          },
          to: {
            r: 39,
            g: 34,
            b: 26
          }
        },
        water: {
          from: {
            r: 0,
            g: 63,
            b: 150
          },
          to: {
            r: 38,
            g: 125,
            b: 243
          }
        },
        sand: {
          from: {
            r: 238,
            g: 231,
            b: 18
          },
          to: {
            r: 255,
            g: 249,
            b: 21
          }
        },
        snow: {
          from: {
            r: 240,
            g: 240,
            b: 240
          },
          to: {
            r: 255,
            g: 255,
            b: 255
          }
        },
      }
    }

    this.organisms = [];
    for (var i = 0; i < this.parameters.organisms; i++) {
      this.organisms.push(new Organism(this))
    }
    this.foods = [];

    this.perlin = new Perlin();
    this.data = [];

    this.updateColorDelta();
    this.reseed();
    this.generate();
  }

  update() {
    for (let i = 0; i < this.organisms.length; i++) {
      this.organisms[i].think();
    }

    const foodSpawn = Math.random() < this.parameters.foodRate;
    if (foodSpawn) {
      const newFood = new Food(this);
      newFood.spawn();
      this.foods.push(newFood);
    }
  }

  getBoundaries() {
    return {
      xMin: -(this.parameters.width / 2) * this.parameters.tileSize,
      yMin: -(this.parameters.height / 2) * this.parameters.tileSize,
      xMax: (this.parameters.width / 2) * this.parameters.tileSize,
      yMax: (this.parameters.height / 2) * this.parameters.tileSize,
    }
  }

  getTile(x, y) {
    return this.data[y][x];
  }

  findTile(x, y) {
    // normalize
    const nX = x / this.parameters.tileSize;
    const nY = y / this.parameters.tileSize;

    // shift
    const sX = nX + this.parameters.width / 2;
    const sY = nY + this.parameters.height / 2;

    // identify
    const iX = Math.floor(sX);
    const iY = Math.floor(sY);

    return this.data[iY][iX];
  }

  findLevel(elevation) {
    for (let i = 0; i < this.parameters.levels.length; i++) {
      const level = this.parameters.levels[i];

      if (elevation < level.elevation) {
        return this.parameters.levels[i];
      }
    }

    return this.parameters.levels[this.parameters.levels.length - 1]
  }

  updateColorDelta() {
    for (const colorName in this.parameters.colors) {
      const color = this.parameters.colors[colorName];
      const from = color.from;
      const to = color.to;
      const delta = {
        r: to.r - from.r,
        g: to.g - from.g,
        b: to.b - from.b
      }

      this.parameters.colors[colorName].delta = delta;
    }

    let prevLevel = 0;
    for (let i = 0; i < this.parameters.levels.length; i++) {
      const level = this.parameters.levels[i];
      const delta = level.elevation - prevLevel;

      this.parameters.levels[i].prev = prevLevel;
      this.parameters.levels[i].delta = delta;
      prevLevel = level.elevation;
    }
  }

  generate() {
    this.worldData = [];

    for (var i = 0; i < this.parameters.height; i++) {
      const row = [];
      const yE = i * this.parameters.elevation.scale;

      for (var j = 0; j < this.parameters.width; j++) {
        const xE = j * this.parameters.elevation.scale;
        const temp = new Elevation(j, i, this.perlin.get(xE + this.parameters.elevation.position, yE + this.parameters.elevation.position), this.parameters.width, this.parameters.height);
        row.push(temp);
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
