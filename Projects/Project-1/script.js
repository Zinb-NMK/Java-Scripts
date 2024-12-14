const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

// Player properties
const player = {
    x: 225,
    y: 400,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

// Ball properties
const balls = [];
const ballRadius = 10;

// Game state
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let highestLevel = localStorage.getItem("highestLevel") || 0;
let gameOver = false;
let level = 0;
let ballSpeedIncrement = 0.2; // Ball speed increase per level

// Controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowUp") player.dy = -player.speed;
    if (e.key === "ArrowDown") player.dy = player.speed;
});

document.addEventListener("keyup", () => {
    player.dx = 0;
    player.dy = 0;
});

// Draw player
function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw balls
function drawBalls() {
    ctx.fillStyle = "red";
    balls.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Update ball positions and speed based on level
function updateBalls() {
    balls.forEach((ball, index) => {
        ball.y += ball.speed;

        // Check collision with player
        if (
            ball.x < player.x + player.width &&
            ball.x + ballRadius > player.x &&
            ball.y < player.y + player.height &&
            ball.y + ballRadius > player.y
        ) {
            gameOver = true;
        }

        // Remove balls that go off-screen
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
            score++;
        }
    });

    // Add new balls with speed based on level
    if (Math.random() < 0.02) {
        balls.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: Math.random() * (3 + ballSpeedIncrement * level) + 2 // Increase speed per level
        });
    }
}

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Display score table
function displayScoreTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";  // Set all text color to black
    ctx.font = "30px Arial"; // Increase the font size for "Game Over"
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, 100); // Increased font size

    ctx.font = "18px Arial";
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, 150);
    ctx.fillText(`Highest Score: ${highestScore}`, canvas.width / 2, 180); // Reduced gap

    // Display the highest level reached based on the highest score
    const highestLevelReached = getLevelForScore(highestScore);
    ctx.fillText(`Highest Level Reached: ${highestLevelReached}`, canvas.width / 2, 210); // Updated text and reduced gap

    // Draw the play again button box
    ctx.fillStyle = "yellow";
    ctx.fillRect(canvas.width / 2 - 60, 240, 120, 40);
    ctx.fillStyle = "black";
    ctx.fillText("Play Again", canvas.width / 2, 265);

    // Draw the complete border around the canvas
    ctx.strokeStyle = "black";  // Stroke color set to black
    ctx.lineWidth = 2; // Set the line width for the border
    ctx.strokeRect(0, 0, canvas.width, canvas.height); // Ensure the entire canvas is framed

    canvas.addEventListener("click", handleRestart);
}

// Handle restart on button click
function handleRestart(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if "Play Again" button was clicked
    if (x >= canvas.width / 2 - 60 && x <= canvas.width / 2 + 60 && y >= 240 && y <= 280) {
        canvas.removeEventListener("click", handleRestart);
        resetGame();
    }
}

// Reset game
function resetGame() {
    score = 0;
    level = 0; // Reset the level
    gameOver = false;
    balls.length = 0;
    player.x = 225;
    player.y = 400;
    gameLoop();
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Get the level based on the score
function getLevelForScore(score) {
    if (score <= 100) return 0;
    else if (score <= 200) return 1;
    else if (score <= 300) return 2;
    else if (score <= 400) return 3;
    else if (score > 500) return 5;
    return 0; // Default to level 0 if score is invalid
}

// Game loop
function gameLoop() {
    clearCanvas();

    if (gameOver) {
        // Update the highest score and highest level reached
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
        }
        // Save the highest level reached based on highest score
        const levelAtScore = getLevelForScore(highestScore);
        if (levelAtScore > highestLevel) {
            highestLevel = levelAtScore;
            localStorage.setItem("highestLevel", highestLevel); // Save highest level
        }

        displayScoreTable();
        return;
    }

    // Set level based on score ranges
    level = getLevelForScore(score);

    drawPlayer();
    drawBalls();
    updatePlayer();
    updateBalls();

    // Display score and level
    ctx.fillStyle = "black"; // Set text color to black for score and level
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 50, 20);
    ctx.fillText(`Level: ${level}`, canvas.width - 100, 20); // Display the current level, adjusted for the larger canvas

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
