const gridSection = document.querySelector('.grid-section');
const restartButton = document.querySelector('.restart-btn');
const scoreDisplay = document.querySelector('#score');
const scoreIncrementDisplay = document.getElementById('score-increment');
const scoreBestDisplay = document.getElementById('score-best');
let grid = [];
let score = 0;
let isGameOver = false;

function createBoard() {
    gridSection.innerHTML = ''; 
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            gridCell.textContent = '';
            gridCell.setAttribute('value', 0);
            gridCell.setAttribute('row', row);
            gridCell.setAttribute('col', col);
            gridCell.style.top = `calc(${row} * (var(--cell-size) + var(--cell-gap)))`;
            gridCell.style.left = `calc(${col} * (var(--cell-size) + var(--cell-gap)))`;
            gridSection.appendChild(gridCell);
        }
    }
}

function updateBoard() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        const row = parseInt(cell.getAttribute('row'));
        const col = parseInt(cell.getAttribute('col'));
        const cellValue = grid[row][col];

        const currentValue = parseInt(cell.getAttribute('value'))
        if (cellValue !== currentValue) {
            cell.textContent = cellValue === 0 ? '' : cellValue;
            cell.setAttribute('value', cellValue)
        }
    });
    scoreDisplay.textContent = score;
    if(score > parseInt(scoreBestDisplay.textContent)) scoreBestDisplay.textContent = score;
}

function animateScoreIncrease(incrementValue) {
    scoreIncrementDisplay.textContent = `+${incrementValue}`;
    scoreIncrementDisplay.classList.add('appear');
    score += incrementValue;
    setTimeout(() => {
        scoreIncrementDisplay.classList.remove('appear');
    }, 1000);
}


function setRandomCell() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length === 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    grid[randomCell.row][randomCell.col] = Math.random() > 0.1 ? 2 : 4;

    const cell = document.querySelector(`.grid-cell[row="${randomCell.row}"][col="${randomCell.col}"]`);
    cell.textContent = grid[randomCell.row][randomCell.col];
    cell.setAttribute('value', grid[randomCell.row][randomCell.col]);
    cell.classList.add('appear');
    setTimeout(() => { cell.classList.remove('appear'); }, 1000);
}

function moveVertical(direction) {
    let moved = false;
    let incrementValue = 0;

    for (let col = 0; col < 4; col++) {
        let newCol = grid.map(row => row[col]).filter(val => val);

        if (direction === 'up') {
            for (let row = 0; row < newCol.length - 1; row++) {
                if (newCol[row] === newCol[row + 1]) {
                    newCol[row] *= 2;
                    incrementValue += newCol[row];
                    newCol.splice(row + 1, 1);
                    moved = true;
                }
            }
            while (newCol.length < 4) {
                newCol.push(0);
            }
        } else if (direction === 'down') {
            for (let row = newCol.length - 1; row > 0; row--) {
                if (newCol[row] === newCol[row - 1]) {
                    newCol[row] *= 2;
                    incrementValue += newCol[row];
                    newCol.splice(row - 1, 1);
                }
            }
            while (newCol.length < 4) {
                newCol.unshift(0);
            }
        }
        for (let row = 0; row < 4; row++) {
            if (grid[row][col] !== newCol[row]) {
                moved = true;
            }
            grid[row][col] = newCol[row];
        }
    }

    return { moved, incrementValue };
}

function moveHorizontal(direction) {
    let moved = false;
    let incrementValue = 0;

    for (let row = 0; row < 4; row++) {
        let newRow = grid[row].filter(val => val);

        if (direction === 'left') {
            for (let col = 0; col < newRow.length - 1; col++) {
                if (newRow[col] === newRow[col + 1]) {
                    newRow[col] *= 2;
                    incrementValue += newRow[col];
                    newRow.splice(col + 1, 1);
                }
            }
            while (newRow.length < 4) {
                newRow.push(0);
            }
        } else if (direction === 'right') {
            for (let col = newRow.length - 1; col > 0; col--) {
                if (newRow[col] === newRow[col - 1]) {
                    newRow[col] *= 2;
                    incrementValue += newRow[col];
                    newRow.splice(col - 1, 1);
                }
            }
            while (newRow.length < 4) {
                newRow.unshift(0);
            }
        }
        if (grid[row].toString() !== newRow.toString()) {
            moved = true;
        }
        grid[row] = newRow;
    }

    return {moved, incrementValue};
}


function moveLeft() {
    return moveHorizontal('left');
}

function moveRight() {
    return moveHorizontal('right');
}

function moveUp() {
    return moveVertical('up');
}

function moveDown() {
    return moveVertical('down');
}

function handleKeyPress(event) {
    if (isGameOver) return;
    event.preventDefault();
    let movement = {
        moved: false,
        incrementValue: 0
    };
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            movement = moveUp();
            break;
        case 'ArrowDown':
        case 's':
            movement = moveDown();
            break;
        case 'ArrowLeft':
        case 'a':
            movement = moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
            movement = moveRight();
            break;
    }
    if (movement.moved) {
        console.log(movement.moved);
        if (movement.incrementValue > 0) animateScoreIncrease(movement.incrementValue);
        updateBoard();
        setRandomCell();
        checkGame();
    }
}

function checkGame(){
    if(checkYouWin()){
        finishGame('You Win!', 'rgba(230, 0, 255, 0.87)');
        isGameOver = true;
    }else if(checkGameOver()){
        finishGame('Game Over!', 'rgba(230, 32, 32, 0.905)');
        isGameOver = true;
    }
}

function checkYouWin() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 2048) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                return false;
            }
            if (row < 3 && grid[row][col] === grid[row + 1][col]) {
                return false;
            }
            if (col < 3 && grid[row][col] === grid[row][col + 1]) {
                return false;
            }
        }
    }
    return true;
}

function finishGame(text, color) {
    const gameOver = document.createElement('div');
    gameOver.classList.add('game-over');
    gameOver.innerHTML = `<h1 style="color:${color};">${text}</h1>`;
    gridSection.appendChild(gameOver);
}

function InitGame(){
    isGameOver = false;
    grid = new Array(4).fill(0).map(() => new Array(4).fill(0));
    score = 0;
    scoreDisplay.textContent = score;
    createBoard();
    setRandomCell();
    setRandomCell();
}

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', InitGame);
InitGame();