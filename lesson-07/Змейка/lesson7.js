// Глобальные переменные:                            
const FIELD_SIZE_X = 21;//строки  !логичнее, что это Х - это столбцы, исправил в prepareGameField
var FIELD_SIZE_Y = 21;//столбцы !логичнее, что это Y - это строки, исправил в prepareGameField
var SNAKE_SPEED = 200; // Интервал между перемещениями змейки
var snake = []; // Сама змейка
var direction = 'y+';
var gameIsRunning = false; // Запущена ли игра
var snake_timer; // Таймер змейки
var food_timer; // Таймер для еды
var score = 0; // Результат

let blocks = [];//--------------------------------------------------------------------------------
let block_frequency = 5000;//--------------------------------------------------------------------------------
let block_timer;//--------------------------------------------------------------------------------



function init() {
    prepareGameField(); // Генерация поля

    var wrap = document.getElementsByClassName('wrap')[0];
    // Подгоняем размер контейнера под игровое поле

    wrap.style.width = '400px';
    // События кнопок Старт и Новая игра
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);
    

// Отслеживание клавиш клавиатуры
    addEventListener('keydown', changeDirection);
    
    
}

/**
 * Функция генерации игрового поля
 */
function prepareGameField() {
    // Создаём таблицу
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table ');

    // Генерация ячеек игровой таблицы
    for (var i = 0; i < FIELD_SIZE_Y; i++) {//--------------------------------------------------------------------------------
        // Создание строки
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_X; j++) {//--------------------------------------------------------------------------------
            // Создание ячейки
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;

            row.appendChild(cell); // Добавление ячейки
        }
        game_table.appendChild(row); // Добавление строки
    }

    document.getElementById('snake-field').appendChild(game_table); // Добавление таблицы
    
}

/**
 Старт игры
 */
function startGame() {
    gameIsRunning = true;
    respawn();//создали змейку

    snake_timer = setInterval(move, SNAKE_SPEED);//каждые 200мс запускаем функцию move
    block_timer = setInterval(createBlock, block_frequency);
    setTimeout(createFood, 5000);
}

/**
 Функция расположения змейки на игровом поле
 */
function respawn() {
    // Змейка - массив td
    // Стартовая длина змейки = 2

    // Respawn змейки из центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    // Голова змейки
    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    snake_head.classList.add('snake-head');//--------------------------------------------------------------------------------
    // Тело змейки
    var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y+1) + '-' + start_coord_x)[0];//---------------------------
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');
    
    snake.push(snake_tail);//--------------------------------------------------------------------------------
    snake.push(snake_head);//--------------------------------------------------------------------------------
    
}

/**
 Движение змейки
 */
function move() {
    //console.log('move',direction);
    // Сборка классов
    var snake_head_classes = snake[snake.length-1].getAttribute('class').split(' ');

    // Сдвиг головы
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');//преобразовали строку в массив
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Определяем новую точку
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
        if (new_unit === undefined) {//------------------------------------------------------------------------------
            new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (FIELD_SIZE_X - 1))[0];//---------------------------
        }//------------------------------------------------------------------------------
    }
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
        if (new_unit === undefined) {//------------------------------------------------------------------------------
            new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (0))[0];//------------------------------------------
        }//------------------------------------------------------------------------------
    }
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
        if (new_unit === undefined) {//------------------------------------------------------------------------------
            new_unit = document.getElementsByClassName('cell-' + (FIELD_SIZE_Y - 1) + '-' + (coord_x))[0];//---------------------------
        }//------------------------------------------------------------------------------
    }
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
        if (new_unit === undefined) {//------------------------------------------------------------------------------
            new_unit = document.getElementsByClassName('cell-' + (0) + '-' + (coord_x))[0];//------------------------------------------
        }//------------------------------------------------------------------------------
    }

    // Проверки
    // 1) new_unit не часть змейки
    // 2) Змейка не ушла за границу поля
    //console.log(new_unit);
    if (!isSnakeUnit(new_unit) && (new_unit !== undefined) && !isBlockUnit(new_unit)) {
        // Добавление новой части змейки
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        new_unit.classList.add('snake-head'); //--------------------------------------------------------------------------------
        snake[snake.length-1].classList.remove('snake-head');//------------------------------------------------------------------------
        snake.push(new_unit);

        // Проверяем, надо ли убрать хвост

	   if (!haveFood(new_unit)) {
            // Находим хвост
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            // удаляем хвост
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    }
    else {
        finishTheGame();
    }
}

/**

 Проверка на змейку

 */
function isSnakeUnit(unit) {//проверка, что змейка не попала сама в себя в новой ячейке
    var check = false;

    if (snake.includes(unit)) {//если в змейке содержится новая ячейка, значит возникло пересечение
        check = true;
    }
    return check;
}
/**

 проверка на еду

 */
function haveFood(unit) {
    var check = false;

    var unit_classes = unit.getAttribute('class').split(' ');

    // Если еда
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();
        delBlock();//-----------------------------------------------------------

        score++;

        //если счет игрока большой уменьшаем интервал появления препятствий
        if (score > 10) {//------------------------------------------------------------------------------   
            block_frequency = 2000;//------------------------------------------------------------------------------   
            clearInterval(block_timer);//------------------------------------------------------------------------------   
            block_timer = setInterval(createBlock, block_frequency);//-----------------------------------------------------------------
        }//------------------------------------------------------------------------------   

      document.getElementById('score-board').innerText = score;//----------------------------------------------------------------------
    }
    return check;
}

/**
 Создание еды
 */
function createFood() {
    var foodCreated = false;

    while (!foodCreated) { //пока еду не создали
        // рандом
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        // проверка на змейку
        if (!food_cell_classes.includes('snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }

            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}

//--------------------------------------------------------------------------------
//создание препятствий
function createBlock() {
    let isBlockCreated = false;
    while (!isBlockCreated) { //пока блок не создали
        var block_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var block_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var block_cell = document.getElementsByClassName('cell-' + block_y + '-' + block_x)[0];

        // проверка полученной рендомной ячейки на наличие классов змейки и еды
        if (!(block_cell.classList.contains('snake-unit') || block_cell.classList.contains('food-unit'))) {
            block_cell.classList.add('block-unit');
            blocks.push(block_cell);
            isBlockCreated = true;
        }
    }
}

//удаляем препятствие
function delBlock() {
    if (blocks.length != 0) {
        let blockDeleted = blocks.splice(0, 1)[0];
        blockDeleted.classList.remove('block-unit');
    }
}

// проверяем unit на наличие в нем класса block-unit
function isBlockUnit(unit) {
    let check = false;
    if (unit.classList.contains('block-unit')) {
        check = true;
    }
    return check;
}
//--------------------------------------------------------------------------------

/**
 Изменение направления движения змейки

 */
function changeDirection(e) {
//    console.log(e.keyCode);
	switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // Клавиша вверх
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: // Клавиша вниз
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
    }
}

/**
 Функция завершения игры
 */
function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    clearInterval(block_timer); //------------------------------------------------------------------------------------------------
    alert('Вы проиграли! Ваш результат: ' + score.toString());
}

/**
 Новая игра
 */
function refreshGame() {
    location.reload();
}

// Инициализация
window.onload = init;