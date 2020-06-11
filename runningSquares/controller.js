class Game {
    constructor(squares, canvas, animate) {

        this.squares = squares;
        this.animate = animate;
        this.canvas = canvas.link;
        this.ctx = this.canvas.getContext('2d');

        this.arr = [];
        this.scoreLabel = document.getElementById('score');
        this.score = 0;
    }

    startGame() {

        if (!this.arr.length) {
            this.squares.creatSquars(this.arr);
            this.squares.randomAppearance(this.arr);
            this.animate.startDraw.call(this);
        }
    }

    stopGame() {

        this.squares.destructionSquars(this.arr);
        this.animate.stopDraw.call(this);
        this.score = 0;
        this.scoreLabel.innerText = String(this.score);

    };

    clickOnCanvas(e, canvas) {

        if (canvas.shot(e, this.arr)) {
            ++this.score;
            this.scoreLabel.innerText = String(this.score);
        }

        if (this.score == 16) {
            this.stopGame();
            this.animate.win.call(this);
        }
    };

}

let game = new Game(_squares, _canvas, _animate);
