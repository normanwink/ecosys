import Navigator from './navigator.mjs';

'use strict';

class Canvas {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      particles: window.innerWidth / 30,
    }

    this.world = null;
    this.hasWorld = false;
    this.running = true;

    this.navigator = new Navigator();

    this.resize();
    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height);

    const center = this.navigator.getCenter();
    const zoom = this.navigator.view.zoom;

    if (this.hasWorld) {
      this.world.update();

      const tilesX = this.world.parameters.width;
      const tilesY = this.world.parameters.height;
      const tileSize = this.world.parameters.tileSize * zoom;

      for (var i = 0; i < tilesY; i++) {
        const row = this.world.data[i];
        const y = (i - (tilesY / 2)) * tileSize + center.y;

        for (var j = 0; j < tilesX; j++) {
          const x = (j - (tilesX / 2)) * tileSize + center.x;
          const elevation = row[j];
          let r, g, b;

          if (elevation.colorCached) {
            r = elevation.color.r;
            g = elevation.color.g;
            b = elevation.color.b;
          } else {
            const level = this.world.findLevel(elevation.elevation);
            const color = this.world.parameters.colors[level.name];

            const factor = (elevation.elevation - level.prev) / level.delta;

            r = color.from.r + factor * color.delta.r;
            g = color.from.g + factor * color.delta.g;
            b = color.from.b + factor * color.delta.b;

            row[j].setColor(r, g, b);
          }

          this.ctx.beginPath();
          this.ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      for (const food of this.world.foods) {
        const fS = food.size * zoom;
        const fX = food.position.x - fS / 2;
        const fY = food.position.y - fS / 2;
        const x = fX * zoom + center.x;
        const y = fY * zoom + center.y;

        const r = food.color.r;
        const g = food.color.g;
        const b = food.color.b;

        // food body
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        this.ctx.arc(x, y, fS, 0, 2 * Math.PI);
        this.ctx.fill();
      }

      for (const orga of this.world.organisms) {
        const oS = orga.size * zoom;
        const oX = orga.position.x - oS / 2;
        const oY = orga.position.y - oS / 2;
        const x = oX * zoom + center.x;
        const y = oY * zoom + center.y;

        const r = orga.color.r;
        const g = orga.color.g;
        const b = orga.color.b;

        // organism body
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        this.ctx.arc(x, y, oS, 0, 2 * Math.PI);
        this.ctx.fill();

        // organism view / sight
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgb(255, 0, 0)';
        this.ctx.arc(x, y, orga.sight * zoom, 0, 2 * Math.PI);
        this.ctx.stroke();

        const mX = oS * Math.sin(orga.movement.direction);
        const mY = oS * Math.cos(orga.movement.direction);

        // organism mouth / eye
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.arc(x + mX, y + mY, oS / 3, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }

    if (this.running) {
      window.requestAnimationFrame(() => {
        this.render();
      });
    }
  }

  setWorld(world) {
    this.world = world;
    this.hasWorld = true;
  }

  resize() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.navigator.setViewport(this.sizes);

    this.canvas.width = this.sizes.width;
    this.canvas.height = this.sizes.height;
  }
}

export default Canvas;
