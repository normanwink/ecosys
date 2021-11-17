class Navigator {
  constructor() {
    this.parameters = {
      zoomSpeed: 0.002,
      maxZoom: 6,
      minZoom: 0.3,
    }

    this.view = {
      x: 0,
      y: 0,
      zoom: .5,
      width: 0,
      height: 0
    }

    this.mouse = {
      pos: {
        x: 0,
        y: 0
      },
      prev: {
        x: 0,
        y: 0
      },
    }

    this.dragging = false;

    window.addEventListener('mousemove', (e) => {
      this.mouseHandler(e);
    });
    window.addEventListener('mouseup', (e) => {
      this.mouseUp(e);
    });
    window.addEventListener('mousedown', (e) => {
      this.mouseDown(e)
    });
    window.addEventListener('mousewheel', (e) => {
      this.mouseWheel(e)
    });
  }

  getCenter() {
    return {
      x: this.view.width / 2 + this.view.x,
      y: this.view.height / 2 + this.view.y
    }
  }

  mouseHandler(e) {
    this.mouse.pos.x = e.pageX;
    this.mouse.pos.y = e.pageY;

    if (this.dragging) {
      const deltaX = this.mouse.prev.x - this.mouse.pos.x;
      const deltaY = this.mouse.prev.y - this.mouse.pos.y;

      this.view.x -= deltaX;
      this.view.y -= deltaY;
    }

    this.mouse.prev.x = this.mouse.pos.x;
    this.mouse.prev.y = this.mouse.pos.y;
  }

  mouseUp() {
    this.dragging = false;
  }

  mouseDown() {
    this.dragging = true;
  }

  mouseWheel(e) {
    const deltaZoom = e.deltaY * this.parameters.zoomSpeed;
    this.view.zoom += deltaZoom;

    // limit
    if (this.view.zoom > this.parameters.maxZoom) {
      this.view.zoom = this.parameters.maxZoom;
    } else if (this.view.zoom < this.parameters.minZoom) {
      this.view.zoom = this.parameters.minZoom
    } else {
      // move camera
      // this.view.x += (deltaZoom * this.view.width) / 2;
      // this.view.y += (deltaZoom * this.view.height) / 2;
    }
  }

  setViewport(size) {
    this.view.width = size.width;
    this.view.height = size.height;
  }
}

export default Navigator;
