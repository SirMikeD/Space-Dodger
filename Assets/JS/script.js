document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('game-area');
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const topScoresList = document.getElementById('top-scores');
    const timerDisplay = document.getElementById('timer');

    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];

    let playerNameEntered = false;

    let baseInterval = 50; // Initial interval for moving blocks

    let speedIncreaseInterval = 10000; // Interval for increasing speed (in milliseconds)


    renderTopScores();

    function renderTopScores() {
        // Sort topScores array by score in ascending order
        topScores.sort((a, b) => a.score - b.score);
        // Display top 10 scores
        topScoresList.innerHTML = '';
        for (let i = 0; i < Math.min(10, topScores.length); i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `${topScores[i].name}: ${topScores[i].score} seconds`;
            topScoresList.appendChild(listItem);
        }
    }

    function startGame() {
        startMenu.style.display = 'none';
        gameArea.classList.add('game-started');
        gameArea.style.cursor = 'none';
        timerDisplay.style.display = 'block'; // Show timer display when the game starts
        attachCursor();
        startTimer();
        setInterval(createGreenCircle, 5000); // Create a green circle every 5 seconds
        setInterval(increaseSpeed, speedIncreaseInterval); // Set interval for increasing speed
        moveRedBlocks(); // Move red blocks immediately after starting the game
        setInterval(moveRedBlocks, baseInterval); // Use baseInterval for moving red blocks
        setInterval(createRedBlock, 2000);
        moveBlackBoxes(); // Move black boxes immediately after starting the game
        setInterval(moveBlackBoxes, baseInterval); // Use baseInterval for moving black boxes
        setInterval(createBlackBox, 2000);
        moveDarkPurpleBlocks(); // Move dark purple blocks immediately after starting the game
        setInterval(moveDarkPurpleBlocks, baseInterval); // Use baseInterval for moving dark purple blocks
        setInterval(createDarkPurpleBlock, 2000);
    }
    
    function increaseSpeed() {
        baseInterval -= 5; // Decrease the base interval by 5 milliseconds
        console.log("Speed increased!");
    }

    function increaseTimer(seconds) {
        startTime += seconds * 1000; // Add seconds to the start time
        updateTimer(); // Update the timer display
    }
    
    let cursor; // Declare cursor variable
    let startTime; // Variable to store start time

    function attachCursor() {
        cursor = document.createElement('div'); // Assign to the global cursor variable
        cursor.classList.add('cursor');
        gameArea.appendChild(cursor);
    
        document.addEventListener('mousemove', function (event) {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
    
            const cursorRect = cursor.getBoundingClientRect();
            const greenCircles = document.querySelectorAll('.green-circle');
            greenCircles.forEach(circle => {
                const circleRect = circle.getBoundingClientRect();
                if (isColliding(cursorRect, circleRect)) {
                    circle.parentNode.removeChild(circle); // Remove the green circle
                    increaseTimer(1); // Increase timer by 1 second
                }
            });
        });
    }

    function startTimer() {
        startTime = performance.now(); // Record the start time
        updateTimer(); // Update the timer display
        // Update the timer display every 100 milliseconds
        setInterval(updateTimer, 100);
    }

    function updateTimer() {
        const currentTime = performance.now(); // Get the current time
        const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
        timerDisplay.textContent = `Time: ${elapsedTime.toFixed(2)} seconds`; // Update the timer display
    }

    function moveRedBlocks() {
        const redBlocks = document.querySelectorAll('.red');
        redBlocks.forEach(block => {
            block.style.top = `${block.offsetTop + 5}px`; // Move block downwards
            if (block.offsetTop > gameArea.clientHeight) {
                gameArea.removeChild(block);
            }
        });
    }

    function createRedBlock() {
        const block = document.createElement('div');
        block.classList.add('block', 'red');
        block.style.left = `${Math.random() * (gameArea.clientWidth - 20)}px`; // Random horizontal position
        block.style.top = '-20px'; // Start from top of the screen
        gameArea.appendChild(block);
    }

    function moveBlackBoxes() {
        const blackBoxes = document.querySelectorAll('.black');
        blackBoxes.forEach(blackBox => {
            blackBox.style.left = `${parseInt(blackBox.style.left) + 5}px`; // Move black box to the right
            if (parseInt(blackBox.style.left) > gameArea.clientWidth) {
                gameArea.removeChild(blackBox);
            } else {
                // Check for collision with cursor
                const cursorRect = cursor.getBoundingClientRect();
                const blackBoxRect = blackBox.getBoundingClientRect();
                if (isColliding(cursorRect, blackBoxRect)) {
                    endGame();
                }
            }
        });
    }
    
    function createBlackBox() {
        const size = Math.floor(Math.random() * 4 + 1); // Random size from 1 to 4
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
        const size = Math.floor(Math.random() * 4 + 1); // Random size from 1 to 4
        const imageSize = Math.floor(Math.random() * 50) + 30; // Random size for image from 30px to 80px
        const darkPurpleBlock = document.createElement('div');
        darkPurpleBlock.classList.add('block', 'darkpurple');
        darkPurpleBlock.style.width = `${size * 20}px`; // Set width based on size
        darkPurpleBlock.style.height = `${size * 20}px`; // Set height based on size
        darkPurpleBlock.style.left = `${Math.random() < 0.5 ? -20 : gameArea.clientWidth + 20}px`; // Random horizontal position (left or right side)
        darkPurpleBlock.style.top = `${Math.random() * (gameArea.clientHeight - 20)}px`; // Random vertical position
        darkPurpleBlock.style.backgroundSize = `${imageSize}px`; // Set background size for the image
        gameArea.appendChild(darkPurpleBlock);
    }

    function createGreenCircle() {
        const circle = document.createElement('div');
        circle.classList.add('green-circle');
        circle.style.left = `${Math.random() * (gameArea.clientWidth - 20)}px`; // Random horizontal position
        circle.style.top = `${Math.random() * (gameArea.clientHeight - 20)}px`; // Random vertical position
        gameArea.appendChild(circle);
    
        // Add event listener to detect hover over the green circle
        circle.addEventListener('mouseover', function () {
            gameArea.removeChild(circle); // Remove the green circle
            increaseTimer(1); // Increase timer by 1 second
        });
    
        // Automatically remove the circle after 7 seconds
        setTimeout(() => {
            if (gameArea.contains(circle)) { // Check if the circle is still on the game area
                gameArea.removeChild(circle); // Remove the green circle
            }
        }, 7000);
    }

    function increaseTimer(seconds) {
        startTime += seconds * 1000; // Add seconds to the start time
        updateTimer(); // Update the timer display
    }
    
    function endGame() {
        alert('Game Over!');
        startMenu.style.display = 'block';
        gameArea.classList.remove('game-started');
        gameArea.style.cursor = 'auto';
        timerDisplay.style.display = 'none'; // Hide timer display when the game ends
    
        // Decrease speed or increase interval time
        baseInterval += 5; // Increase the base interval by 5 milliseconds
        console.log("Speed decreased!");
    
        // Check if the player's name has already been entered
        if (!playerNameEntered) {
            const playerName = prompt('Enter your name:');
            if (playerName) {
                const gameTime = calculateGameTime();
                topScores.push({ name: playerName, score: gameTime });
                localStorage.setItem('topScores', JSON.stringify(topScores));
                renderTopScores();
            }
            // Set playerNameEntered to true to indicate that the player's name has been entered
            playerNameEntered = true;
        }
    
        gameArea.innerHTML = '';
    }

    function calculateGameTime() {
        const currentTime = performance.now(); // Get the current time
        const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
        return elapsedTime.toFixed(2); // Round to 2 decimal places
    }
    
    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }
    
    function resetScores() {
        localStorage.removeItem('topScores');
        topScores = [];
        renderTopScores();
    }
    
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetScores); // Add event listener for reset button
});
