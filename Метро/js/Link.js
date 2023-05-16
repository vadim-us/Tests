// соединение между двумя станциями
class Link {
  #dist;
  // #time;
  #stations = [];

  static links = [];

  get Dist() {
    return this.#dist;
  }

  get Stations() {
    return this.#stations;
  }

  constructor(dist, stations) {
    this.#dist = dist;
    // this.#time = time;
    this.#stations = stations;

    Link.links.push(this);
  }

  DrawLink(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.#stations[0].Coordinate.x, this.#stations[0].Coordinate.y);
    ctx.lineTo(this.#stations[1].Coordinate.x, this.#stations[1].Coordinate.y);
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.lineWidth = 13;
    ctx.strokeStyle = 'yellow';
    ctx.stroke();

    /* let link = new Path2D();
    link.arc(coordinate.x, coordinate.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill(link);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.stroke(link); */

    // ctx.fillStyle = 'yellow';

    // ctx.strokeStyle = 'red';
  }
}
