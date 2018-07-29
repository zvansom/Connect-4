const NUM_COLS = 7;
const NUM_ROWS = 6;
const gameboard = document.getElementById('gameboard');
const scoreboard = document.getElementById('scoreboard');

let board;

let sbData = {
  playerOneScore: 0,
  playerTwoScore: 0,
  activePlayer: 0
}

function startGame() {
  if(this.id === 'player1') {
    alert("Feature currently unavailable.  Please find a friend and come back.");
  } else {
    clearScoreboard();
    addColumnListeners();
    renderActivePlayer();
  }
}

function setActivePlayer() {
  sbData.activePlayer = Math.round(Math.random()) + 1;
}

function clearScoreboard() {
  while (scoreboard.firstChild) {
    scoreboard.removeChild(scoreboard.firstChild);
  }
}

function addColumnListeners() {
  let columns = document.querySelectorAll('.column');
  columns.forEach(column => column.addEventListener('click', handleClick));
}

function renderActivePlayer() {
  const activePlayer = document.createElement('h2');
  activePlayer.setAttribute('id', 'active-player');
  activePlayer.innerText = "Player " + sbData.activePlayer + " goes first!";
  scoreboard.appendChild(activePlayer);
}

function handleClick() {
  const activeColumn = parseInt(this.getAttribute('id'));

  // Check if top cell in column is occupied.
  if (board[0][activeColumn] === 0) {
    var lowestAvailableRow = fetchLowestAvailableRow(activeColumn);
    board[lowestAvailableRow][activeColumn] = sbData.activePlayer;

    fillCell([lowestAvailableRow, activeColumn]);
  } else {
    alert("That column is full. Choose a different one.");
  }
}

function fetchLowestAvailableRow(columnIndex) {
  let position = NUM_ROWS - 1;
  while(position >= 0) {
    if (board[position][columnIndex] != 0) {
      position--;
    } else {
      return position;
    }
  }
}

function fillCell(coordinate) {
  let currentColor;
  if(sbData.activePlayer === 1) {
    currentColor = 'red';
  } else {
    currentColor = 'black';
  }

  document.querySelector('div.cell[data-coordinate="['+coordinate[0]+', '+coordinate[1]+']"]').style = "background-color: " + currentColor;

  console.log(board);
  if(checkForWin()){
    removeColumnListeners();
    gameOver();
  } else {
    switchPlayer();
  }
}

function checkForWin() {
  // Check vertical for win
  for(var row = 0; row < NUM_ROWS - 3; row++) {
    for(var col = 0; col < NUM_COLS; col++) {
      if(checkLine(board[row][col], board[row+1][col], board[row+2][col], board[row+3][col])) {
        return board[row][col];
      }
    }
  }

  // Check horizontal for win
  for(var row = 0; row < NUM_ROWS; row++) {
    for(var col = 0; col < NUM_COLS - 3; col++) {
      if(checkLine(board[row][col], board[row][col+1], board[row][col+2], board[row][col+3])) {
        return board[row][col];
      }
    }
  }

  // Check diagonal right and down
  for(var row = 0; row < NUM_ROWS - 3; row++) {
    for(var col = 0; col < NUM_COLS - 3; col++) {
      if(checkLine(board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3])) {
        return board[row][col];
      }
    }
  }

  // Check diagonal right and up
  for(var row = 3; row < NUM_ROWS; row++) {
    for(var col = 0; col < NUM_COLS - 3; col++) {
      if(checkLine(board[row][col], board[row-1][col+1], board[row-2][col+2], board[row-3][col+3])) {
        return board[row][col];
      }
    }
  }

  // Conditional helper function
  function checkLine(cond1, cond2, cond3, cond4) {
    return ((cond1 !== 0) && (cond1 === cond2) && (cond1 === cond3) && (cond1 === cond4));
  }
}

function removeColumnListeners() {
  let columns = document.querySelectorAll('.column');
  columns.forEach(column => column.removeEventListener('click', handleClick));
}

function gameOver() {
  clearScoreboard();
  const gameOverMessage = document.createElement('h2');
  gameOverMessage.setAttribute('id', 'game-over');
  gameOverMessage.innerText = "Player " + sbData.activePlayer + " has won!";
  scoreboard.appendChild(gameOverMessage);

  const playAgainButton = document.createElement('button');
  playAgainButton.setAttribute('id', 'play-again');
  playAgainButton.setAttribute('class', 'menuButton');
  playAgainButton.addEventListener('click', renderMenu);
  playAgainButton.textContent = 'Play Again!';
  scoreboard.appendChild(playAgainButton);
}

function switchPlayer() {
  sbData.activePlayer === 1 ? sbData.activePlayer = 2 : sbData.activePlayer = 1;
  updateActivePlayer();
}

function updateActivePlayer() {
  document.getElementById('active-player').textContent = "Player " + sbData.activePlayer + "'s move";
}

function renderMenu() {
  clearScoreboard();
  const numPlayerMessage = document.createElement('h4');
  numPlayerMessage.textContent = "How many players?";
  scoreboard.appendChild(numPlayerMessage);

  for (let playerNum = 1; playerNum <= 2; playerNum++) {
    const currentPlayer = document.createElement('button');
    currentPlayer.setAttribute('id', 'player' + playerNum);
    currentPlayer.setAttribute('class', 'menuButton');
    currentPlayer.addEventListener('click', startGame);
    currentPlayer.textContent = playerNum + "Player";
    scoreboard.appendChild(currentPlayer);
  }

  renderStartingBoard();
  initializeBoardData();
  setActivePlayer();
}

function renderStartingBoard() {
  clearGameboard();
  // Build a column element
  for (let col = 0; col < NUM_COLS; col++) {
    let currColumn = document.createElement('div');
    currColumn.setAttribute('class', 'column');
    currColumn.setAttribute('id', col);
    gameboard.appendChild(currColumn);

    //  Generate cell elements for current column
    for (let cell = 0; cell < NUM_ROWS; cell++) {
      let currCell = document.createElement('div');
      currCell.setAttribute('class', 'cell');
      currCell.setAttribute('data-coordinate', '['+cell+', '+col+']');
      document.getElementById(col).appendChild(currCell);
    }
  }
  initializeBoardData();
}

function clearGameboard() {
  while (gameboard.firstChild) {
    gameboard.removeChild(gameboard.firstChild);
  }
}

function initializeBoardData() {
  board = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    let currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push(0);
    }
    board.push(currentRow);
  }
}

renderMenu();
