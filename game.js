const main = document.getElementById('main');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


ctx.canvas.width  = 600;
ctx.canvas.height = 600;
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

class Snake {
    snakeWidth = 50;
    snakeHeight = 50;
    x = 0;
    y = 0;
    length = 0;
    body = [];
    direction;

    grow() {
        this.body.push({x: this.x , y: this.y})
    }

    currentPosition(xCoordinate, yCoordinate) {
        this.x = xCoordinate;
        this.y = yCoordinate;
    }

    changeDirection(directionSnakeIsFacing) {
        this.direction = directionSnakeIsFacing;
    }

    move() {
        this.body.pop();
        this.body.unshift({x: this.x, y: this.y});
    }


}


let snake = new Snake;
snake.grow();
snake.currentPosition(1,2);
snake.grow();
console.log(snake.body);

let x = 0;
let y = 0;

const draw = setInterval(() => {
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    ctx.fillRect(x,y, snake.snakeWidth, snake.snakeHeight);
},0);

window.addEventListener('keydown', (e) => {
    console.log(e.code);
    switch (e.code) {
        case('ArrowDown'):
        (y + snake.snakeHeight >= canvasHeight)? y = 0: y += snake.snakeHeight;
        break;
        case('ArrowUp'):
        (y - snake.snakeHeight < 0)? y = canvasHeight - snake.snakeHeight: y -= snake.snakeHeight;
        break;
        case('ArrowRight'):
        (x + snake.snakeWidth >= canvasWidth)? x = 0: x += snake.snakeWidth; 
        break;
        case('ArrowLeft'):
        (x - snake.snakeWidth < 0)? x = canvasWidth - snake.snakeWidth: x -= snake.snakeWidth;
    }
})