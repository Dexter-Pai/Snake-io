// ----------------------------------------------------------
// Snake Object
// ----------------------------------------------------------

class Snake {

    snakeWidth = 25;
    snakeHeight = 25;

    #x = 2* this.snakeWidth;
    #y = 0;

    #length = 1;
    direction = 'r';

    body = [
        {x: 2* this.snakeWidth, y: 0},
        {x: 1* this.snakeWidth, y: 0}, 
        {x:0, y:0},
    ];

    #grow() {
        this.countdown = 1;
        this.body.push({x: this.body[this.body.length - 1].x , y: this.body[this.body.length - 1].y});
        this.#length++;
    }

    #checkDirection() {
        if (keypressArray == []) return;

        for ( let i = keypressArray.length - 1; i >= 0; i--) {
            if (keypressArray[i] != keyPairs[this.direction]) return keypressArray[i];
        }

        return this.direction;
    }

    #getCollisionPoint() {
        let collisionPoint = {};
        switch (this.direction) {

            case('d'):
            collisionPoint = {x: this.#x , y: this.#y + this.snakeHeight};
            break;

            case('u'):
            collisionPoint = {x: this.#x, y: this.#y - this.snakeHeight};
            break;

            case('r'):
            collisionPoint = {x: this.#x + this.snakeWidth, y: this.#y};
            break;

            case('l'):
            collisionPoint = {x: this.#x - this.snakeWidth, y: this.#y};
            break;
        }
        return collisionPoint;
    }

    #checkCollision() {
        const collisionPoint = this.#getCollisionPoint();

        // detecting collision with snake body
        this.body.forEach(bodySegment => {
            if (bodySegment.x === collisionPoint.x && bodySegment.y === collisionPoint.y) gameOver();
        })

        // detecting collision with apple
        if (collisionPoint.x == apple.grid[apple.currentSpawnPoint].x && collisionPoint.y == apple.grid[apple.currentSpawnPoint].y) {
            apple.applePresent = false;
            this.#grow();
        }
    }

    move() {
        this.direction = this.#checkDirection();
        keypressArray = [];
        this.#checkCollision();
        switch (this.direction) {

            case('d'):
            (this.#y + this.snakeHeight >= canvasHeight)? gameOver(): this.#y += this.snakeHeight;
            break;

            case('u'):
            (this.#y - this.snakeHeight < 0)? gameOver(): this.#y -= this.snakeHeight;
            break;

            case('r'):
            (this.#x + this.snakeWidth >= canvasWidth)? gameOver(): this.#x += this.snakeWidth;
            break;

            case('l'):
            (this.#x - this.snakeWidth < 0)? gameOver(): this.#x -= this.snakeWidth;
            break;
        }
        this.body.pop();
        this.body.unshift({x: this.#x, y: this.#y});
    }
}

// ----------------------------------------------------------
// Apple Object
// ----------------------------------------------------------

class Apple {

    applePresent = false;
    currentSpawnPoint;
    grid;
    #apple = new Image();
    
    setAppleSrc() {
        this.#apple.src = 'static/apple.bmp';
    }

    #possibleGrids() {
        let newGrid = [];
        for (let column = 0; column * snake.snakeHeight < canvasHeight; column++) {
            let tmp = [];
            for (let row = 0; row * snake.snakeWidth < canvasWidth; row++) {
                tmp.push({x: row * snake.snakeWidth, y: column * snake.snakeHeight});
            }
            newGrid.push(tmp);
        }
        newGrid = newGrid.flat();
        
        for (let i = 0; i < snake.body.length; i++) {
            let index = newGrid.findIndex(v => v.x == snake.body[i].x && v.y == snake.body[i].y);
            if (index != -1) newGrid.splice(index, 1);
        }
        return newGrid;
    };

    #getSpawnPoint() {
        return Math.floor(Math.random() * this.grid.length);
    }

    #drawApple() {
        ctx.drawImage(this.#apple, this.grid[this.currentSpawnPoint].x, this.grid[this.currentSpawnPoint].y, snake.snakeWidth, snake.snakeHeight);
    }

    makeNewApple() {
        this.setAppleSrc();
        this.grid = this.#possibleGrids();
        if (this.grid.length === 0) {
            gameOver();
            win = true;
        } else {
            this.currentSpawnPoint = this.#getSpawnPoint();
            this.#drawApple();
            this.applePresent = true;
        }
    }

    renderCurrentApple() {
        this.#drawApple();
    }

}

// ----------------------------------------------------------
// Global Variables
// ----------------------------------------------------------

// Html elements
const main = document.getElementById('main');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Setting for how fast the game runs (in ms)
// Smaller number for faster gameplay, larger means slower
// 1000 means the snake will move every second
const latency = 100;

// Setting Canvas Width & Height
ctx.canvas.width  = 20 * 25;
ctx.canvas.height = 20 * 25;

// Getting canvas values
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

// Determine input (Don't tweak or game will break!)
let keypressArray = [];
const keyPairs = {
    d : 'u',
    u : 'd',
    l : 'r',
    r : 'l',
}

// Did the player win?
let win = false;

// placeholder for snake and apple objects
let snake;
let apple;
// apple pixel art credit to https://www.deviantart.com/luna4s/art/Pixelart-Apple-706000118

// ----------------------------------------------------------
// Draw Function
// ----------------------------------------------------------

let startGame = setInterval(draw,latency);

function draw() {
    if (snake === undefined && apple === undefined) {
        snake = new Snake;
        apple = new Apple;
    }

    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    (!apple.applePresent) ? apple.makeNewApple() : apple.renderCurrentApple();

    // render for each joints in the snake array
    snake.body.forEach(joint => {
    ctx.fillRect(joint.x ,joint.y , snake.snakeWidth, snake.snakeHeight);
    })
    
    snake.move();
}
// ----------------------------------------------------------
// Input event handlers
// ----------------------------------------------------------

window.addEventListener('keydown', (e) => {
    
    switch (e.code) {

        case('ArrowDown'):
        case('KeyS'):
        keypressArray.push('d');
        break;

        case('ArrowUp'):
        case('KeyW'):
        keypressArray.push('u');
        break;

        case('ArrowRight'):
        case('KeyD'):
        keypressArray.push('r');
        break;

        case('ArrowLeft'):
        case('KeyA'):
        keypressArray.push('l');
        break;

        case('Escape'):
        gameOver();
        break;

        case('Enter'):
        startNewGame();
        break;
    }
})

// ----------------------------------------------------------
// Game Functions
// ----------------------------------------------------------

function gameOver() {
    if (win === true) console.log('You Win!');
    delete snake;
    delete apple;
    clearInterval(startGame);
}

function startNewGame() {
    gameOver();
    win = false;
    snake = new Snake;
    keypressArray = [];
    apple = new Apple;
    startGame = setInterval(draw,latency);
}


// -----------------------------------
// Bug
// -----------------------------------
// Please Document known bugs and issues below;