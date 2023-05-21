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

    console.log('links', this.#links);
    console.log('lines', this.#lines);
    console.log('allStations', this.#allStations);

    this.CreateLink(links);

    this.DrawSubway();

    let startID = window.location.search.replace(/.+map=(.+)&id=(.+)/, '$2');
    if (startID == '') startID = 'l0_s1';
    document.getElementById('station').value = startID;

    let start = this.#allStations.find((station) => station.Id == startID);
    this.VisitAllLines(start);
    // this.FindShortWay(start);
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
    while (true) {
      // удаляет текущею линию
      unVisitedLine = unVisitedLine.filter(
        (line) => line.Id != station.Line.Id
      );
      // удаляет посещенные линии
      unVisitedLine = unVisitedLine.filter((line) => line.Visited != true);

      if (unVisitedLine.length == 0) break;

      this.FindShortWay(station);

      console.log('unVisitedLine', unVisitedLine);

      // let singleLinkStation = [];
      // let multipleLinkStation = [];

      // ближайшие пересадки
      let nearestTransferStations = [];

      unVisitedLine.forEach((line) => {
        // только станции с пересадками
        let linkSt = line.Stations.filter(
          (station) => station.Links.length > 0
        );
        console.log(linkSt);

        // сортировка по весу
        // linkSt.sort((a, b) => a.Path.weight - b.Path.weight);

        // добавление ближайшей на линии
        nearestTransferStations = nearestTransferStations.concat(linkSt);

        /* if (linkSt.length == 1) {
          singleLinkStation = singleLinkStation.concat(linkSt);
        } else {
          multipleLinkStation = multipleLinkStation.concat(linkSt);
        } */
      });

      // сортировка по весу
      nearestTransferStations.sort((a, b) => a.Path.weight - b.Path.weight);

      // следующей становится самая ближайшая
      station = nearestTransferStations[0];
      console.log('nearestTransferStations', nearestTransferStations);

      /* singleLinkStation.sort((a, b) => a.Path.weight - b.Path.weight);
      console.log('singleLinkStation', singleLinkStation);

      multipleLinkStation.sort((a, b) => a.Path.weight - b.Path.weight);
      console.log('multipleLinkStation', multipleLinkStation); */

      /* if (singleLinkStation.length > 0) {
        station = singleLinkStation[0];
      } else {
        station = multipleLinkStation[0];
      } */

      let newPath = station.Path.path;
      newPath.forEach((station) => {
        station.Line.Visited = true;
      });

      path = path.concat(newPath);
    }
    path.push(station);
    console.log('path', path);
    this.DrawPath(path);

    path = path.map((a) => a.Id);
    console.log(path);
    document.getElementById('path').value = path.join(' --> ');
  }

  ResetPath() {
    // сброс просчитанных путей
    this.#allStations.forEach((station) => {
      station.Path = { /*visited: false,*/ weight: Infinity, path: [] };
    });
  }

  FindShortWay(current) {
    // поиск кротчайшего пути от текущей станции до каждой
    this.ResetPath();
    current.Path = { weight: 0 };

    // let unVisitedStations = this.#allStations;

    let queue = [];

    while (true) {
      // current.Path = { visited: true };

      // unVisitedStations = unVisitedStations.filter(
      //   (station) => station != current
      // );

      console.log('\n! current:', current.Id, current);
      // console.log('unVisitedStations', unVisitedStations);

      let possibleWays = [];
      let prev = current.PrevStation;
      let next = current.NextStation;
      let links = current.Links;

      if (prev != undefined) {
        possibleWays.push(prev);
      }
      if (next != undefined) {
        possibleWays.push(next);
      }
      if (links != undefined) {
        possibleWays = possibleWays.concat(links);
      }
      console.log('possibleWays:', possibleWays);

      /* possibleMove = possibleMove.filter(
        (move) => move.station.Path.visited != true
      ); */

      if (possibleWays.length > 0) {
        possibleWays.sort((a, b) => a.dist - b.dist);

        // current.DrawMark(this.#ctx, 0);

        let waysId = [];

        possibleWays.forEach((way) => {
          waysId.push(way.station.Id);

          let newWeight = current.Path.weight + way.dist;
          let weight = way.station.Path.weight;

          // добавление в очередь любой станции если путь стал короче
          if (newWeight < weight) {
            way.station.Path = {
              weight: newWeight,
              path: current.Path.path.concat(current),
            };
            queue.push(way.station);
            console.log('add to queue:', way.station);
          }
        });
        // console.log('possibleMove:', movesId.join(', '), possibleMove);
      }

      console.log('queue:', ...queue);

      if (queue.length > 0) {
        current = queue.shift();
      } else {
        break;
      }

      // console.log('stack', [...stack]);
    }

    let stations_path = [];
    this.#allStations.forEach((station) => {
      let id = { id: station.Id };
      // id += station.Path;
      stations_path.push(Object.assign(id, station.Path));
    });
    console.log('stations_path:', stations_path);
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
