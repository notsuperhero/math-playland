// --- Tabs ---
const tabs = {
    calculator: document.getElementById('tab-calculator'),
    game: document.getElementById('tab-game')
};
const contents = {
    calculator: document.getElementById('content-calculator'),
    game: document.getElementById('content-game')
};

function switchTab(tabName) {
    // Update buttons
    Object.keys(tabs).forEach(key => {
        const btn = tabs[key];
        if (key === tabName) {
            btn.classList.remove('text-muted-foreground', 'hover:text-foreground');
            if (key === 'calculator') {
                btn.classList.add('gradient-cool', 'text-primary-foreground', 'shadow-button');
            } else {
                btn.classList.add('gradient-warm', 'text-primary-foreground', 'shadow-button');
            }
        } else {
            btn.classList.remove('gradient-cool', 'gradient-warm', 'text-primary-foreground', 'shadow-button');
            btn.classList.add('text-muted-foreground', 'hover:text-foreground');
        }
    });

    // Update Content
    Object.keys(contents).forEach(key => {
        if (key === tabName) {
            contents[key].classList.add('active');
        } else {
            contents[key].classList.remove('active');
        }
    });
}

document.getElementById('tab-calculator').addEventListener('click', () => switchTab('calculator'));
document.getElementById('tab-game').addEventListener('click', () => switchTab('game'));


// --- Calculator Logic ---
let calcDisplay = "0";
let calcPrevValue = null;
let calcOperation = null;
let calcWaitingForOperand = false;

const displayElement = document.getElementById('calc-display');
const subDisplayElement = document.getElementById('calc-sub-display');

function updateCalcDisplay() {
    displayElement.textContent = calcDisplay;
    if (calcOperation && calcPrevValue) {
        subDisplayElement.textContent = `${calcPrevValue} ${calcOperation}`;
    } else {
        subDisplayElement.textContent = '';
    }
}

function calcInputNumber(num) {
    if (calcWaitingForOperand) {
        calcDisplay = num;
        calcWaitingForOperand = false;
    } else {
        calcDisplay = calcDisplay === "0" ? num : calcDisplay + num;
    }
    updateCalcDisplay();
}

function calcInputDecimal() {
    if (calcWaitingForOperand) {
        calcDisplay = "0.";
        calcWaitingForOperand = false;
    } else if (!calcDisplay.includes(".")) {
        calcDisplay += ".";
    }
    updateCalcDisplay();
}

function calcClear() {
    calcDisplay = "0";
    calcPrevValue = null;
    calcOperation = null;
    calcWaitingForOperand = false;
    updateCalcDisplay();
}

function calcPerformOperation(nextOp) {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
        calcPrevValue = calcDisplay;
    } else if (calcOperation) {
        const currentValue = parseFloat(calcPrevValue);
        let result = 0;
        switch (calcOperation) {
            case "+": result = currentValue + inputValue; break;
            case "-": result = currentValue - inputValue; break;
            case "×": result = currentValue * inputValue; break;
            case "÷": result = inputValue !== 0 ? currentValue / inputValue : 0; break;
        }
        calcDisplay = String(result);
        calcPrevValue = String(result);
    }

    calcWaitingForOperand = true;
    calcOperation = nextOp;
    updateCalcDisplay();
}

function calcCalculate() {
    if (!calcOperation || calcPrevValue === null) return;
    const inputValue = parseFloat(calcDisplay);
    const currentValue = parseFloat(calcPrevValue);
    let result = 0;
    switch (calcOperation) {
        case "+": result = currentValue + inputValue; break;
        case "-": result = currentValue - inputValue; break;
        case "×": result = currentValue * inputValue; break;
        case "÷": result = inputValue !== 0 ? currentValue / inputValue : 0; break;
    }
    calcDisplay = String(result);
    calcPrevValue = null;
    calcOperation = null;
    calcWaitingForOperand = true;
    updateCalcDisplay();
}

document.querySelectorAll('[data-calc-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const action = btn.dataset.calcAction;
        const value = btn.dataset.calcValue;
        
        if (action === 'number') calcInputNumber(value);
        if (action === 'decimal') calcInputDecimal();
        if (action === 'clear') calcClear();
        if (action === 'operator') calcPerformOperation(value);
        if (action === 'calculate') calcCalculate();
        if (action === 'sign') {
            calcDisplay = String(parseFloat(calcDisplay) * -1);
            updateCalcDisplay();
        }
        if (action === 'percent') {
            calcDisplay = String(parseFloat(calcDisplay) / 100);
            updateCalcDisplay();
        }
    });
});


// --- Math Game Logic ---
let gameDifficulty = "easy";
let gameScore = 0;
let gameStreak = 0;
let gameProblem = null;
let gameUserAnswer = "";
let gameStarted = false;

const gameMenu = document.getElementById('game-menu');
const gameBoard = document.getElementById('game-board');
const scoreEl = document.getElementById('game-score');
const streakContainer = document.getElementById('game-streak-stars');
const problemEl = document.getElementById('game-problem');
const answerDisplayEl = document.getElementById('game-answer-display');
const feedbackEl = document.getElementById('game-feedback');
const celebrationOverlay = document.getElementById('celebration-overlay');
const celebrationText = document.getElementById('celebration-text');

function updateGameUI() {
    if (!gameStarted) {
        gameMenu.classList.remove('hidden');
        gameBoard.classList.add('hidden');
    } else {
        gameMenu.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        
        scoreEl.textContent = gameScore;
        
        streakContainer.innerHTML = '';
        const starCount = Math.min(gameStreak, 5);
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('span');
            // Star SVG
            star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
            star.className = 'animate-pop inline-block';
            streakContainer.appendChild(star);
        }
        
        if (gameProblem) {
            problemEl.textContent = `${gameProblem.num1} ${gameProblem.operation} ${gameProblem.num2} = ?`;
        }
        
        answerDisplayEl.textContent = gameUserAnswer || "_";
    }
}

function gameGenerateProblem() {
    const operations = gameDifficulty === "easy" ? ["+"] : gameDifficulty === "medium" ? ["+", "-"] : ["+", "-", "×"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let maxNum = gameDifficulty === "easy" ? 10 : gameDifficulty === "medium" ? 20 : 12;
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === "-" && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    let answer = 0;
    switch (operation) {
        case "+": answer = num1 + num2; break;
        case "-": answer = num1 - num2; break;
        case "×": answer = num1 * num2; break;
    }
    
    gameProblem = { num1, num2, operation, answer };
    gameUserAnswer = "";
    updateGameUI();
    
    answerDisplayEl.classList.remove('text-success', 'text-destructive', 'text-foreground');
    answerDisplayEl.classList.add('text-foreground');
    feedbackEl.textContent = '';
}

function gameCheckAnswer() {
    if (!gameProblem || gameUserAnswer === "") return;
    
    const isCorrect = parseInt(gameUserAnswer) === gameProblem.answer;
    
    if (isCorrect) {
        answerDisplayEl.classList.remove('text-foreground');
        answerDisplayEl.classList.add('text-success');
        const encouragements = ["Great job!", "You're amazing!", "Keep it up!", "Brilliant!", "Fantastic!"];
        feedbackEl.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedbackEl.className = "text-lg font-nunito font-semibold text-success mt-2";
        
        const points = gameDifficulty === "easy" ? 10 : gameDifficulty === "medium" ? 20 : 30;
        gameScore += points + (gameStreak * 5);
        gameStreak++;
        
        if (gameStreak > 0 && gameStreak % 5 === 0) {
            showCelebration();
        }
        
        setTimeout(() => {
            gameGenerateProblem();
        }, 1000);
        
    } else {
        answerDisplayEl.classList.remove('text-foreground');
        answerDisplayEl.classList.add('text-destructive');
        feedbackEl.textContent = "Try again!";
        feedbackEl.className = "text-lg font-nunito font-semibold text-destructive mt-2";
        
        gameStreak = 0;
        setTimeout(() => {
             feedbackEl.textContent = '';
             answerDisplayEl.classList.remove('text-destructive');
             answerDisplayEl.classList.add('text-foreground');
        }, 1500);
    }
    updateGameUI();
}

function showCelebration() {
    celebrationText.textContent = `${gameStreak} in a row!`;
    celebrationOverlay.classList.add('active');
    setTimeout(() => {
        celebrationOverlay.classList.remove('active');
    }, 2000);
}

function gameStart(diff) {
    gameDifficulty = diff;
    gameScore = 0;
    gameStreak = 0;
    gameStarted = true;
    gameGenerateProblem();
    updateGameUI();
}

function gameStop() {
    gameStarted = false;
    updateGameUI();
}

document.querySelectorAll('[data-game-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => gameStart(btn.dataset.gameDifficulty));
});

document.getElementById('btn-game-back').addEventListener('click', gameStop);
document.getElementById('btn-game-check').addEventListener('click', gameCheckAnswer);

document.querySelectorAll('[data-game-num]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (gameUserAnswer.length < 4) {
            gameUserAnswer += btn.dataset.gameNum;
            updateGameUI();
        }
    });
});

document.getElementById('btn-game-clear').addEventListener('click', () => {
    gameUserAnswer = "";
    updateGameUI();
});

document.getElementById('btn-game-backspace').addEventListener('click', () => {
    gameUserAnswer = gameUserAnswer.slice(0, -1);
    updateGameUI();
});

// Initial Render
updateCalcDisplay();
switchTab('calculator');
