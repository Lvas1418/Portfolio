(() => {
    const Works = {
        lab: {
            name: 'lab',
            description: 'В данной игре, Вы задаете: размер игрового поля, расположение точек "Старт" и "Финиш",\n' +
            '                                расположение дополнительных стен. После этого игра сама найдет кратчайшее расстояние\n' +
            '                                или выведет сообщение о том, что путь не существует.',
            nameOfWork: 'Лабиринт',
            path: "./task4/maze.html",
        },
        sol: {
            name: 'sol',
            description: 'В этой  игре необходимо сложить четыре колоды карт по мастям в порядке возростания путем комбинации карт',
            nameOfWork: 'Солитер',
            path: "./task3/Solitaire.html",
        },
        fifteens: {
            name: 'fifteens',
            description: 'Цель головоломки - собрать в ряд цифр по возрастанию путем перемещения. Перемещения осуществляются' +
            ' кликом мышки',
            nameOfWork: 'Пятнашки',
            path: "./task2/index.html",
        },
        runningSquares: {
            name: 'runningSquares',
            description: 'В данной игре, Вам нужно поймать кликом мышки бегущий квадратик. Вы выигрываете, если все ' +
            'квадратики пойманы.',
            nameOfWork: 'Квадратики',
            path: "./runningSquares/index.html",
        },
        tickTackToe: {
            name: 'tickTackToe',
            description: '',
            nameOfWork: 'Крестики нолики',
            path: "",
        },
    };
    const width = 387;
    const list = document.querySelector('ul');
    let listElems = document.querySelectorAll('li');
    let position = 0; // текущий сдвиг влево
    let frame = document.getElementById('frame');
    const rightArrow = document.getElementById('rightArrow');
    const leftArrow = document.getElementById('leftArrow');
    let arrWorks = document.getElementsByClassName('content');
    [].forEach.call(arrWorks, (item) => {
        item.addEventListener('click', setWork);
    });
    rightArrow.addEventListener('click', rightShift);
    leftArrow.addEventListener('click', lefttShift);

    function rightShift() {
        position = Math.min(position + width, 0);
        list.style.transform = 'translateX(' + position + 'px)';
        // console.log(position);
        if (position === 0) {
            rightArrow.style.visibility = 'hidden'
        }
        if (position > (listElems.length - 1) * -width) {
            leftArrow.style.visibility = 'visible'
        }
    }

    function lefttShift() {
        position = Math.max(position - width, -width * (listElems.length - 1));
        list.style.transform = 'translateX(' + position + 'px)';
        if (position === (listElems.length - 1) * -width) {
            leftArrow.style.visibility = 'hidden';
        }
        if (position < 0) {
            rightArrow.style.visibility = 'visible';
        }
    }

    function setWork(e) {
        let element;
        for (let prop in Works) {
            if (e.target.dataset.class == prop) {
                if (frame.dataset.class) {
                    document.getElementById(frame.dataset.class).classList.toggle("selected");
                }
                document.getElementById('nameOfWork').innerText = Works[prop].nameOfWork;
                document.getElementById('frame').style.visibility = 'visible';
                document.getElementById('workDescription').innerText = Works[prop].description;
                element = document.getElementById(prop);
                frame.src = Works[prop].path;
                frame.dataset.class = prop;
                element.classList.toggle("selected");
            }
        }
    }
})();