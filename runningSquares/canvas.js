class Canvas {
  constructor () {

    this.link = document.getElementById('canvas');

  }
    //Анализирует, в какое место попал клик мышкой. Если есть попадание в квадратик, то скрывает его и возвращает true
    shot  (e,arr) {

        let x = e.offsetX;
        let y = e.offsetY;

        for (let i in arr) {
            if (x > arr[i].xPosition && x < arr[i].xPosition + arr[i].width &&
                y > arr[i].yPosition && y < arr[i].yPosition + arr[i].height &&
                arr[i].visible==true) {

                arr[i].visible=false;
                return true;

            }
        }
    }

}

let _canvas = new Canvas();
