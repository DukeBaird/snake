var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();
var cellWidth = 10;
var dir;
var food;
var score;
var snake_array; 

function init() {

	dir = "right"; 
	create_snake();
	create_food();
	score = 0;

	if (typeof game_loop != "undefined") {
		clearInterval(game_loop);
	}
	game_loop = setInterval(paint, 60);
}


function create_snake() {

	var length = 5;
	snake_array = [];

	for(var i = length-1; i>=0; i--) {
		snake_array.push({
			x: i,
			y:0
		}); 
	}
}

function create_food() {

	food = {
		x: Math.round(Math.random()*(w-cellWidth)/cellWidth), 
		y: Math.round(Math.random()*(h-cellWidth)/cellWidth), 
	};
}


function paint() {	

	var score_text = "Score: " + score;
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);
	
	if (dir == "right") {
		nx++; 
	} else if (dir == "left") {
		nx--;
	} else if (dir == "up") {
		ny--;
	} else if (dir == "down") {
		ny++;
	}

	if(nx == -1 || nx == w/cellWidth || ny == -1 || ny == h/cellWidth || check_collision(nx, ny, snake_array)) {
		init();
		return;
	}
	
	if(nx == food.x && ny == food.y) {
		var tail = {
			x: nx, 
			y: ny
		};
		score++;
		create_food();
	}
	else {
		var tail = snake_array.pop();
		tail.x = nx; tail.y = ny;
	}
	
	snake_array.unshift(tail);
	
	for(var i = 0; i < snake_array.length; i++) {
		var c = snake_array[i];
		paint_cell(c.x, c.y);
	}
	
	paint_cell(food.x, food.y);
	ctx.fillText(score_text, 5, h-5);
}

function paint_cell(x, y) {

	ctx.fillStyle = "green";
	ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
}

function check_collision(x, y, array) {

	for(var i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y) {
			return true;
		}
	}
	return false;
}

$(document).keydown(function(e) {
	
	var key = e.which;

	if (key == "37" && dir != "right") {
		dir = "left";
	} else if (key == "38" && dir != "down") {
		dir = "up";
	} else if (key == "39" && dir != "left") {
		dir = "right";
	} else if (key == "40" && dir != "up") {
		dir = "down";
	}
})

init();