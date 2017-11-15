var aud = document.getElementById("myAudio");
aud.volume = 0.2;

var random = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
(function mapGen(map, cellInWidth, cellInHeight, coordinateX, level) {
    //Управление персонажем
    function character(coordinateX, coordinateY) {
        //Пиксель между текущей ячейкой и следующей на пути
        var pixelColor = field.getImageData(15 * currentX + 7 + 6 * coordinateX, 15 * currentY + 7 + 6 * coordinateY, 1, 1);
        // Если пиксель черный, то не перемещаем персонажа, иначе увеличиваем количество шагов
        0 == pixelColor.data[0] && 0 == pixelColor.data[1] && 0 == pixelColor.data[2] && 255 == pixelColor.data[3] ? coordinateX = coordinateY = 0 : document.querySelector("#step").innerHTML = Math.floor(document.querySelector("#step").innerHTML) + 1;
        // Закрашиваем персонажа
        field.fillStyle = "red";
        field.fillRect(15 * currentX + 3, 15 * currentY + 3, 10, 10);
        field.fillStyle = "blue";
        // Меняем его текушие координаты
        currentX += coordinateX; 
        currentY += coordinateY; 
        // Вновь отрисовываем его
        field.fillRect(3 + 15 * currentX, 3 + 15 * currentY, 10, 10);

        // Если персонаж вышел за пределы лабиринта, то генерируем новый лабиринт и начинаем игру сначала
        if(currentX >= cellInWidth){
            mapGen("#canvas", cellInWidth, cellInHeight, 0, level + 1)
        }
    }

    //Наша область игры
    map = document.querySelector(map);
    var field = map.getContext("2d");
    
    // Увеличиваем количество шагов и пройденных лабиринтов
    document.querySelector("#step").innerHTML = Math.floor(coordinateX);
    document.querySelector("#complete").innerHTML = Math.floor(level);
    
    //Область нашего лабиринта красим в чёрный цвет
    map.width = 15 * cellInWidth + 3;
    map.height = 15 * cellInHeight + 3;
    field.fillStyle = "black";
    field.fillRect(0, 0, 15 * cellInWidth + 3, 15 * cellInHeight + 3);
    
    // Объявим массивы для хранения значения множества текущей ячейки, для значения стенки справа и для значения стенки снизу
    coordinateX = Array(cellInWidth); 
    map = Array(cellInWidth);
    var k = Array(cellInWidth),
        // Текущее множество
        q = 1;

    // Цикл по строкам
    for (cr_l = 0; cr_l < cellInHeight; cr_l++) {
        // Проверка принадлежности ячейки в строке к какому-либо множеству        
        for (i = 0; i < cellInWidth; i++){
            cr_l == 0 && (coordinateX[i] = 0);
            field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 10);
            k[i] = 0;
            map[i] == 1 && (map[i] = coordinateX[i] = 0);
            coordinateX[i] == 0 && (coordinateX[i] = q++);
        }          

        // Создание случайным образом стенок справа и снизу
        for (i = 0; i < cellInWidth; i++) {
            k[i] = Math.floor(2 * Math.random()), map[i] = Math.floor(2 * Math.random());
            
            if ((0 == k[i] || cr_l == cellInHeight - 1) && i != cellInWidth - 1 && coordinateX[i + 1] != coordinateX[i]) {
                var l = coordinateX[i + 1];
                for (j = 0; j < cellInWidth; j++) coordinateX[j] == l && (coordinateX[j] = coordinateX[i]);
                field.clearRect(15 * i + 3, 15 * cr_l + 3, 15, 10)
            }
            cr_l != cellInHeight - 1 && 0 == map[i] && field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 15)
        }

        // Смотрим замкнутые области.
        for (i = 0; i < cellInWidth; i++) {
            var p = l = 0;
            for (j = 0; j < cellInWidth; j++) {
                if(coordinateX[i] == coordinateX[j] && map[j]==0){
                  p++;   
                }else{
                  l++;
                }
            }
            p==0&&(map[i] = 0, field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 15));
        }
    }

    //Выход из лабиринта
    field.clearRect(15 * cellInWidth-3, 3, 15, 10);
    // Текущие координаты нулевые
    var currentX = 0,currentY = 0;
    // Задаем крассный цвет
    field.fillStyle = "blue";
    // И ставим персонажа в начало лабиринта
    character(-1, -1);
    // Ожидаем нажатия стрелок
    document.body.onkeydown = function (a) {
        if(36 < a.keyCode && 41 > a.keyCode){
           character((a.keyCode - 38) % 2, (a.keyCode - 39) % 2); 
        }      
    }
    
})("#canvas",40 ,random, 0, 0);


