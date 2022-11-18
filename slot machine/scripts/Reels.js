class Reels {
    #html;
    get html() {
        return this.#html;
    }

    #reels = [{ cont: null, reelA: [], run: false }]; // данные о отдельных рейсов

    #spinTimer; // таймер
    #spinRun = false; // индикатор остановки таймера

    #speedReel = [1, 1.2, 1.5, 0.8, 1.6]; //время в секундах для прокрутки отдельных блоков иконок

    constructor() {
        this.#generateReels();
    }

    #generateReels() {
        this.#html = new createjs.Container();
        this.#html.setTransform(55, 95);

        for (let i = 0; i < 5; i++) {
            var reelCont = new createjs.Container();
            var reel = new Reel();
            reelCont.setTransform((12 + Reel.size.width) * i, 0);
            reelCont.addChild(reel.html);


            this.#html.addChild(reelCont);
            this.#reels[i] = { cont: reelCont, reelA: [reel], run: false };
        }
    }

    spinReels(finalIconA) { // передается финальная комбинация
        this.#spinRun = true;
        clearTimeout(this.#spinTimer);
        this.#spinTimer = setTimeout(() => { // отсчет 5 секунд от последнего нажатия
            // будут крутится все что не остановились
            this.#spinRun = false;
        }, 5000);

        if (this.#reels[0].run || this.#reels[1].run || this.#reels[2].run || this.#reels[3].run || this.#reels[4].run) {
            // блокировка запуска если хоть один рил крутится
            return;
        }

        var thisClass = this;

        var offset = [];

        for (let i = 0; i < 5; i++) { // запуск вращения рилов
            offset[i] = Reel.size.height;
            this.#reels[i].run = true;
            spinReel(i);
        }

        function spinReel(index, stop) { // вращение одного рила

            addReelBlock(index);

            createjs.Tween.get(thisClass.#reels[index].cont).to({ y: offset[index] }, thisClass.#speedReel[index] * 1000, createjs.Ease.linear).call(delReelBlock);
            offset[index] += Reel.size.height;

            function addReelBlock() { // добавление нового блока иконок
                var reel;

                if (thisClass.#spinRun) {
                    reel = new Reel();
                } else {
                    reel = new Reel(true, finalIconA, index);
                }

                thisClass.#reels[index].reelA.push(reel);

                reel.html.y = -offset[index];
                thisClass.#reels[index].cont.addChild(reel.html);
            }

            function delReelBlock() { // удаление блока иконок
                var reel = thisClass.#reels[index].reelA.shift();
                reel.remove();

                if (thisClass.#spinRun) {
                    spinReel(index);
                } else {

                    if (stop) {
                        thisClass.#reels[index].cont.y = 0;
                        thisClass.#reels[index].reelA[0].html.y = 0;
                        thisClass.#reels[index].run = false;
                        thisClass.#AllStop();
                        return;
                    }

                    spinReel(index, true);
                }
            }
        }
    }

    #AllStop() { // после окончательной остановки генерирует массив классов иконок
        if (!(this.#reels[0].run || this.#reels[1].run || this.#reels[2].run || this.#reels[3].run || this.#reels[4].run)) {

            var returnA = [];

            for (let i = 0; i < 3; i++) {
                returnA[i]=[];
                for (let i2 = 0; i2 < 5; i2++) {
                    returnA[i].push(this.#reels[i2].reelA[0].icons[i]);
                }
            }

            game.checkWin(returnA);
        }
    }
}