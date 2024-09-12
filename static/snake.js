const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize, tileCount, snake, food, dx, dy, score;
let gameSpeed = 200; // Slower initial speed (milliseconds between updates)

// Load images
const snakeHeadImg = document.getElementById('snakeHeadImg');
const foodImg = document.getElementById('foodImg');

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
        increaseSpeed(); // Increase speed when food is eaten
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw the head image
            ctx.save();
            ctx.translate(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2);
            ctx.rotate(getHeadRotation());
            ctx.drawImage(snakeHeadImg, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
            ctx.restore();
        } else {
            // Draw body segments
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });
}

function getHeadRotation() {
    if (dx === 1) return 0;
    if (dx === -1) return Math.PI;
    if (dy === 1) return Math.PI / 2;
    if (dy === -1) return -Math.PI / 2;
    return 0;
}

function drawFood() {
    ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
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

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 10;
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
    setTimeout(gameLoop, gameSpeed);
}

window.addEventListener('load', () => {
    initGame();
    setupTouchControls();
    // Wait for images to load before starting the game loop
    if (snakeHeadImg.complete && foodImg.complete) {
        gameLoop();
    } else {
        snakeHeadImg.onload = foodImg.onload = () => {
            if (snakeHeadImg.complete && foodImg.complete) {
                gameLoop();
            }
        };
    }
});

window.addEventListener('resize', () => {
    initGame();
});
