const gameBoardContainer = document.querySelector('.container');
const betWinButton = document.getElementById('bet-win');
const betLoseButton = document.getElementById('bet-lose');

const infoButton = document.getElementById('info-button');
const instructionsPanel = document.getElementById('instructions-panel');
const closeInstructions = document.getElementById('close-instructions');

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('bet-win').addEventListener('click', () => makeBet(true));
document.getElementById('bet-lose').addEventListener('click', () => makeBet(false));
infoButton.addEventListener('click', () => { instructionsPanel.classList.remove('hidden'); });
closeInstructions.addEventListener('click', () => { instructionsPanel.classList.add('hidden'); });

let score = 0;
let currentArray = [];
let currentPlayer = 1;
let timer;
let timeLeft;
let difficultySettings = {
    easy: { size: 5, time: 15, multiplier: 2, range: 10 },
    medium: { size: 8, time: 12, multiplier: 3, range: 20 },
    hard: { size: 15, time: 10, multiplier: 4, range: 50 },
    hero: { size: 20, time: 8, multiplier: 5, range: 100 }
};

function startGame() {
    // Reset the panel color and button highlights when starting a new game
    gameBoardContainer.classList.remove('win', 'lose');
    betWinButton.classList.remove('active-bet');
    betLoseButton.classList.remove('active-bet');
    
    const difficulty = document.getElementById('difficulty').value;
    const settings = difficultySettings[difficulty];
    currentArray = generateDistinctArray(settings.size, settings.range);
    timeLeft = settings.time;
    updateBoard();
    updateScore();
    document.getElementById('betting').style.display = 'block';
    document.getElementById('status').textContent = '';
    startTimer();
}

function generateDistinctArray(size, range) {
    const array = [];
    while (array.length < size) {
        const num = Math.floor(Math.random() * range) + 1;
        if (!array.includes(num)) {
            array.push(num);
        }
    }
    return array;
}

function updateBoard() {
    const gameBoard = document.getElementById('game-board');
	document.getElementById('start-game').disabled=true;
	document.getElementById('bet-win').disabled=false;
	document.getElementById('bet-lose').disabled=false;
	document.getElementById('difficulty').disabled=true;
    gameBoard.innerHTML = '';
    currentArray.forEach(num => {
        const element = document.createElement('div');
        element.className = 'number';
        element.textContent = num;
        gameBoard.appendChild(element);
    });
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function formatArrayMessage(wasWinning) {
	let message = wasWinning ? "winning" : "losing";
	return `array was ${message}`;
}

function startTimer() {
    clearInterval(timer);
	document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
			let wasWinning = checkIfWinningArray(currentArray);
			let message = formatArrayMessage(wasWinning);
            document.getElementById('status').textContent = `Time is up! You lose 1 credit. The ${message}`;
			document.getElementById('bet-win').disabled=true;
			document.getElementById('bet-lose').disabled=true;
			gameBoardContainer.classList.add('lose');
            updateScore();
            checkGameOver();
        }
    }, 1000);
}

function makeBet(isWinningBet) {
    document.getElementById('bet-win').disabled = true;
    document.getElementById('bet-lose').disabled = true;
    clearInterval(timer);
    
    const betAmount = 1;

    // Highlight the button the player pressed
    if (isWinningBet) {
        betWinButton.classList.add('active-bet');
    } else {
        betLoseButton.classList.add('active-bet');
    }
    
    const isWinningArray = checkIfWinningArray(currentArray);
    const playerWins = (isWinningBet && isWinningArray) || (!isWinningBet && !isWinningArray);
    
    if (playerWins) {
        const difficulty = document.getElementById('difficulty').value;
		const settings = difficultySettings[difficulty];
		score += betAmount * settings.multiplier;
        document.getElementById('status').textContent = `You won the game!`;
        gameBoardContainer.classList.add('win'); // Add win class
    } else {
        score -= betAmount;
        document.getElementById('status').textContent = `You lost the game!`;
        gameBoardContainer.classList.add('lose'); // Add lose class
    }
    
    updateScore();
    checkGameOver();
}

function checkIfWinningArray(arr) {
    
	let runningMax = 0;
    let moves = 0;
	arr.forEach((i) => {
		if (i > runningMax)
        {
            runningMax = i;
            moves++;
        }
	});
	return moves % 2 == 1;
}

function checkGameOver() {
	document.getElementById('difficulty').disabled=false;
	document.getElementById('betting').disabled=true;
	document.getElementById('start-game').disabled=false;
}
