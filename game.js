const main = document.getElementById('main');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


ctx.canvas.width  = 600;
ctx.canvas.height = 600;
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

class Snake {
    snakeWidth = 25;
    snakeHeight = 25;
    #x = 0;
    #y = 0;
    #length = 1;
    body = [{x:0, y:0}];
    direction = 'r';
    currentlyMovingDir = 'r';

    grow() {
        this.body.push({x: this.#x , y: this.#y})
        this.#length++;
        console.log(this.#length);
    }

    changeDirection(directionSnakeIsFacing) {
        this.direction = directionSnakeIsFacing;
    }

    move() {
        switch (this.direction) {

            case('d'):
            (this.#y + this.snakeHeight >= canvasHeight)? this.#y = 0: this.#y += this.snakeHeight;
            break;

            case('u'):
            (this.#y - this.snakeHeight < 0)? this.#y = canvasHeight - this.snakeHeight: this.#y -= this.snakeHeight;
            break;

            case('r'):
            (this.#x + this.snakeWidth >= canvasWidth)? this.#x = 0: this.#x += this.snakeWidth;
            break;

            case('l'):
            (this.#x - this.snakeWidth < 0)? this.#x = canvasWidth - this.snakeWidth: this.#x -= this.snakeWidth;
            break;
        }
        
        this.body.pop();
        this.body.unshift({x: this.#x, y: this.#y});
        this.currentlyMovingDir = this.direction;
    }
}

let snake = new Snake;

const draw = setInterval(() => {
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    snake.move();
    snake.body.forEach(joint => {
    ctx.fillRect(joint.x ,joint.y , snake.snakeWidth, snake.snakeHeight);
    })
    ctx.fillRect(snake.x ,snake.y , snake.snakeWidth, snake.snakeHeight);    
},100);

window.addEventListener('keydown', (e) => {
    console.log(e.code);
    
    switch (e.code) {
        case('ArrowDown'):
        case('KeyS'):
        if (snake.direction != 'u' && snake.currentlyMovingDir != 'u') snake.changeDirection('d');
        break;
        case('ArrowUp'):
        case('KeyW'):
        if (snake.direction != 'd' && snake.currentlyMovingDir != 'd') snake.changeDirection('u');
        break;
        case('ArrowRight'):
        case('KeyD'):
        if (snake.direction != 'l' && snake.currentlyMovingDir != 'l') snake.changeDirection('r');
        break;
        case('ArrowLeft'):
        case('KeyA'):
        if (snake.direction != 'r' && snake.currentlyMovingDir != 'r') snake.changeDirection('l');
        break;
        case('Space'):
        snake.grow();
        break;
    }
})

// -----------------------------------
// Bug
// -----------------------------------
// direction change is faster than interval, snake can go backwards