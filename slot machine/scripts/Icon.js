class Icon {
    #html
    get html() {
        return this.#html;
    }

    #iconId;
    get iconId() {
        return this.#iconId;
    }

    #winBox;

    static scale = .75;
    static size = { width: 160, height: 144 };
    static cellY = Reel.size.height / 3;

    constructor(iconId) {
        this.#iconId = iconId;
        this.#html = new createjs.Container();

        var icon = new createjs.Bitmap(game.images.icon[iconId]);
        icon.setTransform(0, Icon.cellY / 2, Icon.scale, Icon.scale);
        icon.regX = icon.getBounds().width / 2;
        icon.regY = icon.getBounds().height / 2;

        var winBox = new createjs.Bitmap(game.images.win[iconId]);
        winBox.setTransform(0, Icon.cellY / 2, 0, 0);
        winBox.regX = winBox.getBounds().width / 2;
        winBox.regY = winBox.getBounds().height / 2;

        winBox.visible=false;

        this.#html.x = Reel.size.width / 2;

        this.#html.addChild(winBox, icon);
        this.#winBox = winBox;
    }

    showWinBox() { // отображение выигрышных иконок
        this.#winBox.visible = true;
        createjs.Tween.get(this.#winBox).to({ scale: 1 }, 500, createjs.Ease.linear);
    }
}