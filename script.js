// Game Configuration
const DIFFICULTIES = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
};

// Game State
let currentDifficulty = 'easy';
let board = [];
let gameOver = false;
let gameStarted = false;
let firstClick = true;
let timerInterval = null;
let timeElapsed = 0;
let flagsPlaced = 0;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const difficultyButtons = document.querySelectorAll('.diff-btn');
const modal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalRestartBtn = document.getElementById('modal-restart');

// Initialize Game
function initGame() {
    const config = DIFFICULTIES[currentDifficulty];
    board = createBoard(config.rows, config.cols);
    gameOver = false;
    gameStarted = false;
    firstClick = true;
    timeElapsed = 0;
    flagsPlaced = 0;
    
    clearInterval(timerInterval);
    timerDisplay.textContent = '000';
    mineCountDisplay.textContent = config.mines;
    restartBtn.textContent = '😊';
    
    renderBoard();
}

// Create Board Structure
function createBoard(rows, cols) {
    const newBoard = [];
    for (let row = 0; row < rows; row++) {
        newBoard[row] = [];
        for (let col = 0; col < cols; col++) {
            newBoard[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0,
                row: row,
                col: col
            };
        }
    }
    return newBoard;
}

// Place Mines (avoiding first click position)
function placeMines(avoidRow, avoidCol) {
    const config = DIFFICULTIES[currentDifficulty];
    let minesPlaced = 0;
    
    while (minesPlaced < config.mines) {
        const row = Math.floor(Math.random() * config.rows);
        const col = Math.floor(Math.random() * config.cols);
        
        // Don't place mine on first click or if already a mine
        if ((row === avoidRow && col === avoidCol) || board[row][col].isMine) {
            continue;
        }
        
        board[row][col].isMine = true;
        minesPlaced++;
    }
    
    calculateNeighborMines();
}

// Calculate neighbor mine counts
function calculateNeighborMines() {
    const config = DIFFICULTIES[currentDifficulty];
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(row, col);
            }
        }
    }
}

// Count mines around a cell
function countNeighborMines(row, col) {
    let count = 0;
    const neighbors = getNeighbors(row, col);
    
    neighbors.forEach(([nRow, nCol]) => {
        if (board[nRow][nCol].isMine) {
            count++;
        }
    });
    
    return count;
}

// Get valid neighbor coordinates
function getNeighbors(row, col) {
    const config = DIFFICULTIES[currentDifficulty];
    const neighbors = [];
    
    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue;
            
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= 0 && newRow < config.rows && 
                newCol >= 0 && newCol < config.cols) {
                neighbors.push([newRow, newCol]);
            }
        }
    }
    
    return neighbors;
}

// Render the game board
function renderBoard() {
    const config = DIFFICULTIES[currentDifficulty];
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 30px)`;
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const cell = createCellElement(row, col);
            gameBoard.appendChild(cell);
        }
    }
}

// Create individual cell element
function createCellElement(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    
    cell.addEventListener('click', () => handleCellClick(row, col));
    cell.addEventListener('contextmenu', (e) => handleRightClick(e, row, col));
    
    return cell;
}

// Handle left click (reveal cell)
function handleCellClick(row, col) {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
    }
    
    // First click: place mines and start timer
    if (firstClick) {
        placeMines(row, col);
        startTimer();
        firstClick = false;
        gameStarted = true;
    }
    
    const cell = board[row][col];
    
    if (cell.isMine) {
        // Hit a mine - game over
        revealMines();
        endGame(false);
        return;
    }
    
    // Reveal cell and cascade if empty
    revealCell(row, col);
    
    // Check for win
    if (checkWin()) {
        endGame(true);
    }
}

// Handle right click (flag cell)
function handleRightClick(e, row, col) {
    e.preventDefault();
    
    if (gameOver || board[row][col].isRevealed) {
        return;
    }
    
    const cell = board[row][col];
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const config = DIFFICULTIES[currentDifficulty];
    
    if (cell.isFlagged) {
        // Remove flag
        cell.isFlagged = false;
        cellElement.classList.remove('flagged');
        cellElement.textContent = '';
        flagsPlaced--;
    } else {
        // Place flag
        cell.isFlagged = true;
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
        flagsPlaced++;
    }
    
    mineCountDisplay.textContent = config.mines - flagsPlaced;
}

// Reveal a cell (with flood fill for empty cells)
function revealCell(row, col) {
    const cell = board[row][col];
    
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }
    
    cell.isRevealed = true;
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    
    if (cell.neighborMines > 0) {
        cellElement.textContent = cell.neighborMines;
        cellElement.dataset.count = cell.neighborMines;
    } else {
        // Flood fill - reveal all adjacent empty cells
        const neighbors = getNeighbors(row, col);
        neighbors.forEach(([nRow, nCol]) => {
            revealCell(nRow, nCol);
        });
    }
}

// Reveal all mines (on game over)
function revealMines() {
    const config = DIFFICULTIES[currentDifficulty];
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const cell = board[row][col];
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            if (cell.isMine) {
                cellElement.classList.add('mine');
                cellElement.textContent = '💣';
                
                // Highlight the mine that was clicked
                if (cell.isRevealed) {
                    cellElement.classList.add('mine-hit');
                }
            }
        }
    }
}

// Check if player has won
function checkWin() {
    const config = DIFFICULTIES[currentDifficulty];
    let revealedCount = 0;
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            if (board[row][col].isRevealed && !board[row][col].isMine) {
                revealedCount++;
            }
        }
    }
    
    const totalSafeCells = (config.rows * config.cols) - config.mines;
    return revealedCount === totalSafeCells;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = String(timeElapsed).padStart(3, '0');
    }, 1000);
}

// End the game
function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval);
    
    if (won) {
        restartBtn.textContent = '😎';
        modalTitle.textContent = '🎉 You Won!';
        modalMessage.textContent = `Time: ${timeElapsed} seconds`;
    } else {
        restartBtn.textContent = '😵';
        modalTitle.textContent = '💥 Game Over!';
        modalMessage.textContent = 'You hit a mine!';
    }
    
    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 500);
}

// Event Listeners
restartBtn.addEventListener('click', initGame);
modalRestartBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    initGame();
});

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Change difficulty and restart
        currentDifficulty = btn.dataset.level;
        initGame();
    });
});

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Initialize on page load
initGame();
