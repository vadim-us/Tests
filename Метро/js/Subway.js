// метро
class Subway {
  #lines = [];
  #allStations = [];
  #links = [];
  #ctx;

  /* get lines() {
    return this.#lines;
  } */

  constructor(ctx, lines = [], links = []) {
    this.#ctx = ctx;
    this.CreateLine(lines);

    // console.log('links', this.#links);
    // console.log('lines', this.#lines);
    // console.log('allStations', this.#allStations);

    this.CreateLink(links);

    this.DrawSubway();

    let startID = window.location.search.replace('?id=', '');

    let start = this.#allStations.find((station) => station.Id == startID);
    this.VisitAllLines(start);
  }

  CreateLine(lines) {
    lines.forEach((line) => {
      let prev;
      let i = 0;

      let color = line.line.color;
      let name = line.line.name != undefined ? line.line.name : '';
      let newline = new Line(color, name);

      let newStationsA = [];
      line.stations.forEach((station) => {
        let name = station.name != undefined ? station.name : '';
        let newStation = new Station(
          { x: station.x, y: station.y },
          newline,
          name
        );

        if (i++ != 0) {
          let distance = Math.ceil(
            Math.sqrt(
              Math.pow(station.x - prev.Coordinate.x, 2) +
                Math.pow(station.y - prev.Coordinate.y, 2)
            )
          );
          // console.log(distance);
          newStation.PrevStation = { dist: distance, station: prev };
          prev.NextStation = { dist: distance, station: newStation };
        }
        prev = newStation;

        newStationsA.push(newStation);
      });

      newline.Stations = newStationsA;
      this.#lines.push(newline);
      this.#allStations = this.#allStations.concat(newStationsA);
    });
  }

  CreateLink(links) {
    console.log(links);
    links.forEach((link) => {
      let station1 = this.#allStations.find(
        (station) => station.Id == link.st1
      );
      let station2 = this.#allStations.find(
        (station) => station.Id == link.st2
      );

      let x1 = station1.Coordinate.x;
      let y1 = station1.Coordinate.y;
      let x2 = station2.Coordinate.x;
      let y2 = station2.Coordinate.y;

      let distance = Math.ceil(
        Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
      );

      let newLink = new Link(distance, [station1, station2]);
      station1.AddLink = newLink;
      station2.AddLink = newLink;
      this.#links.push(newLink);
    });
  }

  DrawSubway() {
    this.#ctx.clearRect(0, 0, 1000, 1000);
    this.#lines.forEach((line) => {
      line.DrawLine(this.#ctx);
    });

    this.#links.forEach((link) => {
      link.DrawLink(this.#ctx);
    });

    this.#allStations.forEach((station) => {
      station.DrawStation(this.#ctx);
    });
  }

  VisitAllLines(start) {
    // поиск кротчайшего пути с посещением всех линий
    let path = [];
    let unVisitedLine = this.#lines;

    let station = start;

    let i = 0;
    while (unVisitedLine.length > 0) {
      unVisitedLine = unVisitedLine.filter(
        (line) => line.Id != station.Line.Id
      );
      unVisitedLine = unVisitedLine.filter((line) => line.Visited != true);

      if (unVisitedLine.length == 0) break;
      this.FindShortWay(station);

      // console.log('unVisitedLine', unVisitedLine);

      let singleLinkStation = [];
      let multipleLinkStation = [];

      unVisitedLine.forEach((line) => {
        let linkSt = line.Stations.filter(
          (station) => station.Links.length > 0
        );
        // console.log(linkSt);

        if (linkSt.length == 1) {
          singleLinkStation = singleLinkStation.concat(linkSt);
        } else {
          multipleLinkStation = multipleLinkStation.concat(linkSt);
        }
      });

      singleLinkStation.sort((a, b) => a.Path.weight - b.Path.weight);
      // console.log('singleLinkStation', singleLinkStation);

      multipleLinkStation.sort((a, b) => a.Path.weight - b.Path.weight);
      // console.log('multipleLinkStation', multipleLinkStation);

      if (singleLinkStation.length > 0) {
        station = singleLinkStation[0];
      } else {
        station = multipleLinkStation[0];
      }

      let newPath = station.Path.path;
      newPath.forEach((station) => {
        station.Line.Visited = true;
      });

      path = path.concat(newPath);

      i++;
      if (i > 100) {
        break;
      }
    }
    path.push(station);
    console.log('path', path);
    this.DrawPath(path);
  }

  ResetPath() {
    // сброс просчитанных путей
    this.#allStations.forEach((station) => {
      station.Path = { visited: false, weight: Infinity, path: [] };
    });
  }

  FindShortWay(current) {
    // поиск кротчайшего пути от текущей станции до каждой
    this.ResetPath();
    current.Path = { weight: 0 };

    let unVisitedStations = this.#allStations;

    let stack = [];

    // let i = 0;
    while (unVisitedStations.length > 0) {
      current.Path = { visited: true };

      /* i++;
      if (unVisitedStations.length == 0) {
        clearInterval(interval);
      } */

      // console.log('current:', current.Id, current);

      // console.log('unVisitedStations', unVisitedStations);

      let possibleMove = [];

      let prev = current.PrevStation;
      let next = current.NextStation;
      let links = current.Links;

      unVisitedStations = unVisitedStations.filter(
        (station) => station != current
      );

      if (prev != undefined) {
        possibleMove.push(prev);
      }
      if (next != undefined) {
        possibleMove.push(next);
      }
      if (links != undefined) {
        // links.sort((a, b) => a.dist - b.dist);
        possibleMove = possibleMove.concat(links);
      }

      // console.log('possibleMove:', possibleMove);
      possibleMove = possibleMove.filter(
        (move) => move.station.Path.visited != true
      );

      if (possibleMove.length > 0) {
        this.Move(current, 0);
        let movesId = [];

        possibleMove.forEach((move) => {
          movesId.push(move.station.Id);

          let newWeight = current.Path.weight + move.dist;
          let weight = move.station.Path.weight;

          // weight = newWeight < weight ? newWeight : weight;

          if (newWeight < weight) {
            move.station.Path = {
              weight: newWeight,
              distOnPath: move.dist,
              path: current.Path.path.concat(current),
            };
          }
        });
        // console.log('possibleMove:', movesId.join(', '), possibleMove);

        stack.push(current);
        // console.log('add to Stack');

        possibleMove.sort((a, b) => a.dist - b.dist);

        current = possibleMove[0].station;
      } else {
        // console.log('no moves go back <--');
        this.Move(current, 1);

        current = stack.pop();
        // console.log('remove from Stack');
      }

      // console.log('stack', [...stack]);
    }
  }

  Move(station, type) {
    station.DrawMark(this.#ctx, type);
  }

  DrawPath(path, color = 'black', width = 6) {
    let ctx = this.#ctx;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    let i = 0;
    path.forEach((station) => {
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
