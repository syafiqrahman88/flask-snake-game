const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize, tileCount, snake, food, dx, dy, score;

// Add these new variables at the top of the file
const keyboardInstructions = document.getElementById('keyboardInstructions');
const touchInstructions = document.getElementById('touchInstructions');

function initGame() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const size = Math.min(screenWidth, screenHeight * 0.7) - 20; // Reduced to 70% of screen height

    canvas.width = size;
    canvas.height = size;

    gridSize = Math.floor(size / 20);
    tileCount = Math.floor(size / gridSize);

    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    drawScore();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    alert(`Game Over! Your score: ${score}`);
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    dx = 0;
    dy = 0;
    score = 0;
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function changeDirection(newDx, newDy) {
    if ((newDx === 1 && dx !== -1) || (newDx === -1 && dx !== 1) ||
        (newDy === 1 && dy !== -1) || (newDy === -1 && dy !== 1)) {
        dx = newDx;
        dy = newDy;
    }
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    switch (event.keyCode) {
        case LEFT_KEY:
            changeDirection(-1, 0);
            break;
        case UP_KEY:
            changeDirection(0, -1);
            break;
        case RIGHT_KEY:
            changeDirection(1, 0);
            break;
        case DOWN_KEY:
            changeDirection(0, 1);
            break;
    }
}

// Touch controls
const joystick = document.getElementById('joystick');
const upBtn = document.getElementById('upBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const downBtn = document.getElementById('downBtn');

// Update the setupTouchControls function
function setupTouchControls() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        joystick.style.display = 'block';
        upBtn.addEventListener('click', () => changeDirection(0, -1));
        leftBtn.addEventListener('click', () => changeDirection(-1, 0));
        rightBtn.addEventListener('click', () => changeDirection(1, 0));
        downBtn.addEventListener('click', () => changeDirection(0, 1));
        
        // Show touch instructions, hide keyboard instructions
        touchInstructions.style.display = 'block';
        keyboardInstructions.style.display = 'none';
    } else {
        // Hide touch instructions, show keyboard instructions
        touchInstructions.style.display = 'none';
        keyboardInstructions.style.display = 'block';
    }
}

function gameLoop() {
    drawGame();
    setTimeout(gameLoop, 100);
}

window.addEventListener('load', () => {
    initGame();
    setupTouchControls();
    gameLoop();
});

window.addEventListener('resize', () => {
    initGame();
});
