document.addEventListener('DOMContentLoaded', () => {
    console.log("Math Playland: Initializing...");

    // --- DOM Elements ---
    const tabs = {
        calculator: document.getElementById('tab-calculator'),
        game: document.getElementById('tab-game')
    };
    
    const contents = {
        calculator: document.getElementById('content-calculator'),
        game: document.getElementById('content-game')
    };

    // Calculator Elements
    const displayElement = document.getElementById('calc-display');
    const subDisplayElement = document.getElementById('calc-sub-display');
    const calcButtons = document.querySelectorAll('[data-calc-action]');

    // Game Elements
    const gameMenu = document.getElementById('game-menu');
    const gameBoard = document.getElementById('game-board');
    const scoreEl = document.getElementById('game-score');
    const streakContainer = document.getElementById('game-streak-stars');
    const problemEl = document.getElementById('game-problem');
    const answerDisplayEl = document.getElementById('game-answer-display');
    const feedbackEl = document.getElementById('game-feedback');
    const celebrationOverlay = document.getElementById('celebration-overlay');
    const celebrationText = document.getElementById('celebration-text');
    
    // Game Buttons
    const difficultyButtons = document.querySelectorAll('[data-game-difficulty]');
    const gameNumButtons = document.querySelectorAll('[data-game-num]');
    const btnGameBack = document.getElementById('btn-game-back');
    const btnGameCheck = document.getElementById('btn-game-check');
    const btnGameClear = document.getElementById('btn-game-clear');
    const btnGameBackspace = document.getElementById('btn-game-backspace');

    // --- State ---
    let calcState = {
        display: "0",
        prevValue: null,
        operation: null,
        waitingForOperand: false
    };

    let gameState = {
        difficulty: "easy",
        score: 0,
        streak: 0,
        problem: null,
        userAnswer: "",
        started: false
    };

    // --- Tab Logic ---
    function switchTab(tabName) {
        console.log(`Switching to tab: ${tabName}`);
        
        // Update Buttons
        Object.entries(tabs).forEach(([key, btn]) => {
            if (!btn) return;
            if (key === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Content
        Object.entries(contents).forEach(([key, content]) => {
            if (!content) return;
            if (key === tabName) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    if (tabs.calculator) tabs.calculator.addEventListener('click', () => switchTab('calculator'));
    if (tabs.game) tabs.game.addEventListener('click', () => switchTab('game'));

    // --- Calculator Logic ---
    function updateCalcDisplay() {
        if (displayElement) displayElement.textContent = calcState.display;
        if (subDisplayElement) {
            if (calcState.operation && calcState.prevValue) {
                subDisplayElement.textContent = `${calcState.prevValue} ${calcState.operation}`;
            } else {
                subDisplayElement.textContent = '';
            }
        }
    }

    function handleCalcInput(action, value) {
        switch (action) {
            case 'number':
                if (calcState.waitingForOperand) {
                    calcState.display = value;
                    calcState.waitingForOperand = false;
                } else {
                    calcState.display = calcState.display === "0" ? value : calcState.display + value;
                }
                break;
            case 'decimal':
                if (calcState.waitingForOperand) {
                    calcState.display = "0.";
                    calcState.waitingForOperand = false;
                } else if (!calcState.display.includes(".")) {
                    calcState.display += ".";
                }
                break;
            case 'clear':
                calcState.display = "0";
                calcState.prevValue = null;
                calcState.operation = null;
                calcState.waitingForOperand = false;
                break;
            case 'sign':
                calcState.display = String(parseFloat(calcState.display) * -1);
                break;
            case 'percent':
                calcState.display = String(parseFloat(calcState.display) / 100);
                break;
            case 'operator':
                const inputValue = parseFloat(calcState.display);
                if (calcState.prevValue === null) {
                    calcState.prevValue = calcState.display;
                } else if (calcState.operation) {
                    const result = calculate(parseFloat(calcState.prevValue), inputValue, calcState.operation);
                    calcState.display = String(result);
                    calcState.prevValue = String(result);
                }
                calcState.waitingForOperand = true;
                calcState.operation = value;
                break;
            case 'calculate':
                if (!calcState.operation || calcState.prevValue === null) return;
                const result = calculate(parseFloat(calcState.prevValue), parseFloat(calcState.display), calcState.operation);
                calcState.display = String(result);
                calcState.prevValue = null;
                calcState.operation = null;
                calcState.waitingForOperand = true;
                break;
        }
        updateCalcDisplay();
    }

    function calculate(a, b, op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "×": return a * b;
            case "÷": return b !== 0 ? a / b : 0;
            default: return b;
        }
    }

    calcButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleCalcInput(btn.dataset.calcAction, btn.dataset.calcValue);
        });
    });

    // --- Math Game Logic ---
    function updateGameUI() {
        if (!gameMenu || !gameBoard) return;

        if (!gameState.started) {
            gameMenu.classList.remove('hidden');
            gameBoard.classList.add('hidden');
        } else {
            gameMenu.classList.add('hidden');
            gameBoard.classList.remove('hidden');
            
            if (scoreEl) scoreEl.textContent = gameState.score;
            if (problemEl && gameState.problem) {
                problemEl.textContent = `${gameState.problem.num1} ${gameState.problem.operation} ${gameState.problem.num2} = ?`;
            }
            if (answerDisplayEl) answerDisplayEl.textContent = gameState.userAnswer || "_";
            
            // Render stars
            if (streakContainer) {
                streakContainer.innerHTML = '';
                const starCount = Math.min(gameState.streak, 5);
                for (let i = 0; i < starCount; i++) {
                    const star = document.createElement('span');
                    star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
                    star.className = 'animate-pop inline-block';
                    streakContainer.appendChild(star);
                }
            }
        }
    }

    function generateProblem() {
        const operations = gameState.difficulty === "easy" ? ["+"] : gameState.difficulty === "medium" ? ["+", "-"] : ["+", "-", "×"];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let maxNum = gameState.difficulty === "easy" ? 10 : gameState.difficulty === "medium" ? 20 : 12;
        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * maxNum) + 1;
        
        // No negative answers
        if (operation === "-" && num2 > num1) {
            [num1, num2] = [num2, num1];
        }
        
        let answer = 0;
        switch (operation) {
            case "+": answer = num1 + num2; break;
            case "-": answer = num1 - num2; break;
            case "×": answer = num1 * num2; break;
        }
        
        gameState.problem = { num1, num2, operation, answer };
        gameState.userAnswer = "";
        
        // Reset UI feedback
        if (answerDisplayEl) {
            answerDisplayEl.classList.remove('text-success', 'text-destructive');
        }
        if (feedbackEl) feedbackEl.textContent = '';
        
        updateGameUI();
    }

    function checkAnswer() {
        if (!gameState.problem || gameState.userAnswer === "") return;
        
        const isCorrect = parseInt(gameState.userAnswer) === gameState.problem.answer;
        
        if (isCorrect) {
            if (answerDisplayEl) answerDisplayEl.classList.add('text-success');
            if (feedbackEl) {
                const encouragements = ["Great job!", "You're amazing!", "Keep it up!", "Brilliant!", "Fantastic!"];
                feedbackEl.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
                feedbackEl.className = "text-success";
            }

            const points = gameState.difficulty === "easy" ? 10 : gameState.difficulty === "medium" ? 20 : 30;
            gameState.score += points + (gameState.streak * 5);
            gameState.streak++;

            if (gameState.streak > 0 && gameState.streak % 5 === 0) {
                showCelebration();
            }

            setTimeout(generateProblem, 1000);
        } else {
            if (answerDisplayEl) answerDisplayEl.classList.add('text-destructive');
            if (feedbackEl) {
                feedbackEl.textContent = "Try again!";
                feedbackEl.className = "text-destructive";
            }
            
            gameState.streak = 0;
            setTimeout(() => {
                if (feedbackEl) feedbackEl.textContent = '';
                if (answerDisplayEl) answerDisplayEl.classList.remove('text-destructive');
            }, 1500);
        }
        updateGameUI();
    }

    function showCelebration() {
        if (!celebrationOverlay || !celebrationText) return;
        celebrationText.textContent = `${gameState.streak} in a row!`;
        celebrationOverlay.classList.add('active');
        setTimeout(() => {
            celebrationOverlay.classList.remove('active');
        }, 2000);
    }

    // Game Event Listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.difficulty = btn.dataset.gameDifficulty;
            gameState.score = 0;
            gameState.streak = 0;
            gameState.started = true;
            generateProblem();
            updateGameUI();
        });
    });

    if (btnGameBack) btnGameBack.addEventListener('click', () => {
        gameState.started = false;
        updateGameUI();
    });

    if (btnGameCheck) btnGameCheck.addEventListener('click', checkAnswer);

    gameNumButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (gameState.userAnswer.length < 4) {
                gameState.userAnswer += btn.dataset.gameNum;
                updateGameUI();
            }
        });
    });

    if (btnGameClear) btnGameClear.addEventListener('click', () => {
        gameState.userAnswer = "";
        updateGameUI();
    });

    if (btnGameBackspace) btnGameBackspace.addEventListener('click', () => {
        gameState.userAnswer = gameState.userAnswer.slice(0, -1);
        updateGameUI();
    });

    // Initialization
    updateCalcDisplay();
    switchTab('calculator');
    console.log("Math Playland: Ready!");
});
