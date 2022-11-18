class Reel {
    #html;
    get html() {
        return this.#html;
    }

    #icons = [];
    get icons() {
        return this.#icons;
    }

    static size = { width: 183, height: 466 };

    constructor(spinStop, finalIconA, index) {
        this.#html = new createjs.Container();
        var reelBg = new createjs.Bitmap(game.images.reelBg);

        this.#html.addChild(reelBg);

        this.#addIcons(this.#html, spinStop, finalIconA, index);
    }

    #addIcons(reel, spinStop, finalIconA, index) { // добавление иконок в блок рейса
        for (let i = 0; i < 3; i++) {
            var random;
            if (spinStop) {
                random = finalIconA[i][index];
            } else {
                random = Game.getRandomInt(0, 9);
            }
            var icon = new Icon(random);

            
            icon.html.y = Icon.cellY * i;

            reel.addChild(icon.html);
            this.#icons[i] = icon;
        }
    }

    remove() {
        this.#html.parent.removeChild(this.#html);
    }
}