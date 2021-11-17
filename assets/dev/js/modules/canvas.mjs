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
      const tileSize = this.world.parameters.upscale * zoom;

      for (var i = 0; i < this.world.data.length; i++) {
        const row = this.world.data[i];
        const y = -center.y + i * tileSize;

        for (var j = 0; j < row.length; j++) {
          const elevation = row[j];
          const x = -center.x + j * tileSize;
          const c = 255 * (elevation + .5);

          this.ctx.beginPath();
          this.ctx.fillStyle = 'rgb(' + c + ', ' + c + ', ' + c + ')';
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
