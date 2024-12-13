var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
]

var turn;
var gameOver = false;

// Player(state) function that returns the current turn where 'state' is the state of the board
function player(state) {
    let xCount = 0, oCount = 0;
    for (let row of state) {
        for (let cell of row) {
            if (cell === "X") xCount++;
            if (cell === "O") oCount++;
        }
    }
    return xCount > oCount ? "O" : "X";
}


// Terminal(state) returns true if game is over
function terminal(state) {
    // Check rows, columns, and diagonals for a win
    if (winner(state) !== null) {
        return true;
    }

    // Check for draw (no null values left)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === null) {
                return false;
            }
        }
    }

    return true;
}


function utility(state) {
    const winnerPlayer = winner(state);
    if (winnerPlayer === "X") {
        return 1;
    } else if (winnerPlayer === "O") {
        return -1;
    }
    return 0;
}


function winner(state) {
    const winConditions = [
        // Rows
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        // Columns
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        // Diagonals
        [state[0][0], state[1][1], state[2][2]],
        [state[0][2], state[1][1], state[2][0]],
    ];

    for (const line of winConditions) {
        if (line[0] !== null && line[0] === line[1] && line[1] === line[2]) {
            return line[0];
        }
    }

    return null;
}

function winningLine(){
    const line = document.querySelector(".line");
    const winningPlayer = winner(board);

    const tl = board[0][0];
    const tc = board[0][1];
    const tr = board[0][2];
    const ml = board[1][0];
    const mc = board[1][1];
    const mr = board[1][2];
    const bl = board[2][0];
    const bc = board[2][1];
    const br = board[2][2];

    var boxSize = window.innerWidth < 768 ? 100 : 150;
    var containerSize = window.innerWidth < 768 ? 300 : 450;

    // Rows
    if(tl === winningPlayer && tc === winningPlayer && tr === winningPlayer){
        line.style.width = "100%";
        line.style.height = "2rem";
        line.style.top = (Math.floor(boxSize / 2) + (boxSize * 0)) + "px";
        line.style.left = "0";
        line.style.transform = "translateY(-50%)";
    }else if(ml === winningPlayer && mc === winningPlayer && mr === winningPlayer){
        line.style.width = "100%";
        line.style.height = "2rem";
        line.style.top = (Math.floor(boxSize / 2) + (boxSize * 1)) + "px";
        line.style.left = "0";
        line.style.transform = "translateY(-50%)";
    }else if(bl === winningPlayer && bc === winningPlayer && br === winningPlayer){
        line.style.width = "100%";
        line.style.height = "2rem";
        line.style.top = (Math.floor(boxSize / 2) + (boxSize * 2)) + "px";
        line.style.left = "0";
        line.style.transform = "translateY(-50%)";
    }

    // Columns
    if(tl === winningPlayer && ml === winningPlayer && bl === winningPlayer){
        line.style.width = "2rem";
        line.style.height = "100%";
        line.style.top = "0";
        line.style.left = (Math.floor(boxSize / 2) + (boxSize * 0)) + "px";
        line.style.transform = "translateX(-50%)";
    }else if(tc === winningPlayer && mc === winningPlayer && bc === winningPlayer){
        line.style.width = "2rem";
        line.style.height = "100%";
        line.style.top = "0";
        line.style.left = (Math.floor(boxSize / 2) + (boxSize * 1)) + "px";
        line.style.transform = "translateX(-50%)";
    }else if(tr === winningPlayer && mr === winningPlayer && br === winningPlayer){
        line.style.width = "2rem";
        line.style.height = "100%";
        line.style.top = "0";
        line.style.left = (Math.floor(boxSize / 2) + (boxSize * 2)) + "px";
        line.style.transform = "translateX(-50%)";
    }

    // Diagonals
    if(bl === winningPlayer && mc === winningPlayer && tr === winningPlayer){
        line.style.width = "2rem";
        line.style.height = "100%";
        line.style.top = "0";
        line.style.left = Math.floor(containerSize / 2) + "px";
        line.style.transform = "rotate(45deg) translateX(-50%)";
    }else if(tl === winningPlayer && mc === winningPlayer && br === winningPlayer){
        line.style.width = "2rem";
        line.style.height = "100%";
        line.style.top = "0";
        line.style.left = Math.floor(containerSize / 2) + "px";
        line.style.transform = "rotate(-45deg) translateX(-50%)";
    }

    line.classList.add("active");
}

function actions(state){
    const acts = [];
    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            if(state[i][j] == null){
                acts.push([i, j]);
            }
        }
    }
    return acts;
}

function result(state, action){
    const copyState = JSON.parse(JSON.stringify(state));
    copyState[action[0]][action[1]] = player(state);
    return copyState;
}

function minvalue(state) {
    if (terminal(state)) {
        return [utility(state), null];
    }

    let value = Infinity;
    let bestMove = null;

    for (const action of actions(state)) {
        const [childValue] = maxvalue(result(state, action));
        if (childValue < value) {
            value = childValue;
            bestMove = action;
            if (value === -1) return [value, bestMove];
        }
    }

    return [value, bestMove];
}

function maxvalue(state) {
    if (terminal(state)) {
        return [utility(state), null];
    }

    let value = -Infinity;
    let bestMove = null;

    for (const action of actions(state)) {
        const [childValue] = minvalue(result(state, action));
        if (childValue > value) {
            value = childValue;
            bestMove = action;
            if (value === 1) return [value, bestMove];
        }
    }

    return [value, bestMove];
}


function CPUMove(move, turn){
    const r = move[0];
    const c = move[1];
    board[r][c] = turn;
    const cpuBox = document.getElementById(`box-${getCPUBoxNumber(r, c)}`);
    if(cpuBox.innerHTML == ""){
        const sym = document.createElement("div");
        sym.classList.add(turn == "X" ? "x" : "o");
        cpuBox.appendChild(sym);
    }
}

function checkGameOver() {
    if (winner(board) === "O") {
        winningLine();
        return true;
    } else if (winner(board) === "X") {
        winningLine();
        return true;
    } else if (terminal(board)) {
        return true;
    }
    return false;
}

function initiateGameOver(winner){
    const winStat = document.getElementById("winStatus");
    if(winner == "X"){
        winStat.innerHTML = "<span style='color: crimson;'>You Lose:</span> CPU wins";
    }else if(winner == "O"){
        winStat.innerHTML = "Congratulations: <span style='color: limegreen;'>You Win!</span>";
    }else{
        winStat.innerHTML = "<span style='color: gold;'>DRAW</span>";
    }
    document.querySelector(".container").classList.add("gameover");
    document.querySelector(".gameover-screen").classList.add("active");
}

function removeGameOver(){
    const winStat = document.getElementById("winStatus");
    winStat.innerHTML = "";
    document.querySelector(".container").classList.remove("gameover");
    document.querySelector(".gameover-screen").classList.remove("active");
    document.querySelector(".line").classList.remove("active");
}

function playAgain(){
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => {
        box.innerHTML = "";
    });
    removeGameOver();
    gameOver = false;

    turn = Math.floor(Math.random() * 100) >= 50 ? "X" : "O";
    if (turn === "X") {
        const [val, move] = maxvalue(board);
        CPUMove(move, turn);
        if (checkGameOver()) {
            gameOver = true;
            initiateGameOver(winner(board));
            return;
        }
        turn = "O";
    }
}

function main() {
    turn = Math.floor(Math.random() * 100) >= 10 ? "X" : "O";

    if (turn === "X") {
        const [val, move] = maxvalue(board);
        CPUMove(move, turn);
        if (checkGameOver()) {
            gameOver = true;
            initiateGameOver(winner(board));
            return;
        }
        turn = "O";
    }

    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.addEventListener("click", (e) => {
            if (!terminal(board) && !gameOver) {
                if (turn === "O") {
                    if (e.target.classList.contains("box") && e.target.innerHTML === "") {
                        const sym = document.createElement("div");
                        sym.classList.add("o");
                        e.target.appendChild(sym);

                        const boxIndex = getBoxNumber(e.target) - 1;
                        const r = Math.floor(boxIndex / 3);
                        const c = Math.floor(boxIndex % 3);
                        board[r][c] = "O";

                        if (checkGameOver()) {
                            gameOver = true;
                            initiateGameOver(winner(board));
                            return;
                        }

                        turn = "X";
                        const [val, move] = maxvalue(board);
                        CPUMove(move, "X");

                        if (checkGameOver()) {
                            gameOver = true;
                            initiateGameOver(winner(board));
                            return;
                        }

                        turn = "O";
                    }
                }
            } else {
                alert("Game over! Start a new game.");
            }
        });
    });
}


main();

function getBoxNumber(box){
    const boxId = box.id;
    for(var i=1; i<=9; i++){
        if(boxId == `box-${i}`){
            return i;
        }
    }
}

function getCPUBoxNumber(row, col){
    var n = 0;
    if(row == 0 && col == 0){
        n = 1;
    }else if(row == 0 && col == 1){
        n = 2;
    }else if(row == 0 && col == 2){
        n = 3;
    }else if(row == 1 && col == 0){
        n = 4;
    }else if(row == 1 && col == 1){
        n = 5;
    }else if(row == 1 && col == 2){
        n = 6;
    }else if(row == 2 && col == 0){
        n = 7;
    }else if(row == 2 && col == 1){
        n = 8;
    }else if(row == 2 && col == 2){
        n = 9;
    }
    return n;
}