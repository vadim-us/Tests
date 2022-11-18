class Game {
    #images = { logo: undefined, reelsCover: undefined, reelBg: undefined, icon: [], win: [] };
    get images() {
        return this.#images;
    }

    #loadImages = { allNum: 21, loadNum: 0, showLoadNum: 0 };
    #logo;
    #maxGameSize = { width: 1067, height: 600 };
    #stage;
    get stage() {
        return this.#stage;
    }

    #reels;

    #fixIconA = [ // массив финальной комбинации иконок (0-8)
        [8, 1, 4, 1, 4],
        [7, 1, 3, 8, 6],
        [8, 7, 8, 3, 1]
    ];

    #winLines = {
        L1: { line: null, color: '#e1151f' },
        L2: { line: null, color: '#1f1daf' },
        L3: { line: null, color: '#20b33f' },
        L4: { line: null, color: '#e524c4' },
        L5: { line: null, color: '#ddce16' }
    };

    constructor(id) {
        this.#stage = new createjs.Stage(id);

        this.#includeOtherClass('Reels');
        this.#includeOtherClass('Reel');
        this.#includeOtherClass('Icon');

        this.#settingsCanvas();

        this.#loadGame();
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    #includeOtherClass(name) { // подключение дополнительных классов
        var js = document.createElement("script");
        js.src = `scripts/${name}.js`;
        document.body.appendChild(js);
    }

    #settingsCanvas() { // Исправление dpi canvas        
        var canvas = document.querySelector('#game');
        var sf = window.devicePixelRatio
        canvas.width = this.#maxGameSize.width * sf;
        canvas.height = this.#maxGameSize.height * sf;
    }

    #loadGame() { // начало загрузки

        for (let key in this.#images) { // загрузки всех изображений
            if (key == 'icon' || key == 'win') {
                for (let i = 0; i < 9; i++) {
                    loadImage(this.#images[key], i, key + (i + 1));
                }
                continue;
            }

            loadImage(this.#images, key);
        }

        function loadImage(images, key, fileName) { // загрузка изображения
            var img = document.createElement('img');

            if (fileName == undefined) {
                fileName = key
            }

            img.src = `images/${fileName}.png`;
            images[key] = img;

            img.onload = () => {
                game.#loadImages.loadNum++;
                if (fileName == 'logo') { game.#loadScreen(); } // переход на экран загрузки
            }
            img.onerror = (e) => {
                console.log(`файл ${fileName}.png не найден`);
            }
        }
    }

    #loadScreen() { // Экран загрузки

        createjs.Ticker.addEventListener("tick", update);

        function update(event) {
            game.#stage.update();
        }

        { // лого и прогресс загрузки
            var container = new createjs.Container();

            this.#logo = new createjs.Bitmap(this.#images.logo);
            var logoBounds = this.#logo.getBounds();

            var text = new createjs.Text('0 %', '48px MinionPro Regular', '#fff7a1');
            text.setTransform(logoBounds.width / 2, logoBounds.height);
            text.textAlign = 'center';

            container.addChild(this.#logo, text);

            var containerBounds = container.getBounds();

            container.setTransform(this.#maxGameSize.width / 2, this.#maxGameSize.height / 2);
            container.regX = containerBounds.width / 2;
            container.regY = containerBounds.height / 2;
        }

        this.#stage.addChild(container);

        { // обновление прогресса загрузки
            var percent = 0;
            var percentImage = 100 / this.#loadImages.allNum;

            var time = setInterval(() => {
                if (this.#loadImages.loadNum > this.#loadImages.showLoadNum) {

                    this.#loadImages.showLoadNum++;

                    percent = percentImage * this.#loadImages.showLoadNum;
                    text.text = `${Math.floor(percent)} %`;

                    if (percent >= 100) {
                        clearInterval(time);
                        setTimeout(() => {
                            this.#gameScreen(); // переход на экран игры
                        }, 200);
                    }
                }
            }, 50);
        }
    }

    #gameScreen() { // Экран игры после загрузки
        this.#stage.removeAllChildren();
        // createjs.Ticker.removeAllEventListeners();

        { // лого
            this.#logo.setTransform(this.#maxGameSize.width / 2, 10);
            this.#logo.regX = this.#logo.getBounds().width / 2;
        }

        var reelsCover = new createjs.Bitmap(this.#images.reelsCover); // фон

        { // кнопка спин
            var spinButton = new createjs.Container();

            var shape = new createjs.Shape();
            var shapeSize = { width: 150, height: 40 };
            shape.graphics.beginFill("#ff0000").drawRect(0, 0, shapeSize.width, shapeSize.height);

            var text = new createjs.Text('spin', '30px MinionPro Regular', '#ffffff');
            var textBounds = text.getBounds();
            text.setTransform(shapeSize.width / 2, shapeSize.height / 2);

            text.textAlign = 'center';
            text.textBaseline = 'middle';

            spinButton.addChild(shape, text);

            spinButton.setTransform(this.#maxGameSize.width / 2, this.#maxGameSize.height - 45);
            spinButton.regX = shapeSize.width / 2;
        }

        this.#reels = new Reels();

        this.#stage.addChild(this.#reels.html, reelsCover, drawWinLine(), this.#logo, spinButton);

        spinButton.addEventListener("click", spin);

        function spin() {
            for (let key in game.#winLines) {
                game.#winLines[key].line.visible = false;
            }

            spinRUN(true);
        }

        function spinRUN(random) { // запуск спина
            if (random) {
                game.#reels.spinReels(game.#genFinalIconA()); // cо случайным финалом
            } else {
                game.#reels.spinReels(game.#fixIconA); // c фиксированным финалом
            }
        }

        function drawWinLine() { // рисует победные линии
            var lines = new createjs.Container();

            for (let key in game.#winLines) {
                var graphics = new createjs.Graphics().setStrokeStyle(3);

                switch (key) {
                    case 'L1':
                        graphics.beginStroke(game.#winLines[key].color).moveTo(80, 173).lt(987, 173);
                        break;
                    case 'L2':
                        graphics.beginStroke(game.#winLines[key].color).moveTo(80, 329).lt(987, 329);
                        break;
                    case 'L3':
                        graphics.beginStroke(game.#winLines[key].color).moveTo(80, 484).lt(987, 484);
                        break;
                    case 'L4':
                        graphics.beginStroke(game.#winLines[key].color).moveTo(80, 173).lt(180, 173).lt(533.5, 484).lt(907, 173).lt(987, 173);
                        break;
                    case 'L5':
                        graphics.beginStroke(game.#winLines[key].color).moveTo(80, 484).lt(180, 484).lt(533.5, 173).lt(907, 484).lt(987, 484);
                        break;
                }

                var line = new createjs.Shape(graphics);
                line.visible = false;
                game.#winLines[key].line = line;
                lines.addChild(line);
            }
            return lines;
        }
    }

    #genFinalIconA() { // генерирует случайный финал
        var finalIconA = [];
        for (let i = 0; i < 3; i++) {
            finalIconA[i] = [];
            for (let i2 = 0; i2 < 5; i2++) {
                finalIconA[i].push(Game.getRandomInt(0, 9));
            }
        }
        return finalIconA;
    }

    checkWin(finalIconClassA) { // проверка выигрыша
        for (let key in this.#winLines) {
            winIcon(key, CheckLine(key));
        }

        function CheckLine(lineName) { // проверка линий
            var lineObj = {}; // в процессе будет содержать ID : { num: число повторов, iconA: [массив классов иконок] };

            switch (lineName) {
                case 'L1':
                    findRepeats(lineObj, lineName, 0);
                    break;
                case 'L2':
                    findRepeats(lineObj, lineName, 1);
                    break;
                case 'L3':
                    findRepeats(lineObj, lineName, 2);
                    break;
                case 'L4':
                case 'L5':
                    for (let i = 0; i < 3; i++) {
                        findRepeats(lineObj, lineName, i);
                    }
                    break;
            }
            return lineObj;
        }

        function findRepeats(lineObj, lineName, i) { // сбор сведений о повторах
            for (let i2 = 0; i2 < 5; i2++) {
                if (
                    (lineName == 'L4' && !((i == 0 && (i2 == 0 || i2 == 4)) || (i == 1 && (i2 == 1 || i2 == 3)) || (i == 2 && i2 == 2))) ||
                    (lineName == 'L5' && !((i == 0 && i2 == 2) || (i == 1 && (i2 == 1 || i2 == 3)) || (i == 2 && (i2 == 0 || i2 == 4))))
                ) {
                    continue;
                }

                var id = finalIconClassA[i][i2].iconId;

                if (lineObj[id] == undefined) {
                    lineObj[id] = { num: 0, iconA: [] };
                }

                lineObj[id].num++;
                lineObj[id].iconA.push(finalIconClassA[i][i2]);
            }
        }

        function winIcon(lineName, lineObj) { // поиск и запуск анимации выигрышных иконок
            for (let key in lineObj) {
                if (lineObj[key].num >= 2) {

                    lineObj[key].iconA[0].showWinBox();
                    game.#winLines[lineName].line.visible = true;
                    for (let key2 in lineObj[key].iconA) {
                        lineObj[key].iconA[key2].showWinBox();
                    }
                }
            }
        }
    }

    reset() { // перезапуск без загрузки для отладки (можно удалить)
        this.#gameScreen();
    }
}

const game = new Game("game");