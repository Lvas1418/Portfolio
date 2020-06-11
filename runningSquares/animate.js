// Анимация
class Animate {
    constructor() {

    }

    // Отрисовывает видимые квадратики
    startDraw() {
        //Ранний выход. Если массив с квадратиками пуст, то выходим.
        if (!this.arr.length)
            return;

        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);

        for (let i = 0; i <= 16; i++) {

            if (this.arr[i].visible) {

                this.ctx.fillStyle = this.arr[i].color; //Берем цвет квадратика для отрисовки
                this.arr[i].yPosition += this.arr[i].speed;   //Смещаем квадратик на величину его скорости

                //Если квадратик выходит за игровое поле, то возвращаем его на начальную позицию
                if (this.arr[i].yPosition >= this.canvas.clientHeight)
                    this.arr[i].yPosition = 0;

                this.ctx.fillRect(this.arr[i].xPosition, this.arr[i].yPosition, this.arr[i].width, this.arr[i].height);
            }
        }
        this.stopId = requestAnimationFrame(this.animate.startDraw.bind(this));
    };

    // Останавливает анимацию, затирает игровое поле
    stopDraw() {

        cancelAnimationFrame(this.stopId);
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);

    }

    //Выводит сообщение "You win"
    win() {

        this.ctx.font = "80px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText("You win", this.canvas.width / 2, this.canvas.height / 2);

    }
}

let _animate = new Animate();