const main = document.getElementById('main');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


ctx.canvas.width  = 600;
ctx.canvas.height = 600;
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
    #x = 0;
    #y = 0;
    #length = 1;
    body = [{x:0, y:0}];
    direction = 'r';
    currentlyMovingDir = 'r';
    renderColor = 'black';

    grow() {
        this.body.push({x: this.#x , y: this.#y})
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
            if (bodySegment.x === collisionPoint.x && bodySegment.y === collisionPoint.y) {
                console.log('collided');
                this.renderColor = 'red';
            } else this.renderColor = 'black';
        })

    }

    move() {
        this.direction = this.#checkDirection();
        console.log(this.direction);
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
        this.body.pop();
        this.body.unshift({x: this.#x, y: this.#y});
        // grid.push({x: this.#x, y: this.#y});
        // console.log(grid);
        this.currentlyMovingDir = this.direction;
    }
}

let snake = new Snake;

function possibleGrids() {
    let grid = [];
    for (let column = 0; column * snake.snakeHeight < canvasHeight; column++) {
        let tmp = [];
        for (let row = 0; row * snake.snakeWidth < canvasWidth; row++) {
            tmp.push({x: row * snake.snakeWidth, y: column * snake.snakeHeight});
        }
        grid.push(tmp);
    }
    return grid;
};
const grid = possibleGrids().flat();
console.log(grid);

ctx.fillRect(0 ,0 , snake.snakeWidth, snake.snakeHeight);
const draw = setInterval(() => {
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    snake.move();
    snake.body.forEach(joint => {
    ctx.fillRect(joint.x ,joint.y , snake.snakeWidth, snake.snakeHeight);
    })   
},100);

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

    console.log(keypressArray);
})

// -----------------------------------
// Bug
// -----------------------------------
// direction change is faster than interval, snake can go backwards