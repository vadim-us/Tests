// станция метро
class Station {
  static newId = 0;
  #id;
  get Id() {
    return this.#id;
  }

  #title;
  #coordinate = { x: 0, y: 0 };
  #line;
  get Line() {
    return this.#line;
  }

  #visited = false;
  #weight = Infinity;
  #path = [];
  #distOnPath;

  set Path({ weight, path, visited, distOnPath }) {
    // console.log({ weight, path, visited });
    if (visited != undefined) this.#visited = visited;

    if (weight != undefined) this.#weight = weight;

    if (path != undefined) this.#path = path;
    if (distOnPath != undefined) this.#distOnPath = distOnPath;
  }
  get Path() {
    return {
      visited: this.#visited,
      weight: this.#weight,
      path: this.#path,
      distOnPath: this.#distOnPath,
    };
  }

  #prevStation;
  set PrevStation({ dist, station }) {
    this.#prevStation = { dist: dist, station: station };
  }
  get PrevStation() {
    return this.#prevStation;
  }

  #nextStation;
  set NextStation({ dist, station }) {
    this.#nextStation = { dist: dist, station: station };
  }
  get NextStation() {
    return this.#nextStation;
  }

  #links = [];
  get Links() {
    let links = [];
    this.#links.forEach((link) => {
      let stations = link.Stations;
      links.push({
        dist: link.Dist,
        station: stations.filter((x) => x != this)[0],
      });
    });
    return links;
  }

  set AddLink(link) {
    this.#links.push(link);
  }

  get Coordinate() {
    return this.#coordinate;
  }

  constructor(coordinate = { x, y }, line, title = '') {
    let id = `${line.Id}_s${Station.newId++}`;
    this.#id = id;
    this.#title = title != '' ? title : id;
    this.#coordinate = coordinate;
    this.#line = line;
  }

  DrawStation(ctx) {
    let x = this.#coordinate.x;
    let y = this.#coordinate.y;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.#title, x, y - 15);
  }

  DrawMark(ctx, type) {
    let color;
    let size;
    switch (type) {
      case 0:
        color = 'gray';
        size = 10;
        break;
      case 1:
        color = 'black';
        size = 5;
        break;
    }
    let x = this.#coordinate.x;
    let y = this.#coordinate.y;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
