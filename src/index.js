const gridSection = document.querySelector('.grid-section');
const grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

function createBoard(){
    gridSection.innerHTML = '';
    for(let row = 0; row < 4; row++){
        const gridRow = document.createElement('div');
        gridRow.classList.add('row', 'justify-content-center', 'mb-2', 'mb-lg-3', 'gap-2', 'gap-lg-3');
        
        for(let col = 0; col < 4; col++){
            const gridCell = document.createElement('div');
            gridCell.classList.add('col-3', 'grid-cell');
            gridCell.textContent =  '';
            gridCell.setAttribute('value', 0);
            gridCell.setAttribute('row', row);
            gridCell.setAttribute('col', col);
            gridRow.appendChild(gridCell);
        }
        gridSection.appendChild(gridRow);
    }
}

function updateBoard() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        const row = parseInt(cell.getAttribute('row'));
        const col = parseInt(cell.getAttribute('col'));
        const cellValue = grid[row][col];

        const currentValue = parseInt(cell.getAttribute('value'));
        if(cellValue !== currentValue){
            
            cell.textContent = cellValue === 0 ? '' : cellValue;
            cell.setAttribute('value', cellValue === 0 ? '' : cellValue);
            cell.classList.add('show');
        }
    });
}

function setRandomCell(){
    const emptyCells = [];
    for(let row = 0; row < 4; row++){
        for(let col = 0; col < 4; col++){
            if(grid[row][col] === 0){
                emptyCells.push({row, col});
            }
        }
    }
    if(emptyCells.length === 0){
        return;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    grid[randomCell.row][randomCell.col] = Math.random() > 0.1 ? 2 : 4;
    updateBoard();
}

function moveLeft(){
    let moved = false;
    for(let row = 0; row < 4; row++){
        let newRow = grid[row].filter(cell => cell !== 0);
        let mergedRow = [];

        for(let i = 0; i < newRow.length ; i++){
            if (newRow[i] === newRow[i + 1]) {
                mergedRow.push(newRow[i] * 2); // Fusionar los dos valores
                i++; // Saltar el siguiente valor para no fusionarlo de nuevo
                moved = true; // Se realizó un movimiento
            } else {
                mergedRow.push(newRow[i]); // No fusionó, simplemente agregar
            }
        }
        while(mergedRow.length < 4){
            mergedRow.push(0);
        }
        grid[row] = mergedRow; 
        const gridRowCells = document.querySelectorAll(`.grid-cell[row="${row}"]`);
            
            gridRowCells.forEach((cell, index) => {
                // Si el valor cambia, aplica la animación
                cell.textContent = grid[row][index] === 0 ? '' : grid[row][index];
                cell.setAttribute('value', grid[row][index]);
    
                // Si la celda tiene un valor diferente, la animamos
                if (grid[row][index] !== 0) {
                    cell.classList.add('move');
                    // Aquí podemos definir la dirección de la animación si fuese necesario
                    // Simplemente aplicamos la transición con transform en CSS.
                }
            });
    }
    return moved;
}

function handleKeyPress(event){
    event.preventDefault();
    let moved = false;
    switch(event.key){
        case 'ArrowUp':
        case 'w':
            console.log("W");;
            break;
        case 'ArrowDown':
        case 's':
            console.log("S");;

            break;
        case 'ArrowLeft':
        case 'a':
            console.log("A");
            moved = moveLeft();

            break;
        case 'ArrowRight':
        case 'd':
            console.log("D");;

            break;
    }
    if(moved){
        setRandomCell();
    }
}

function initGame(){
    createBoard();
    setRandomCell();
    setRandomCell();
}

document.addEventListener('keydown', handleKeyPress);
initGame();