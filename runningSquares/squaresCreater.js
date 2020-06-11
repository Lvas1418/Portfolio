class Squares {

    constructor() {
    }

    static getColor() {

        let a;
        let b;
        let c;

        a = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        c = Math.floor(Math.random() * 255);
        return `rgb(${a}, ${b}, ${c})`;
    }

    static getSpeed() {
        return Math.random() * 5 + 1;
    }

    //Создает экземпляры квадратиков и помещает их в массив
    creatSquars(arr) {
        let
            xPosition,
            yPosition = 0,
            width = 35,
            height = 35,
            color,
            speed,
            square;

        for (let i = 0; i <= 16; i++) {
            xPosition = i * (35 + 5);
            color = this.constructor.getColor();
            speed = this.constructor.getSpeed();
            square = Square.prototype.create(xPosition, yPosition, width, height, color, speed);
            arr.push(square);
        }

    };

    //Задает квадратикам случайное время появления
    randomAppearance(arr) {

        arr.forEach(function (item, i, arr) {
            setTimeout(function () {
                item.visible = true;
            }, Math.floor(Math.random() * 5000) + 1);
        });

    }

    //Очищает массив с квадратиками
    destructionSquars(arr) {

        arr.length = 0;

    }

}

let _squares = new Squares();
