const main = document.getElementById('main');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


ctx.canvas.width  = 20 * 25;
ctx.canvas.height = 20 * 25;
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

let keypressArray = [];
const keyPairs = {
    d : 'u',
    u : 'd',
    l : 'r',
    r : 'l',
}

class Snake {
    snakeWidth = 25;
    snakeHeight = 25;
    #x = 2* this.snakeWidth;
    #y = 0;
    #length = 1;
    body = [
        {x: 2* this.snakeWidth, y: 0},
        {x: 1* this.snakeWidth, y: 0}, 
        {x:0, y:0},
    ];
    direction = 'r';
    currentlyMovingDir = 'r';
    countdown;

    grow() {
        this.countdown = 1;
        this.body.push({x: this.body[this.body.length - 1].x , y: this.body[this.body.length - 1].y});
        console.table(this.body);
        apple.grid.splice(apple.grid.findIndex(v => v == this.body[this.body.length -1]), 1);
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
        this.body.forEach(bodySegment => {
            if (bodySegment.x === collisionPoint.x && bodySegment.y === collisionPoint.y) console.log('collided');
        })
        if (collisionPoint.x == apple.grid[apple.currentSpawnPoint].x && collisionPoint.y == apple.grid[apple.currentSpawnPoint].y) {
            apple.applePresent = false;
            this.grow();
        }
    }

    move() {
        if (this.countdown == 1) this.countdown--;
        if (this.countdown == 0) {console.table(this.body);this.countdown--};
        // console.table(this.body);
        this.direction = this.#checkDirection();
        keypressArray = [];
        this.#checkCollision();
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
        // const beingPopped = this.body[this.body.length - 1];
        // console.log(beingPopped);
        
        // let indx = grid.findIndex(v => (v.x === beingPopped.x && v.y === beingPopped.y));
        // if (indx != -1) grid.splice(indx, 1);
        // console.log(this.body[this.body.length-1]);
        apple.grid.unshift(this.body[this.body.length-1]);
        // apple.grid(apple.grid[apple.grid.findIndex(v => v == this.body[this.body.length-1])], 1)
        this.body.pop();
        this.body.unshift({x: this.#x, y: this.#y});
        apple.grid.splice(apple.grid[apple.grid.findIndex(v => v == this.body[0])], 1);

        // console.table(this.body);
        
        // grid.push({x: this.#x, y: this.#y});
        // console.log(apple.grid);
        this.currentlyMovingDir = this.direction;
    }
}

let snake = new Snake;

class Apple {

    applePresent = false;
    currentSpawnPoint;

    grid = (function possibleGrids() {
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
    })();

    getSpawnPoint() {
        return Math.floor(Math.random() * this.grid.length);
    }

    makeNewApple() {
        this.currentSpawnPoint = this.getSpawnPoint();
        ctx.fillRect(this.grid[this.currentSpawnPoint].x, this.grid[this.currentSpawnPoint].y, snake.snakeWidth, snake.snakeHeight);
        this.applePresent = true;

    }

    renderCurrentApple() {
        ctx.fillRect(this.grid[this.currentSpawnPoint].x, this.grid[this.currentSpawnPoint].y, snake.snakeWidth, snake.snakeHeight);
    }

}

let apple = new Apple;
const draw = setInterval(() => {
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    (!apple.applePresent) ? apple.makeNewApple() : apple.renderCurrentApple();

    snake.body.forEach(joint => {
    ctx.fillRect(joint.x ,joint.y , snake.snakeWidth, snake.snakeHeight);
    })
    snake.move();
},500);

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

        case('Space'):
        snake.grow();
        console.table(snake.body);
        break;
    }
})

// -----------------------------------
// Bug
// -----------------------------------
// direction change is faster than interval, snake can go backwards