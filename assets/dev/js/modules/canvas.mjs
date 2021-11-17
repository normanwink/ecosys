import Navigator from './navigator.mjs';

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
