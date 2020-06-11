class Square {

    //Конструктор для квадратиков
    constructor(xPosition, yPosition, width, height, color, speed) {

        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.visible = false;
        this.color = color;
        this.speed = speed;

    }

    //Создает экземпляры квадратиков и помещает их в массив
    create(xPosition, yPosition, width, height, color, speed) {
        return  new Square(xPosition, yPosition, width, height, color, speed);
    };
}
