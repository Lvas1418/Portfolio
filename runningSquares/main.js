(function() {

    class Squares {

        //создает новые экземпляры квадратиков и помещает их в массив
        creatSquars  (arr) {

            //Конструктор для квадратиков
            class Square {
                constructor (x,y,w,h) {
                    this.x=x;
                    this.y=y;
                    this.w=w;
                    this.h=h;
                    this.visibleId=0;
                    this.visible=false;

                }
            }
            class LifeSquare extends Square {
                constructor(x,y,w,h){
                    super(x,y,w,h);
                    // Генерирует "случайный" цвет для квадратиков
                    this.color= (()=>{
                        let a,b,c;
                        a=Math.floor(Math.random() * 255);
                        b=Math.floor(Math.random() * 255);
                        c=Math.floor(Math.random() * 255);
                        return `rgb(${a}, ${b}, ${c})`;
                    })();
                    //Генерирует "случайную" скорость для квадратиков
                    this.speed= (()=> Math.random()*5+1)();
                }
            }

            for( let i = 0; i <= 16; i++){
              arr.push( new LifeSquare(i*(35+5),0,35,35));
              }
              console.log(arr);
            return arr;
        };

            //Очищает массив с квадратиками
        destructionSquars (arr){
            for ( let i=0; i<=arr.length;i++)
                arr.splice(0,arr.length);
                return arr;
        }

    }

     // Анимация
      class  Animate {
              constructor (ctx,canvas) {
                  this.ctx=ctx;
                  this.canvas=canvas;
                  this.arr=[];
                  this.stopId=undefined;
              }

          //Делает квадратики видимыми, через случайные промежутки времени
          randomAppearance (){
              this.arr.forEach(function(item, i, arr) {

                      item.visibleId=setTimeout(function(){
                          item.visible=true;
                      }, Math.floor(Math.random() * 5000) + 1);

              });
          }

          // Отрисовывает видимые квадратики
          startDraw (){
                this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);
                   for (let i=0; i<=16; i++){
                        if (this.arr[i].visible== true) {
                           this.ctx.fillStyle = this.arr[i].color;
                           this.arr[i].y += this.arr[i].speed;
                        if (this.arr[i].y >= this.canvas.clientHeight)
                            this.arr[i].y = 0;
                            this.ctx.fillRect(this.arr[i].x,this.arr[i].y, this.arr[i].w, this.arr[i].h);
                         }

                   }
                    this.stopId=requestAnimationFrame(this.startDraw.bind(this));
             };

            // Останавливает анимацию, затирает игровое поле
            stopDraw (){
                cancelAnimationFrame(this.stopId);
                this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);
            }

            //Выводит сообщение "You win"
            win() {

                this.ctx.font = "80px Arial";
                this.ctx.fillStyle = "red";
                this.ctx.textAlign = "center";
                this.ctx.fillText("You win", this.canvas.width/2, this.canvas.height/2);

            }

             //Анализирует, в какое место попал клик мышкой. Если есть попадание в квадратик, то возвращает true
             shot  (e) {
                 let x = e.offsetX, y = e.offsetY;
                for (let i in this.arr) {
                    if (x > this.arr[i].x && x < this.arr[i].x + this.arr[i].w &&
                        y > this.arr[i].y && y < this.arr[i].y + this.arr[i].h &&
                        this.arr[i].visible==true) {
                        this.arr[i].visible=false;
                        return true;
                    }
                }
            }





}
    class Init {
        constructor (){
            this.canvas = document.getElementById('canvas');
            this.ctx = canvas.getContext('2d');
            this.arr = [];
            this.buttonStop = document.getElementById('stop');
            this.buttonStart = document.getElementById('start');
            this.scoreLabel = document.getElementById('score');
            this.score=0;
            }
        }

    class Game {
        constructor () {
            this.init= new Init();
            this.squares=new Squares();
            this.animate= new Animate(this.init.ctx,this.init.canvas);

            // Реагирует на нажатие кнопки "Старт",
            this.init.buttonStart.addEventListener('click', this.startGame.bind(this));

            // Реагирует на клик по игровому полю
            this.init.canvas.onclick=this.clickOnCanvas.bind(this);

            // Реагирует на нажатие кнопки "Стоп",
            this.init.buttonStop.addEventListener('click', this.stopGame.bind(this));
       }

        startGame () {
            if (this.init.arr.length==0){
            this.init.arr =this.squares.creatSquars(this.init.arr);
            this.animate.arr=this.init.arr;
            this.animate.randomAppearance();
            this.animate.startDraw();
            };
        }

        stopGame  () {
            this.animate.stopDraw();
            this.init.arr=this.squares.destructionSquars(this.init.arr);
            this.init.score=0;
            this.init.scoreLabel.innerText=this.init.score;
        };

        clickOnCanvas  (e) {
               if (this.animate.shot(e)){
                   this.init.score+=1;
                   this.init.scoreLabel.innerText=this.init.score;
                   if (this.init.score==16){
                       this.stopGame();
                       this.animate.win();
                   }
               }
        };


    }
 new Game();






}());