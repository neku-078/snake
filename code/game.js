/*

Author : neku, caito
edited date : 22/12/2019

*/

//從html抓物件
var score = document.getElementById('score');
var map = document.getElementById('map');
var pause = document.getElementById('pause');
var start = document.getElementById('start');
var restart = document.getElementById('restart');

//map行列數設定
var row_size = 10;
var column_size = 10;

//設定map大小
var map_height = row_size * 20 + 'px';
var map_width = column_size * 20 + 'px';
map.style.height = map_height;
map.style.width = map_width;

//map陣列
var div_position = [];

//用div創建map
for (var i = 0; i < row_size; i++) {
    var row_object = document.createElement('div');
    row_object.className = 'row';  //設定class name
    map.appendChild(row_object);  //加入地圖
    var row_array = [];  //row陣列

    for (var j = 0; j < column_size; j++) {
        var column_object = document.createElement('div');
        column_object.className = 'column';
        row_object.appendChild(column_object);  //將column加入row物件下
        row_array.push(column_object);  //column加入row陣列
    }

    div_position.push(row_object);  //將row加入map陣列
}

/*snake*/
//身體陣列
var snake = [];
var div_row = [];

/*初始化*/
//遊戲開始長度為3
for(var i = 0; i < 3; i++){
    div_row = div_position[i]; //抓取div position陣列第i排
	div_row.childNodes[0].className = 'column snake';  //更改class name
	snake[i] = div_row.childNodes[0];
}

//位址 = (0, 2)
var snake_x = 0;
var snake_y = 2;
//方向 = down
var direction = 'down';
//改變方向bool = true
var change_direction = true;

//score
var score_conter = 0;

//food座標
var food_x = 0;
var food_y = 0;

//延遲timer
var delay_timer = null;

//speed
var snake_speed = 300;

creat_food();  //剛開始先創建一個food

var move_timer = setInterval('snake_move', snake_speed);  //遊戲timer

/*改變方向判定*/
document.onkeydown = function(event) {
    if (!change_direction) { return; }  //不須改變方向
    event = event || window.event;

    //所在方位不前後移動
    if (direction == 'up' && (event.keyCode == 38 || event.keyCode == 40)) { return;}
    if (direction == 'down' && (event.keyCode == 38 || event.keyCode == 40)) { return; }
    if (direction == 'right' && (event.keyCode == 37 || event.keyCode == 39)) { return; }
    if (direction == 'left' && (event.keyCode == 37 || event.keyCode == 39)) { return; }

    //方向判定
    switch (event.keyCode) {
        case 37 :   //left
            direction = 'left';
            break;
        case 38 :   //up
            direction = 'up';
            break;
        case 39 :   //right
            direction = 'right';
            break;
        case 40 :   //down
            direction = 'down';
            break;
    }
    change_direction = false;

    delay_timer = setTimeout(function () {
        change_direction = true;  //改變方向bool設回true
    }, 50);
}

/*移動*/
function snake_move() {
    switch (direction) {
        case 'left' :
            snake_x--;
            break;
        case 'right' : 
            snake_x++;
            break;
        case 'up' :
            snake_y--;
            break;
        case 'down' :
            snake_y++;
            break;
    }

    //判定是否碰到邊界
    if (snake_x < 0 || snake_y < 0 || snake_x >= column_size || snake_y >= row_size) {
        alert('貓貓怪撞到牆了!!請重新開始遊戲');
        close_game();
        return;
    }
    
    //判定是否碰到snake
    //每一格snake
    for (var i = 0; i < snake.length; i++) {
        //row
    	for (var j = 0 ; j < div_position.length; j++){
    		if(j == snake_y){
                var snake_row = div_position[j];
                //column
    			for (var k = 0; k < snake_row.childNodes.length; k++){
    				if (k == snake_x){
    					var snake_column = snake_row.childNodes[k];
    					if(snake[i] == snake_column && score_conter > 0){
    						alert('貓貓怪吃到貓了!!請重新開始遊戲');
                            close_game();
            				return;
    					}
    				}
    			}
    		}
    	}
        if (snake[i] == div_position[snake_y][snake_x] && score_conter > 0) {
            alert('貓貓怪吃到貓了!!請重新開始遊戲');
            close_game();
            return;
        }
    }

    //判定是否吃到食物
    if (food_x == snake_x && food_y == snake_y) {
    	//row
    	for (var i = 0; i< div_position.length; i++){ 
    		if (i == food_y){
                var food_row = div_position[i]; //取得row元素
                //column
    			for (var j = 0; j < food_row.childNodes.length; j++){
    				if (j == food_x){
    					var food_column = food_row.childNodes[j]; //得到(i, j)座標的column元素
    					food_column.className = 'column snake'; //更改class
    					snake.push(food_column);
    				}
    			}
            }
    	}
        score_conter++;  //得分
        
        //吃到食物時加速
        if (snake_speed > 100) {  //速度上限值
            snake_speed -= 25;  //加速
            clearInterval(move_timer);
            move_timer = setInterval('snake_move()', snake_speed);
        }
        score.innerHTML = score_conter;  //更新分數

        creat_food();  //隨機創建food
    } else {  //移動
        snake[0].className = 'column';
        snake.shift();  //移除尾端

        for (var i = 0; i < div_position.length; i++){
        	if(i == snake_y){
        		var snake_row = div_position[i];
        		for (var j = 0; j < snake_row.childNodes.length; j++) {
        			if(j == snake_x){
        				var snake_column = snake_row.childNodes[j];
        				snake_column.className = 'column snake';
        				snake.push(snake_column);  //增加前端
        			}
        			
        		}
        	}
        }
    }

    //勝利條件
    if (score_conter == row_size * column_size - 3) {
        alert('貓貓怪成功佔滿了!!請重新開始遊戲');
        close_game();
        return;
    }
}

/*隨機建立food*/
//亂數函數
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//創建food
function creat_food() {
    food_x = random(0, column_size - 1);
    food_y = random(0, row_size - 1);
    
    //判定food是否生成於snake上
    //row
    for (var i = 0; i < div_position.length; i++) {
		if (i == food_y) {  //row重疊
            var food_row = div_position[i];  //取得food的column
            //column
			for(j = 0; j < food_row.childNodes.length; j++){
				if(j == food_x){    //column重疊
					var food_column = food_row.childNodes[j];  //得到(i, j)座標的column元素
					if (food_column.className == 'column snake') {  //判定food重疊於snake上
					    creat_food();  //重新生成food
					} else{
					    food_column.className = 'column food';  //改class name
					} 
				}
			}
			
		}
    }
}

//關閉遊戲
function close_game() {
    clearInterval(move_timer);  //關掉timer
    start.disabled = true;  //設定start按鈕失效
    pause.disabled = true;  //pause按鈕失效
    return;
}


/*按鈕功能設定*/
pause.onclick = function () {
    clearInterval(move_timer);  //關閉timer
}

start.onclick = function () {
    move_timer = setInterval('snake_move()', snake_speed);  //重新設定速度
}

restart.onclick = function () {
    window.location.reload();  //刷新頁面
}