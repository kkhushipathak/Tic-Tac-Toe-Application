const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restart");
const resetScoresBtn = document.getElementById("resetScores");

const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");

const drawCountDisplay = document.getElementById("drawCount");
const gamesPlayedDisplay = document.getElementById("gamesPlayed");

const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");

const nameXDisplay = document.getElementById("nameX");
const nameODisplay = document.getElementById("nameO");

const setNamesBtn = document.getElementById("setNames");

const cardX = document.getElementById("cardX");
const cardO = document.getElementById("cardO");

const historyList = document.getElementById("historyList");

const popup = document.getElementById("winnerPopup");
const winnerMessage = document.getElementById("winnerMessage");

const themeBtn = document.getElementById("themeBtn");

let currentPlayer = "X";
let starter = "X";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let draws = 0;
let gamesPlayed = 0;

let gameMode = "pvp";

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

document
.querySelectorAll('input[name="mode"]')
.forEach(radio => {
    radio.addEventListener("change", function(){
        gameMode = this.value;
        restartGame();
    });
});

setNamesBtn.addEventListener("click", () => {

    nameXDisplay.textContent =
        (playerXInput.value || "Player X") + " (X)";

    nameODisplay.textContent =
        (playerOInput.value || "Player O") + " (O)";

    updateStatus();
});

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);

resetScoresBtn.addEventListener("click", () => {

    scoreX = 0;
    scoreO = 0;
    draws = 0;
    gamesPlayed = 0;

    scoreXDisplay.textContent = 0;
    scoreODisplay.textContent = 0;
    drawCountDisplay.textContent = 0;
    gamesPlayedDisplay.textContent = 0;

    historyList.innerHTML = "";
});

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀️ Light Mode";
    }
    else{
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

function handleCellClick(){

    const index = this.getAttribute("data-index");

    if(board[index] !== "" || !gameActive){
        return;
    }

    makeMove(index, currentPlayer);

    if(gameMode === "ai" &&
       gameActive &&
       currentPlayer === "O"){

        setTimeout(aiMove, 500);
    }
}

function makeMove(index, player){

    board[index] = player;

    cells[index].textContent = player;

    if(checkWinner()){
        return;
    }

    if(!board.includes("")){

        draws++;
        gamesPlayed++;

        drawCountDisplay.textContent = draws;
        gamesPlayedDisplay.textContent = gamesPlayed;

        statusText.textContent =
            "It's a Draw! 🤝";

        addHistory("Draw");

        gameActive = false;
        return;
    }

    currentPlayer =
        currentPlayer === "X" ? "O" : "X";

    updateStatus();
    updateActivePlayer();
}

function aiMove(){

    let emptyCells = [];

    board.forEach((cell,index)=>{

        if(cell === ""){
            emptyCells.push(index);
        }
    });

    if(emptyCells.length === 0) return;

    let randomIndex =
        emptyCells[
            Math.floor(
                Math.random() * emptyCells.length
            )
        ];

    makeMove(randomIndex,"O");
}

function checkWinner(){

    for(let combo of winningCombinations){

        let [a,b,c] = combo;

        if(
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ){

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            let winnerName;

            if(board[a] === "X"){

                scoreX++;
                scoreXDisplay.textContent = scoreX;

                winnerName =
                    nameXDisplay.textContent;

            }else{

                scoreO++;
                scoreODisplay.textContent = scoreO;

                winnerName =
                    nameODisplay.textContent;
            }

            gamesPlayed++;
            gamesPlayedDisplay.textContent =
                gamesPlayed;

            statusText.textContent =
                `${winnerName} Wins! 🎉`;

            addHistory(`${winnerName} Won`);

            showPopup(
                `${winnerName} Wins! 🎉`
            );

            confetti({
                particleCount:150,
                spread:100
            });

            gameActive = false;

            return true;
        }
    }

    return false;
}

function restartGame(){

    starter =
        starter === "X" ? "O" : "X";

    currentPlayer = starter;

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    gameActive = true;

    cells.forEach(cell => {

        cell.textContent = "";
        cell.classList.remove("winner");
    });

    updateStatus();
    updateActivePlayer();
}

function updateStatus(){

    const currentName =
        currentPlayer === "X"
        ? nameXDisplay.textContent
        : nameODisplay.textContent;

    statusText.textContent =
        `${currentName}'s Turn`;
}

function updateActivePlayer(){

    if(currentPlayer === "X"){

        cardX.classList.add(
            "active-player"
        );

        cardO.classList.remove(
            "active-player"
        );

    }else{

        cardO.classList.add(
            "active-player"
        );

        cardX.classList.remove(
            "active-player"
        );
    }
}

function addHistory(result){

    const li =
        document.createElement("li");

    li.textContent = result;

    historyList.prepend(li);
}

function showPopup(message){

    winnerMessage.textContent = message;

    popup.style.display = "flex";
}

function closePopup(){

    popup.style.display = "none";
}

updateStatus();
updateActivePlayer();