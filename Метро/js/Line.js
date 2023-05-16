// линия метро
class Line {
  static newId = 0;
  #id;
  get Id() {
    return this.#id;
  }

  #title;
  #color;

  #visited = false;
  get Visited() {
    return this.#visited;
  }

  set Visited(bool = true) {
    this.#visited = bool;
  }

  #stations = [];
  get Stations() {
    return this.#stations;
  }

  set Stations(stations = []) {
    Station.newId = 0;
    this.#stations = stations;
  }

  constructor(color, title = '') {
    this.#id = `l${Line.newId++}`;
    this.#title = title;
    this.#color = color;
  }

  DrawLine(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.#color;
    ctx.lineWidth = 10;

    let i = 0;
    this.#stations.forEach((station) => {
      let x = station.Coordinate.x;
      let y = station.Coordinate.y;

      if (i == 0) {
        ctx.moveTo(x, y);
        i = 1;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }
}
