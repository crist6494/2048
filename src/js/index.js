const gridSection = document.querySelector('.grid-section');
const restartButton = document.querySelector('.restart-btn');
const scoreDisplay = document.querySelector('#score');
const scoreIncrementDisplay = document.getElementById('score-increment');
let grid = [];
let score = 0;

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
}

function animateScoreIncrease(incrementValue) {
    
    scoreIncrementDisplay.innerHTML = `<span id="score-increment" class="score-increment"">${incrementValue}</span>`;

    setTimeout(() => {
        scoreIncrementDisplay.classList.remove('animate-increment');
    }, 1000);
    scoreIncrementDisplay.innerHTML = '';
    score += incrementValue;
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

    if (moved) {
        animateScoreIncrease(incrementValue); // Llamamos a la animación con el valor real del incremento
    }

    return moved;
}

function moveHorizontal(direction) {
    let moved = false;
    let incrementValue = 0; // Aquí vamos a acumular el incremento

    for (let row = 0; row < 4; row++) {
        let newRow = grid[row].filter(val => val);

        if (direction === 'left') {
            for (let col = 0; col < newRow.length - 1; col++) {
                if (newRow[col] === newRow[col + 1]) {
                    newRow[col] *= 2;
                    incrementValue += newRow[col];  // Sumar el incremento
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
                    incrementValue += newRow[col];  // Sumar el incremento
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

    if (moved) {
        animateScoreIncrease(incrementValue); // Llamamos a la animación con el valor real del incremento
    }

    return moved;
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
    event.preventDefault();
    let moved = false;
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            moved = moveUp();
            break;
        case 'ArrowDown':
        case 's':
            moved = moveDown();
            break;
        case 'ArrowLeft':
        case 'a':
            moved = moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
            moved = moveRight();
            break;
    }
    if (moved) {
        updateBoard();
        setRandomCell();
       /*  
        if(checkGameOver() === false){
            
            let game_over = document.createElement('div');
            game_over.classList.add('game-over');
            game_over.innerHTML = '<h1>Game Over</h1>'; // El texto dentro del mensaje
            gridSection.appendChild(game_over);
        } */
    }
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

function InitGame(){
    grid = new Array(4).fill(0).map(() => new Array(4).fill(0));
    score = 0;
    createBoard();
    setRandomCell();
    setRandomCell();
}

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', InitGame);
InitGame();
