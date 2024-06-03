// Get references to the HTML elements
var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

// Constants for local storage keys and rod names
const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

// Variables for game state and ball speed
let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

// Self-invoking function to initialize game state from local storage
(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === "null" || maxScore === "null") {
        // Alert for the first-time player
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = "Rod1";
    } else {
        // Alert for returning players with the highest score
        alert(rod + " has the maximum score of " + maxScore * 100);
    }

    // Initialize or reset the game board
    resetBoard(rod);
})();

// Function to reset the game board
function resetBoard(rodName) {
    // Set initial positions for rods and the ball
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

    // Place the ball based on the losing rod
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    // Reset score and game state
    score = 0;
    gameOn = false;
}

// Function to store the winner's information in local storage
function storeWin(rod, score) {
    // Update local storage if the score is higher than the previous max score
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    // Stop the ball movement and reset the game board
    clearInterval(movement);
    resetBoard(rod);

    // Display the winner's information in an alert
    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " +
        (maxScore * 100));
}

// Event listener for keypress events
window.addEventListener('keypress', function (event) {
    // Set rod movement speed
    let rodSpeed = 20;

    // Get the current position and dimensions of Rod 1
    let rodRect = rod1.getBoundingClientRect();

    // Move Rod 1 based on the key pressed
    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

    // Start the game when Enter key is pressed
    if (event.code === "Enter") {
        // Check if the game is not already running
        if (!gameOn) {
            gameOn = true;

            // Get initial position and dimensions of the ball
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            // Get dimensions of Rod 1 and Rod 2
            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            // Initialize ball movement
            movement = setInterval(function () {
                // Move the ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                // Get the current position of Rod 1 and Rod 2
                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                // Update the ball position
                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                // Check if the ball hits the window borders and reverse direction
                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }

                // Calculate the center position of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for collision with Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverse the Y direction
                    score++; // Increase the score

                    // Check if the ball is outside the bounds of Rod 1
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        // Store the winner and reset the board
                        storeWin(rod2Name, score);
                    }
                }

                // Check for collision with Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverse the Y direction
                    score++; // Increase the score

                    // Check if the ball is outside the bounds of Rod 2
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        // Store the winner and reset the board
                        storeWin(rod1Name, score);
                    }
                }
            }, 10);
        }
    }
});
