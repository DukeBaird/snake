const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;
const cellWidth = 10;
let dir;
let food;
let score;
let snake_array; 

const init = () => {
	dir = "right"; 
	create_snake(5);
	food = create_food();
	score = 0;

	paint();
}

const create_snake = length => {
	snake_array = [];

	for (let i = length-1; i>=0; i--) {
		snake_array.push({
			x: i,
			y:0
		}); 
	}
}

const create_food = () => {
	return {
		x: Math.round(Math.random()*(w-cellWidth)/cellWidth), 
		y: Math.round(Math.random()*(h-cellWidth)/cellWidth), 
	};
}

const paint = () => {	

	const score_text = "Score: " + score;
	let nx = snake_array[0].x;
	let ny = snake_array[0].y;
	let tail;

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

	// if dead
	if (nx == -1 || nx == w/cellWidth || ny == -1 || ny == h/cellWidth || check_collision(nx, ny, snake_array)) {
		init();
		return;
	}

	// if ate food
	if (nx == food.x && ny == food.y) {
		tail = {
			x: nx, 
			y: ny
		};
		score++;
		food = create_food();
	} else {
		tail = snake_array.pop();
		tail.x = nx; 
		tail.y = ny;
	}

	snake_array.unshift(tail);
	snake_array.forEach(cell => paint_cell(cell.x, cell.y));

	paint_cell(food.x, food.y);
	ctx.fillText(score_text, 5, h-5);

	requestAnimationFrame(paint);
}

const paint_cell = (x, y) => {
	ctx.fillStyle = "green";
	ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
}

const check_collision = (x, y, array) => {
	array.forEach(cell => {
		if (cell.x === x && cell.y === y) {
			return true;
		}
	});
	return false;
}

document.addEventListener("keydown", function(e) {
	const key = e.which;

	if (key == "37" && dir != "right") {
		dir = "left";
	} else if (key == "38" && dir != "down") {
		dir = "up";
	} else if (key == "39" && dir != "left") {
		dir = "right";
	} else if (key == "40" && dir != "up") {
		dir = "down";
	}
});

init();