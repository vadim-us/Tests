class Graf {
  #subway;

  // входные данные
  #inputData = {
    lines: [
      {
        line: { color: 'red' },
        stations: [
          { x: 40, y: 490 }, // name: 'name'
          { x: 40, y: 420 },
          { x: 70, y: 350 },
          { x: 180, y: 170 },
          { x: 340, y: 280 },
          { x: 400, y: 350 },
          { x: 400, y: 500 },
          { x: 450, y: 550 },
        ],
      },
      {
        line: { color: 'blue' },
        stations: [
          { x: 20, y: 340 },
          { x: 70, y: 330 },
          { x: 200, y: 290 },
          { x: 330, y: 300 },
          { x: 500, y: 250 },
          { x: 550, y: 200 },
          { x: 570, y: 100 },
        ],
      },
      {
        line: { color: 'orange' },
        stations: [
          { x: 20, y: 100 },
          { x: 70, y: 100 },
          { x: 180, y: 130 },
          { x: 350, y: 150 },
          { x: 480, y: 230 },
          { x: 430, y: 350 },
          { x: 300, y: 500 },
        ],
      },
      {
        line: { color: 'green' },
        stations: [
          { x: 100, y: 580 },
          { x: 200, y: 550 },
          { x: 200, y: 500 },
          { x: 160, y: 400 },
          { x: 200, y: 310 },
          { x: 250, y: 250 },
          { x: 230, y: 120 },
          { x: 270, y: 80 },
          { x: 350, y: 50 },
          { x: 500, y: 150 },
        ],
      },
      {
        line: { color: 'gray' },
        stations: [
          { x: 50, y: 150 },
          { x: 220, y: 180 },
          { x: 310, y: 280 },
          { x: 400, y: 570 },
        ],
      },
      {
        line: { color: '#ad00b3' },
        stations: [
          { x: 500, y: 50 },
          { x: 400, y: 50 },
          { x: 320, y: 110 },
          { x: 250, y: 170 },
          { x: 370, y: 250 },
          { x: 500, y: 400 },
        ],
      },
      {
        line: { color: '#00969b' },
        stations: [
          { x: 600, y: 550 },
          { x: 500, y: 500 },
          { x: 410, y: 480 },
          { x: 300, y: 450 },
          { x: 200, y: 480 },
          { x: 100, y: 480 },
          { x: 80, y: 500 },
        ],
      },
      {
        line: { color: '#a8124b' },
        stations: [
          { x: 670, y: 200 },
          { x: 620, y: 300 },
          { x: 650, y: 500 },
          { x: 620, y: 550 },
          { x: 550, y: 650 },
        ],
      },
    ],
    links: [
      {
        st1: 'l0_s2',
        st2: 'l1_s1',
      },
      {
        st1: 'l0_s3',
        st2: 'l2_s2',
      },
      {
        st1: 'l0_s3',
        st2: 'l3_s6',
      },
      {
        st1: 'l0_s3',
        st2: 'l4_s1',
      },
      {
        st1: 'l0_s4',
        st2: 'l1_s3',
      },
      {
        st1: 'l0_s4',
        st2: 'l4_s2',
      },
      {
        st1: 'l0_s5',
        st2: 'l2_s5',
      },
      {
        st1: 'l1_s2',
        st2: 'l3_s4',
      },
      {
        st1: 'l1_s3',
        st2: 'l4_s2',
      },
      {
        st1: 'l1_s4',
        st2: 'l2_s4',
      },
      {
        st1: 'l2_s2',
        st2: 'l3_s6',
      },
      {
        st1: 'l4_s1',
        st2: 'l3_s6',
      },
      {
        st1: 'l5_s3',
        st2: 'l3_s6',
      },
      {
        st1: 'l5_s3',
        st2: 'l4_s1',
      },
      {
        st1: 'l6_s4',
        st2: 'l3_s2',
      },
      {
        st1: 'l6_s2',
        st2: 'l0_s6',
      },
      {
        st1: 'l7_s3',
        st2: 'l6_s0',
      },
    ],
  };

  #inputData2 = {
    lines: [
      {
        line: { color: 'red' },
        stations: [
          { x: 100, y: 550 },
          { x: 100, y: 500 },
          { x: 90, y: 400 },
          { x: 90, y: 300 },
          { x: 110, y: 250 },
          { x: 150, y: 200 },
          { x: 190, y: 180 },
          { x: 220, y: 200 },
          { x: 250, y: 250 },
          { x: 260, y: 300 },
          { x: 260, y: 350 },
          { x: 260, y: 400 },
        ],
      },
      {
        line: { color: 'blue' },
        stations: [
          { x: 40, y: 215 },
          { x: 50, y: 320 },
          { x: 105, y: 320 },
          { x: 190, y: 320 },
          { x: 275, y: 320 },
          { x: 330, y: 300 },
          { x: 390, y: 255 },
        ],
      },
      {
        line: { color: 'orange' },
        stations: [
          { x: 350, y: 105 },
          { x: 410, y: 155 },
          { x: 415, y: 245 },
          { x: 420, y: 305 },
          { x: 440, y: 385 },
        ],
      },
      {
        line: { color: 'green' },
        stations: [
          { x: 50, y: 510 },
          { x: 120, y: 520 },
          { x: 200, y: 550 },
          { x: 240, y: 570 },
        ],
      },
      {
        line: { color: 'gray' },
        stations: [
          { x: 50, y: 450 },
          { x: 30, y: 500 },
          { x: 50, y: 600 },
        ],
      },
      {
        line: { color: 'orange' },
        stations: [
          { x: 120, y: 410 },
          { x: 150, y: 450 },
          { x: 200, y: 450 },
        ],
      },
    ],
    links: [
      {
        st1: 'l0_s1',
        st2: 'l3_s1',
      },
      {
        st1: 'l0_s3',
        st2: 'l1_s2',
      },
      {
        st1: 'l0_s9',
        st2: 'l1_s4',
      },
      {
        st1: 'l1_s6',
        st2: 'l2_s2',
      },
      {
        st1: 'l3_s0',
        st2: 'l4_s1',
      },
      {
        st1: 'l0_s2',
        st2: 'l5_s0',
      },
    ],
  };

  constructor() {
    let canvas = document.getElementById('metro-map-canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');

    this.#subway = new Subway(
      ctx,
      this.#inputData.lines,
      this.#inputData.links
    );
  }
}

const graf = new Graf();
