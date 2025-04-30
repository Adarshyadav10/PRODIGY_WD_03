// Game variables
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;
let mode = "pvp"; // default to player vs player
const boxtexts = document.querySelectorAll(".boxtext");
const winLine = document.getElementById("winLine");
const resetButton = document.getElementById("reset");
const infoText = document.querySelector(".info");

// Function to handle player's move
function handleMove(index) {
    if (gameBoard[index] === "" && !isGameOver) {
        gameBoard[index] = currentPlayer;
        boxtexts[index].textContent = currentPlayer;
        checkWin();
        if (!isGameOver) {
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // toggle player
            updateTurnInfo();
        }
        if (mode === "ai" && currentPlayer === "O" && !isGameOver) {
            aiMove();
        }
    }
}

// Check for a win
const wins = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal TL-BR
    [2, 4, 6], // diagonal BL-TR
];

function checkWin() {
    wins.forEach((e, i) => {
        if (
            gameBoard[e[0]] !== "" &&
            gameBoard[e[0]] === gameBoard[e[1]] &&
            gameBoard[e[1]] === gameBoard[e[2]]
        ) {
            const winner = currentPlayer === "X" ? getPlayerName("X") : getPlayerName("O");
            infoText.textContent = `${winner} Wins!`;
            isGameOver = true;

            // Highlight winning boxes
            e.forEach(i => {
                document.getElementsByClassName("box")[i].style.backgroundColor = "#90ee90";
            });

            // Show win line
            const lineDetails = getWinningLineDetails(i);
            winLine.style.left = `${lineDetails[0]}%`;
            winLine.style.top = `${lineDetails[1]}%`;
            winLine.style.transform = `rotate(${lineDetails[2]}deg) scaleX(${lineDetails[3]})`;
            winLine.style.width = `${lineDetails[4]}px`; 
            winLine.style.visibility = "visible"; 

            // Show celebration gif
            const img = document.getElementById("celebrationGif");
            img.src = "winning.gif"; 
            img.style.display = "block";

            // Play win sound
            const winSound = document.getElementById("winSound");
            winSound.currentTime = 0;
            winSound.play();
        }
    });
}

// Get player names
function getPlayerName(symbol) {
    const nameX = document.getElementById("playerX").value.trim() || "Player X";
    if (mode === "ai") {
        return symbol === "X" ? nameX : "AI";
    }
    const nameO = document.getElementById("playerO").value.trim() || "Player O";
    return symbol === "X" ? nameX : nameO;
}

// Get line details for the winning line
function getWinningLineDetails(i) {
    const lineDetails = [
        // [left position %, top position %, rotation angle, scale, width]
        [0, 0, 0, 1, 100],       
        [0, 50, 0, 1, 100],     
        [0, 100, 0, 1, 100],    
        [0, 0, 90, 1, 300],      
        [50, 0, 90, 1, 300],   
        [100, 0, 90, 1, 300],    
        [0, 0, 45, 1.414, 300], 
        [0, 100, -45, 1.414, 300] 
    ];

    return lineDetails[i];
}

// Update the turn info
function updateTurnInfo() {
    const playerName = getPlayerName(currentPlayer);
    infoText.textContent = `Turn For ${playerName}`;
}

// AI move
function aiMove() {
    const emptyIndexes = gameBoard
        .map((value, index) => (value === "" ? index : null))
        .filter((value) => value !== null);
    const randomMove = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    handleMove(randomMove);
}

// Reset the game
resetButton.addEventListener("click", () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    isGameOver = false;
    winLine.style.width = "0"; 
    winLine.style.visibility = "hidden"; 
    boxtexts.forEach((box) => (box.textContent = ""));
    document.querySelectorAll(".box").forEach((box) => (box.style.backgroundColor = ""));
    infoText.textContent = "Turn For X";
    currentPlayer = "X";

    // Reset win image
    const img = document.getElementById("celebrationGif");
    img.style.display = "none";
    img.src = "";
});

// Box click listeners
document.querySelectorAll(".box").forEach((box, index) => {
    box.addEventListener("click", () => handleMove(index));
});

// Mode change event
document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
        mode = e.target.value;
        document.getElementById("playerO").classList.toggle("hidden", mode === "ai");
        resetButton.click(); 
    });
});
