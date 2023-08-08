
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const character = {
    x: 50,
    y: canvas.height / 2 - 12, // Adjusted for character height
    velocityY: 0,
    gravity: 0.3,
    jumpStrength: -6,
    width: 16, // Adjusted character width
    height: 16, // Adjusted character height
    frameIndex: 0,
    tickCount: 0,
    ticksPerFrame: 4, // Adjust this for animation speed
    numberOfFrames: 8, // Number of frames in your sprite sheet
    image: new Image(),
};

character.image.src = "character_sprite_sheet.png"; // Provide your sprite sheet image path

const pipes = [];
const pipeGap = 150;
const pipeWidth = 60;

let score = 0;
let highScore = 0;
let gameOver = false;
let gamePaused = false;
const jumpSound = new Audio("jump_sound.mp3"); // Provide your sound file


// Rest of the code

document.addEventListener("keydown", (event) => {
    if (!gameOver && event.key === " ") {
        character.velocityY = character.jumpStrength;

        // Play the jump sound on user interaction
        jumpSound.play();
    }

    if (gameOver && event.key === "") {
        restartGame();
        gameLoop();
    }
});

// Wait for the audio to be ready before starting the game loop
jumpSound.addEventListener("canplaythrough", () => {
    // Uncomment the following line to start the game loop
    // gameLoop();
});

function updateScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function showGameOverScreen() {
    ctx.fillStyle = "black";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 40);

    if (score > highScore) {
        highScore = score;
        ctx.fillText("New High Score!", canvas.width / 2 - 100, canvas.height / 2 + 80);
    }

    ctx.fillText("Press Space bar to Restart", canvas.width / 2 - 120, canvas.height / 2 + 120);
}

function restartGame() {
    score = 0;
    character.y = canvas.height / 2 - 15;
    pipes.length = 0;
    character.velocityY = 0;
    gameOver = false;
    gamePaused = false;
}

let gameStarted = false; // New variable to track if the game has started

function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB"); // Light blue color at the top
    gradient.addColorStop(1, "#FFFFFF"); // White color at the bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display a message until the game is started
    if (!gameStarted) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText("Press the space bar to start", canvas.width / 2 - 150, canvas.height / 2);
    } else {

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    character.velocityY += character.gravity;
    character.y += character.velocityY;




    if (!gamePaused) {
        pipes.forEach((pipe) => {
            pipe.x -= 2;
            if (
                !gameOver &&
                character.x + character.width > pipe.x &&
                character.x < pipe.x + pipeWidth &&
                (character.y < pipe.y || character.y + character.height > pipe.y + pipeGap)
            ) {
                gameOver = true;
                jumpSound.play();
            }

            if (!gameOver && pipe.x === character.x) {
                score++;
                jumpSound.play();
            }
        });
    }

    if (frameCount % 120 === 0 && !gameOver && !gamePaused) {
        const pipeY = Math.random() * (canvas.height - pipeGap);
        pipes.push({ x: canvas.width, y: pipeY });
    }

    character.tickCount++;

    if (character.tickCount > character.ticksPerFrame) {
        character.tickCount = 0;
        if (character.frameIndex < character.numberOfFrames - 1) {
            character.frameIndex++;
        } else {
            character.frameIndex = 0;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the current animation frame
    ctx.drawImage(
        character.image,
        character.frameIndex * character.width,
        0,
        character.width,
        character.height,
        character.x,
        character.y,
        character.width * 2.5, // Double the width for scaling
        character.height * 2.5// Double the height for scaling
    );

    function drawCloud(x, y) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
        ctx.arc(x + 60, y, 20, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Inside the gameLoop function, before drawing the pipes and character
    
    // Draw clouds
    drawCloud(100, 50);
    drawCloud(300, 100);
    drawCloud(500, 75);
    drawCloud(700, 50);
    
    // Inside the gameLoop function, where you draw the pipes
pipes.forEach((pipe) => {
    ctx.fillStyle = "green"; // Change to the desired pipe color
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);

    // Draw top pipe detail
    ctx.fillStyle = "#388E3C"; // Darker green color
    ctx.fillRect(pipe.x - 2, pipe.y - 15, pipeWidth + 4, 20);

    ctx.fillStyle = "#81C784"; // Lighter green color
    ctx.fillRect(pipe.x + 5, pipe.y + 5, pipeWidth - 10, 10);

    ctx.fillStyle = "green"; // Original pipe color
    ctx.fillRect(pipe.x + 15, pipe.y + 8, pipeWidth - 30, 4);

    // Draw bottom pipe detail
    ctx.fillStyle = "#388E3C"; // Darker green color
    ctx.fillRect(pipe.x - 2, pipe.y + pipeGap, pipeWidth + 4, 20);

    ctx.fillStyle = "#81C784"; // Lighter green color
    ctx.fillRect(pipe.x + 5, pipe.y + pipeGap - 10, pipeWidth - 10, 10);

    ctx.fillStyle = "green"; // Original pipe color
    ctx.fillRect(pipe.x + 15, pipe.y + pipeGap - 12, pipeWidth - 30, 4);
});


    pipes.forEach((pipe) => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });

    if (character.y + character.height > canvas.height || character.y < 0) {
        gameOver = true;
        jumpSound.play();
    }

    if (!gameOver && !gamePaused) {
        updateScore();
        requestAnimationFrame(gameLoop);
        frameCount++;
    } else {
        showGameOverScreen();
    }
}

}

document.addEventListener("keydown", (event) => {
    if (!gameStarted && event.key === " ") {
        gameStarted = true;
        gameLoop(); // Start the game loop
    }
    
document.addEventListener("keydown", (event) => {
    if (!gameOver && event.key === " ") {
        character.velocityY = character.jumpStrength;
        jumpSound.play();
    }
});
    if (gameOver && event.key === " ") {
        restartGame();
        gameLoop();
    }
});

let frameCount = 0;
gameLoop();
