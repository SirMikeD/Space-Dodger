document.addEventListener('DOMContentLoaded', function () {
    // DOM elements - refers to these nodes in the DOM tree, representing HTML elements such as <div>,
    // <p>, <span>, <img>, etc. Each element in the DOM has properties and methods that allow you to 
    // interact with and modify them dynamically.
    const gameArea = document.getElementById('game-area');
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const topScoresList = document.getElementById('top-scores');
    const timerDisplay = document.getElementById('timer');

    // Initialize variables
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    let playerNameEntered = false;
    let baseInterval = 50; // Initial interval for moving blocks
    let speedIncreaseInterval = 10000; // Interval for increasing speed (in milliseconds)
    let cursor; // Declare cursor variable
    let startTime; // Variable to store start time
    let score = 0; // Initialize score variable

    // Render top scores
    renderTopScores();

    // Function to render top scores
    function renderTopScores() {
        topScores.sort((a, b) => a.score - b.score); // Sort topScores array by score in ascending order
        topScoresList.innerHTML = ''; // Clear existing top scores
        // Display top 10 scores
        for (let i = 0; i < Math.min(10, topScores.length); i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `${topScores[i].name}: ${topScores[i].score} seconds`;
            topScoresList.appendChild(listItem);
        }
    }

// Function to start the game
function startGame() {
    // Hide start menu and show game area
    startMenu.style.display = 'none';
    gameArea.classList.add('game-started');
    gameArea.style.cursor = 'none';
    timerDisplay.style.display = 'block'; // Show timer display when the game starts
    attachCursor(); // Attach cursor to the game area
    startTimer(); // Start the game timer

    // Generate a random interval for creating green circles (between 3 and 8 seconds)
    const interval = Math.random() * 5000 + 3000;

    // Create a green circle at random intervals
    setInterval(createGreenCircle, interval);

    // Set interval for increasing speed
    setInterval(increaseSpeed, speedIncreaseInterval);

    // Move red blocks immediately after starting the game and periodically
    moveRedBlocks();
    setInterval(moveRedBlocks, baseInterval);
    setInterval(createRedBlock, 1000);

    // Move black boxes immediately after starting the game and periodically
    moveBlackBoxes();
    setInterval(moveBlackBoxes, baseInterval);
    setInterval(createBlackBox, 2000);

    // Move dark purple blocks immediately after starting the game and periodically
    moveDarkPurpleBlocks();
    setInterval(moveDarkPurpleBlocks, baseInterval);
    setInterval(createDarkPurpleBlock, 2000);
}

    // Function to increase timer and score
function increaseTimerAndScore(seconds) {
    startTime += seconds * 1000; // Add seconds to the start time
    score += seconds; // Add seconds to the score
    updateTimer(); // Update the timer display
    updateScore(); // Update the score display
}

    // Function to increase speed
    function increaseSpeed() {
        baseInterval -= 5; // Decrease the base interval by 5 milliseconds
        console.log("Speed increased!");
    }

// Function to attach cursor to the game area
function attachCursor() {
    cursor = document.createElement('div'); // Assign to the global cursor variable
    cursor.classList.add('cursor');
    gameArea.appendChild(cursor);

    // Update cursor position based on mouse movement
    function updateCursorPosition(event) {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    
        const cursorRect = cursor.getBoundingClientRect();
        
    
        const redBlocks = document.querySelectorAll('.red');
        redBlocks.forEach(block => {
            const blockRect = block.getBoundingClientRect();
            if (isColliding(cursorRect, blockRect)) {
                endGame(); // End the game if collision occurs
            }
        });
    
        const greenCircles = document.querySelectorAll('.green-circle');
        greenCircles.forEach(circle => {
            const circleRect = circle.getBoundingClientRect();
            if (isColliding(cursorRect, circleRect)) {
                circle.parentNode.removeChild(circle); // Remove the green circle
                increaseTimer(1); // Increase timer by 1 second
            }
        });
    }
    

    document.addEventListener('mousemove', updateCursorPosition);

    // Cleanup event listener when game ends
    function removeCursorPositionListener() {
        document.removeEventListener('mousemove', updateCursorPosition);
    }

    // Add event listener to handle game end
    document.addEventListener('gameEnd', removeCursorPositionListener);
}

    // Function to start the game timer
    function startTimer() {
        startTime = performance.now(); // Record the start time
        updateTimer(); // Update the timer display
        // Update the timer display every 100 milliseconds
        setInterval(updateTimer, 100);
    }

    // Function to update the game timer display
    function updateTimer() {
        const currentTime = performance.now(); // Get the current time
        const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
        timerDisplay.textContent = `Time: ${elapsedTime.toFixed(2)} seconds`; // Update the timer display
    }

// Function to create a new red block
function createRedBlock() {
    console.log("Creating red block...");
    const redBlock = document.createElement('div');
    redBlock.classList.add('red'); // Add class for the red block

    // Append the red block to the game area
    gameArea.appendChild(redBlock);

    // Set initial position at a random horizontal position at the top of the screen
    redBlock.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`; // Random horizontal position
    redBlock.style.top = `0px`; // Start from the top

    // Randomize the falling speed
    const fallingSpeed = Math.random() * 3 + 1; // Random value between 1 and 4
    const moveInterval = setInterval(() => {
        // Move the red block down
        redBlock.style.top = `${parseFloat(redBlock.style.top) + fallingSpeed}px`;

        // Remove block if it goes out of bounds
        if (parseFloat(redBlock.style.top) > gameArea.clientHeight) {
            clearInterval(moveInterval); // Stop the interval
            gameArea.removeChild(redBlock); // Remove the red block from the game area
        }
    }, 50); // Move the red block every 50 milliseconds
}

// Function to move red blocks smoothly
function moveRedBlocks() {
    const redBlocks = document.querySelectorAll('.red');
    redBlocks.forEach(block => {
        // Generate random velocities for horizontal and vertical movement
        const velocityX = (Math.random() - 0.5) * 2; // Random value between -1 and 1
        const velocityY = Math.random() * 2 + 1; // Random value between 1 and 3
        // Update block position based on current velocity
        block.style.top = `${block.offsetTop + velocityY}px`; // Move block vertically
        block.style.left = `${block.offsetLeft + velocityX}px`; // Move block horizontally

        // Remove block if it goes out of bounds
        if (
            block.offsetTop > gameArea.clientHeight ||
            block.offsetLeft < -50 ||
            block.offsetLeft > gameArea.clientWidth
        ) {
            gameArea.removeChild(block);
        } else {
            // Check for collision with cursor
            const cursorRect = cursor.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();
            if (isColliding(cursorRect, blockRect)) {
                endGame(); // End the game if collision occurs
            }
        }
    });
}

    // Function to move black boxes horizontally
    function moveBlackBoxes() {
        const blackBoxes = document.querySelectorAll('.black');
        blackBoxes.forEach(blackBox => {
            blackBox.style.left = `${parseInt(blackBox.style.left) + 5}px`; // Move black box to the right
            // Remove black box if it goes out of bounds
            if (parseInt(blackBox.style.left) > gameArea.clientWidth) {
                gameArea.removeChild(blackBox);
            } else {
                // Check for collision with cursor
                const cursorRect = cursor.getBoundingClientRect();
                const blackBoxRect = blackBox.getBoundingClientRect();
                if (isColliding(cursorRect, blackBoxRect)) {
                    endGame(); // End the game if collision occurs
                }
            }
        });
    }

    // Function to create a new black box
    function createBlackBox() {
        const size = Math.floor(Math.random() * 8 + 1); // Random size from 1 to 8
        const blackBox = document.createElement('div');
        blackBox.classList.add('block', 'black');
        blackBox.style.width = `${size * 20}px`; // Set width based on size
        blackBox.style.height = `${size * 20}px`; // Set height based on size
        blackBox.style.left = `${Math.random() < 0.5 ? -20 : gameArea.clientWidth + 20}px`; // Random horizontal position (left or right side)
        blackBox.style.top = `${Math.random() * (gameArea.clientHeight - 20)}px`; // Random vertical position
        gameArea.appendChild(blackBox);
    }
    
    function moveDarkPurpleBlocks() {
        const darkPurpleBlocks = document.querySelectorAll('.darkpurple');
        darkPurpleBlocks.forEach(darkPurpleBlock => {
            darkPurpleBlock.style.left = `${parseInt(darkPurpleBlock.style.left) - 5}px`; // Move dark purple block to the left
            if (parseInt(darkPurpleBlock.style.left) < -20) {
                gameArea.removeChild(darkPurpleBlock);
            } else {
                // Check for collision with cursor
                const cursorRect = cursor.getBoundingClientRect();
                const darkPurpleBlockRect = darkPurpleBlock.getBoundingClientRect();
                if (isColliding(cursorRect, darkPurpleBlockRect)) {
                    endGame();
                }
            }
        });
    }

    function createDarkPurpleBlock() {
        // Random size for the dark purple block (1 to 9)
        const size = Math.floor(Math.random() * 9 + 1);
        // Random size for the image (30px to 80px)
        const imageSize = Math.floor(Math.random() * 50) + 30;
        // Create a new dark purple block element
        const darkPurpleBlock = document.createElement('div');
        darkPurpleBlock.classList.add('block', 'darkpurple'); // Add CSS classes to the block
        darkPurpleBlock.style.width = `${size * 20}px`; // Set width based on size
        darkPurpleBlock.style.height = `${size * 20}px`; // Set height based on size
        // Random horizontal position (left or right side)
        darkPurpleBlock.style.left = `${Math.random() < 0.5 ? -20 : gameArea.clientWidth + 20}px`;
        // Random vertical position
        darkPurpleBlock.style.top = `${Math.random() * (gameArea.clientHeight - 20)}px`;
        darkPurpleBlock.style.backgroundSize = `${imageSize}px`; // Set background size for the image
        gameArea.appendChild(darkPurpleBlock); // Add the block to the game area
    }
    
    function createGreenCircle() {
        // Create a new circle element
        const circle = document.createElement('div');
        circle.classList.add('green-circle');
    
        // Set random position for the circle within the game area
        circle.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`; // Subtract circle width to ensure it stays within bounds
        circle.style.top = `${Math.random() * (gameArea.clientHeight - 40)}px`; // Subtract circle height to ensure it stays within bounds
    
        // Add mouseover event listener to the circle
        circle.addEventListener('mouseover', function () {
            gameArea.removeChild(circle); // Remove the green circle
            increaseTimer(1); // Increase timer by 1 second
        });
    
        // Automatically remove the circle after 7 seconds
        setTimeout(() => {
            if (gameArea.contains(circle)) {
                // Check if the circle is still on the game area
                gameArea.removeChild(circle); // Remove the green circle
            }
        }, 7000);
    
        // Append the circle to the game area
        gameArea.appendChild(circle);
    }

    
// Function to update the score display
function updateScore() {
    // Assuming you have a score display element with id 'score-display'
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.textContent = `Score: ${score}`; // Update the score display
}
    
function endGame() {
    const gameTime = calculateGameTime(); // Calculate game time
    const score = Math.floor(gameTime); // Score is equivalent to the integer part of the game time
    const gameTimeInSeconds = gameTime / 1000; // Convert game time to seconds
    alert(`Game Over!\nTime Played: ${gameTimeInSeconds.toFixed(2)} seconds\nScore: ${score}`); // Display game over alert with time played and score
    startMenu.style.display = 'block'; // Show the start menu
    gameArea.classList.remove('game-started'); // Remove game-started class from game area
    gameArea.style.cursor = 'auto'; // Change cursor style to auto
    timerDisplay.style.display = 'none'; // Hide timer display when the game ends

    // Decrease speed or increase interval time
    baseInterval += 5; // Increase the base interval by 5 milliseconds
    console.log("Speed decreased!");

    // Check if the player's name has already been entered
    if (!playerNameEntered) {
        const playerName = prompt('Enter your name:'); // Prompt user to enter their name
        if (playerName) {
            topScores.push({ name: playerName, score: score }); // Add player's score to topScores array
            localStorage.setItem('topScores', JSON.stringify(topScores)); // Store top scores in local storage
            renderTopScores(); // Render updated top scores
        }
        playerNameEntered = true; // Set playerNameEntered to true
    }

    gameArea.innerHTML = ''; // Clear the game area
}

    function calculateGameTime() {
        const currentTime = performance.now(); // Get the current time
        const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
        return elapsedTime.toFixed(2); // Round to 2 decimal places and return
    }
    
    function isColliding(rect1, rect2) {
        // Check if the two rectangles are colliding
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }
    
    function resetScores() {
        localStorage.removeItem('topScores'); // Remove top scores from local storage
        topScores = []; // Clear top scores array
        renderTopScores(); // Render empty top scores list
    }
    
    // Add event listener for start button click event
    startButton.addEventListener('click', function() {
        console.log('Start button clicked!');
        startGame(); // Call the startGame function
    });
    // Add event listener for reset button click event
    resetButton.addEventListener('click', resetScores);
});