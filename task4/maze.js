(function () {

    init = {
        inputX: document.getElementById("inpX"),
        inputY: document.getElementById("inpY"),
        buttonStart: document.getElementById('start'),
        buttonFindFinish: document.getElementById('find'),
        canvas: document.getElementById('canvas'),
        ctx: this.canvas.getContext('2d'),
        startPosition: [],
        finishPosition: [],
        path: [],
        lineFromX: 0,
        lineFromY: 0,
        lineToX: 0,
        lineToY: 0,
        arr: [],
        intersection: [],
        x: 0,
        y: 0,
        sizeOfFieldX: 0,
        sizeOfFieldY: 0,
        sizeOfSquar: 30,
        lineW: 30,
    };

    class Game {
        constructor() {
            this.init = init;
            this.init.buttonStart.addEventListener('click', this.startGame.bind(this));
            this.init.buttonFindFinish.addEventListener('click', this.findFinish.bind(this));
            this.init.canvas.addEventListener('click', this.setStartFinishWalls.bind(this));
        }

        startGame() {
            this.setFieldSize();
            this.drawField(this.init.sizeOfFieldX, this.init.sizeOfFieldY);
            this.creatMatrix(this.init.sizeOfFieldX, this.init.sizeOfFieldY);
            this.makeDoorsInMatrix(this.init.sizeOfFieldX, this.init.sizeOfFieldY, 0, 0);
            this.drawWalls();
            this.init.startPosition = [];
            this.init.finishPosition = [];

        }

        setFieldSize() {
            this.init.sizeOfFieldX = parseInt(this.init.inputX.value);
            this.init.sizeOfFieldY = parseInt(this.init.inputY.value);
        };

        //отрисовываем поле с сеткой
        drawField(sfX, sfY) {
            const lineW = this.init.lineW;
            const sizeOfSquar = this.init.sizeOfSquar;
            const ctx = this.init.ctx;
            const canvas = this.init.canvas;
            //Задаем размер поля
            canvas.width = (lineW + sizeOfSquar) * (sfY - 1) + sizeOfSquar + lineW * 2;
            canvas.height = (lineW + sizeOfSquar) * (sfX - 1) + sizeOfSquar + lineW * 2;
            ctx.fillStyle = '#222';
            ctx.lineWidth = lineW;

            //Отрисовываем рамку игрового поля
            ctx.strokeRect(lineW / 2, lineW / 2, canvas.width - lineW, canvas.height - lineW);


        };

        creatMatrix(sfX, sfY) {
            let arr = new Array(sfX * 2 + 1);
            for (let i = 0; i <= arr.length - 1; i++) {
                arr[i] = new Array(sfY * 2 + 1);
            }

            //Делаем внешние стены, каждая ячейка будет иметь значение -2
            for (let i = 0; i <= sfY * 2; i++) {
                arr[0][i] = -2;
                arr[arr.length - 1][i] = -2;
            }
            for (let i = 0; i <= sfX * 2; i++) {
                arr[i][0] = -2;
                arr[i][sfY * 2] = -2;
            }

            //заполняем ячейки
            let t = sfX * 2 - 1;
            let u = sfY * 2 - 1;

            while (t > 0) {
                while (u > 0) {
                    arr[t][u] = -1;
                    u -= 1;
                }
                t -= 1;
                u = sfY * 2 - 1;
            }
            this.init.arr = arr;
        };

        makeDoorsInMatrix(sfX, sfY, shX, shY) {
            let intersectionX;
            let intersectionY;
            let x = this.init.x;
            let y = this.init.y;
            let arr = this.init.arr;
            let intersection = this.init.intersection;

            function wall() {
                let intersectionX;
                let intersectionY;
                let x = this.init.x;
                let y = this.init.y;
                let arr = this.init.arr;
                let intersection = this.init.intersection;
                // стены в матрице обозначены значением '-5', а двери'-4'
                //стена по х
                while (arr[x][y] != -2 && arr[x][y] != -5) {
                    if (arr[x][y] != -4) {
                        arr[x][y] = -5;
                        y += 1;
                    }
                    else {
                        y += 1;
                    }
                }
                y = intersection[1] - 1;
                while (arr[x][y] != -2 && arr[x][y] != -5) {
                    if (arr[x][y] != -4) {
                        arr[x][y] = -5;
                        y -= 1;
                    }
                    else {
                        y -= 1;
                    }
                }
                //стена по у
                y = intersection[1];
                x = intersection[0] + 1;
                while (arr[x][y] != -2 && arr[x][y] != -5) {
                    if (arr[x][y] != -4) {
                        arr[x][y] = -5;
                        x += 1;
                    }
                    else {
                        x += 1;
                    }
                }
                x = intersection[0] - 1;
                while (arr[x][y] != -2 && arr[x][y] != -5) {
                    if (arr[x][y] != -4) {
                        arr[x][y] = -5;
                        x -= 1;
                    }
                    else {
                        x -= 1;

                    }
                }
            }

            //если матрица имеет размер 2х2, то сразу прорезаем двери
            if (sfX == 2 || sfY == 2) {
                arr[2][1] = -4;
                arr[3][2] = -4;
                arr[2][3] = -4;
                this.init.intersection = [2, 2];
                this.init.x = this.init.intersection[0];
                this.init.y = this.init.intersection[1];
                wall.call(this);
            }
            //если матрица имеет размер больше, чем 2х2, то:
            //1) Берем случайные строку и столбец, разделив тем самым матрицу на меньшие матрицы,
            //2) В выбранной строке и столбце прорезаем три двери
            //3) получившиеся в результате деления мартицы подвергаем  пунктам 1 и 2, пока размер полученных матриц не будет 2х2
            // В теории было так, а на практике почти так
            else {
                //помещаем в два двумерных массива возможные позиции дверей
                let arrXYForHorizontalWals = [];
                let arrXYForVerticallWals = [];
                let u = sfY * 2 - 1;
                let t = sfX * 2 - 2;

                let numberOfWall = sfX - 2;
                let n;
                //получаем массив с позициями вертикальных стен
                while (t > 0) {
                    arrXYForVerticallWals[numberOfWall] = [];
                    n = sfY - 1;
                    while (u > 0) {
                        arrXYForVerticallWals[numberOfWall][n] = [t, u];
                        u -= 2;
                        n -= 1;
                    }
                    numberOfWall -= 1;
                    t -= 2;
                    u = sfY * 2 - 1;
                }
                //получаем массив с позициями горизонтальных стен
                u = sfX * 2 - 1;
                t = sfY * 2 - 2;
                numberOfWall = sfY - 2;
                while (t > 0) {
                    arrXYForHorizontalWals[numberOfWall] = [];
                    n = sfX - 1;
                    while (u > 0) {
                        arrXYForHorizontalWals[numberOfWall][n] = [u, t];
                        u -= 2;
                        n -= 1;
                    }
                    numberOfWall -= 1;
                    t -= 2;
                    u = sfX * 2 - 1;
                }

                //генерирует случайное число от '0' до 'max'
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                // выбираем случайный столбец и строку из массивов вертикальных и горизонтальных позиций соответственно
                function takeTwoArraysFromWallsPositions(arr1, arr2) {
                    let n1;
                    let n2;
                    n1 = getRandomInt(arr1.length - 1);
                    n2 = getRandomInt(arr2.length - 1);
                    return [arr1[n1], arr2[n2]];

                }

                let twoArr = takeTwoArraysFromWallsPositions(arrXYForVerticallWals, arrXYForHorizontalWals);


                // произвольно выбираем, где прорезать две двери в горизонтали или вертикали
                function doors(arr) {
                    let rep = 0;
                    let dg;
                    let dv;

                    function makeDoors(pos) {
                        this.init.arr[pos[0]][pos[1]] = -4;
                    }

                    function separ() {
                        //разбиваем поле на 4 части и берем их размеры если они не равны 1
                        let leftTopX;
                        let leftTopY;
                        let shiftX;
                        let shiftY;
                        if (intersectionX / 2 > 1 && intersectionY / 2 > 1) {
                            leftTopX = Math.ceil(intersectionX / 2);
                            leftTopY = Math.ceil(intersectionY / 2);
                            shiftX = shX;
                            shiftY = shY;
                            this.makeDoorsInMatrix.call(this, leftTopX, leftTopY, shiftX, shiftY);

                        }
                    }

                    if (getRandomInt(2)) {

                        // прорезаем одну дверь по вертикали
                        dv = getRandomInt(arr[0].length - 1);
                        makeDoors.call(this, arr[shX][dv + shY]);

                        // прорезаем две двери по горизонтали
                        dg = getRandomInt(arr[1].length - 1);
                        makeDoors.call(this, arr[1 + shX][dg + shY]);
                        rep = dg;
                        dg = getRandomInt(arr[1].length - 1);
                        while (arr[1][rep][0] < arr[0][dv][0] && arr[1][dg][0] < arr[0][dv][0] ||
                        arr[1][rep][0] > arr[0][dv][0] && arr[1][dg][0] > arr[0][dv][0] || dg == rep) {
                            dg = getRandomInt(arr[1].length - 1);
                        }
                        makeDoors.call(this, arr[1 + shX][dg + shY]);
                        intersectionX = arr[0][dv][0];
                        intersectionY = arr[1][dg][1];
                        separ.call(this);
                        return [arr[0][dv][0], arr[1][dg][1]];
                    } else {

                        // прорезаем одну дверь по горизонтали
                        dg = getRandomInt(arr[1].length - 1);
                        makeDoors.call(this, arr[1 + shX][dg + shY]);

                        // прорезаем две двери по вертикали
                        dv = getRandomInt(arr[0].length - 1);
                        makeDoors.call(this, arr[shX][dv + shY]);
                        rep = dv;
                        dv = getRandomInt(arr[0].length - 1);
                        while (arr[0][rep][1] < arr[1][dg][1] && arr[0][dv][1] < arr[1][dg][1] ||
                        arr[0][rep][1] > arr[1][dg][1] && arr[0][dv][1] > arr[1][dg][1] || dv == rep) {
                            dv = getRandomInt(arr[0].length - 1);
                        }
                        makeDoors.call(this, arr[shX][dv + shY]);
                        intersectionX = arr[0][dv][0];
                        intersectionY = arr[1][dg][1];
                        separ.call(this);
                        return [arr[0][dv][0], arr[1][dg][1]];

                    }
                }

                this.init.intersection = doors.call(this, twoArr);
                this.init.x = this.init.intersection[0];
                this.init.y = this.init.intersection[1];
                wall.call(this);
            }
        }; //makeDoorsInMatrix

        //трисовываем стены там, где в матрице стои значение -5
        drawWalls() {
            let ctx = this.init.ctx;
            let lineW = this.init.lineW;
            let sizeOfSquar = this.init.sizeOfSquar;
            for (let i = 0; i <= this.init.sizeOfFieldY * 2; i++) {
                for (let j = 0; j <= this.init.sizeOfFieldX * 2; j++) {
                    if (this.init.arr[j][i]) {
                        if (this.init.arr[j][i] == -5) {
                            ctx.fillStyle = '#666699';
                            ctx.fillRect(lineW * i, lineW * j, sizeOfSquar, sizeOfSquar);
                        }
                    }
                }
            }
        };

        setStartFinishWalls(e) {
            let x;
            let y;
            const ctx = this.init.ctx;
            const lineW = this.init.lineW;
            const sizeOfSquar = this.init.sizeOfSquar;
            x = Math.floor(e.offsetY / lineW);
            y = Math.floor(e.offsetX / lineW);

            //устанавливаем позицию старта в матрицу, и отрисовываем ее
            if (this.init.startPosition.length == 0) {
                ctx.fillStyle = "green";
                this.init.startPosition = [x, y];
                ctx.fillRect(lineW * y, lineW * x, sizeOfSquar, sizeOfSquar);
                this.init.arr[x][y] = 0;
            } else {
                //устанавливаем позицию финиша в матрицу, и отрисовываем ее
                if (this.init.finishPosition.length == 0) {
                    ctx.fillStyle = "red";
                    this.init.finishPosition = [x, y];
                    ctx.fillRect(lineW * y, lineW * x, sizeOfSquar, sizeOfSquar);
                    this.init.arr[x][y] = -11;
                }
            }
            //если старт и финиш установлены, то кликом мышки можем установить или убрать стену
            if (
                this.init.finishPosition && this.init.startPosition &&
                this.init.arr[x][y] != 0 && this.init.arr[x][y] != 0) {
                if (this.init.arr[x][y] === -5) {
                    this.init.arr[x][y] = -1;
                    ctx.fillStyle = '#008B8B';
                    ctx.fillRect(lineW * y, lineW * x, sizeOfSquar, sizeOfSquar);
                } else if (this.init.arr[x][y] === -1 || this.init.arr[x][y] === -4) {
                    this.init.arr[x][y] = -5;
                    ctx.fillStyle = '#666699';
                    ctx.fillRect(lineW * y, lineW * x, sizeOfSquar, sizeOfSquar);
                }
            }

        };

        findFinish() {
            let start = this.init.startPosition;
            let arrOfNeighbors = [];
            let arrNextSpet = [];
            let finish = this.init.finishPosition;
            let arr = this.init.arr;
            let finishOk = false;
            let pathOk = false;
            let path = [];
            let finishValue;

            if (start && finish) {
                arrNextSpet[0] = start;

                function checkNeighbors(x, y, v) {
                    let lastElPath;
                    if (finishOk === false) {
                        if (arr[x][y] == -1 || arr[x][y] == -4 || arr[x][y] == -11) {
                            arrOfNeighbors.push([x, y]);
                            arr[x][y] = v;
                            if (x == finish[0] && y == finish[1]) {
                                finishValue = v;
                                finishOk = true;
                            }
                        }
                    } else {
                        if ( path.length > 0 && arr[x][y] === v &&
                            arr[path[path.length - 1][0]][path[path.length - 1][1]] != v) {
                            path.push([x, y]);
                            arrOfNeighbors = [];
                            arrOfNeighbors.push([x, y]);
                        }
                    }
                }


                function step(arrforStep) {
                    for (let i = 0; i <= arrforStep.length - 1; i++) {
                        let x = arrforStep[i][0], y = arrforStep[i][1], v;
                        (finishOk === false) ? v = arr[x][y] + 1 : v = finishValue;
                        checkNeighbors(x - 1, y, v);
                        checkNeighbors(x + 1, y, v);
                        checkNeighbors(x, y - 1, v);
                        checkNeighbors(x, y + 1, v);
                    }
                    if (arrOfNeighbors.length > 0 && finishOk === false) {
                        arrNextSpet = arrOfNeighbors.slice();
                        arrOfNeighbors = [];
                        step(arrNextSpet);
                    } else {
                        if (arrOfNeighbors.length === 0 && finishOk === false) {
                            alert("Путь не существует");

                        } else {
                            if (path.length == 0) {
                                path.push(finish);
                                arrOfNeighbors = [];
                                arrOfNeighbors.push(finish);
                                finishValue--;
                                step(arrOfNeighbors);
                            }
                            if (finishValue > 0) {
                                finishValue--;
                                step(arrOfNeighbors);
                            }
                        }
                    }
                }

                step(arrNextSpet);
            }//if(start)

            this.init.ctx.fillStyle = "#ffff99";
            for (let i = 1; i < path.length - 1; i++) {
                this.init.ctx.fillRect(
                    this.init.lineW * path[i][1], this.init.lineW * path[i][0],
                    this.init.sizeOfSquar, this.init.sizeOfSquar);
            }

        }// findFinish
    }

    new Game();

}());