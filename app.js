// array inputs displayed to DOM game board
const gameBoard = ( () => {
    let _board = ["", "", "",
                   "", "", "",
                   "", "", ""];

    function playerMove (arrayIndex, symbol) {
        _board[arrayIndex] = symbol;
    };

    function boardStatus() {
        console.log(this._board);
    }

    function reset() {
        this._board.splice(0, 9, "", "", "", "", "", "", "", "", "");
    }

    return {playerMove, boardStatus, _board, reset} // need _board for gameConditions 
})();

// controls what happens when player clicks on block and sends move to gameboard
const displayController = ( () => {
    const setBlock = (e, symbol) => {
        e.target.textContent = symbol;
        e.target.classList.remove("empty");
        e.target.classList.add("taken");
    }

    const setBotBlock = (botArrayIndexDATA, symbol) => {
        console.log("setBotBlock's botArrayIndex: " + botArrayIndexDATA)
        let index = document.querySelector(`[data-array="${botArrayIndexDATA}"]`)
        console.log("Index: " + index);
        index.textContent = symbol;
        index.classList.remove("empty");
        index.classList.add("taken", "fade-in-text");
    }

    const clearDisplay = () => {
        let blocks = document.querySelectorAll(".block");
        blocks.forEach((block) => { 
            block.classList.remove("taken", "fade-in-text");
            block.classList.add("empty");
            block.textContent = "";
            });
        let messages = document.querySelector('#gamemessages');
        messages.textContent = "Playing new round."
        messages.style.color = "red";
    };

    return {setBlock, clearDisplay, setBotBlock};
})();

const gameScore = ( () => {
    let playerRound = 0;
    let _score1 = 0;
    let _score2 = 0;

    const setScore1 = () => {
        let playerOneScore = document.querySelector(".player-score-1");
        _score1++
        playerOneScore.textContent = _score1;
    }

    const setScore2 = () => {
        let playerTwoScore = document.querySelector(".player-score-2");
        _score2++
        playerTwoScore.textContent = _score2;
    }

    function reset(){
        this.playerRound = 0;
    }
    
    return {playerRound, setScore1, setScore2, reset}
})();

// checks who's turn it is, gameboard status, and winning conditions
const gameFlow = ( () => {    
    let symbol = "";
    const playerTurn = () => {
            if(gameScore.playerRound == 0 || gameScore.playerRound % 2 == 0){
                // it's player 1's turn
                symbol = "X";
            } else {
                // it's player 2's turn
                symbol = "O";
            };
        };  

    let blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => {
        block.addEventListener("click", (e) => {
            let arrayIndex = block.dataset.array;
            if(block.classList.contains('empty') && gameScore.playerRound !== 9){
                playerTurn(); // whose turn and symbol is it? 
                displayController.setBlock(e, symbol);                
                gameBoard.playerMove(arrayIndex, symbol); 
                gameScore.playerRound++;
                console.log(`gameFlow playerRound ${gameScore.playerRound}`)

                let gameStatus = gameConditions();
                if(gameStatus){
                    let messages = document.querySelector('#gamemessages');
                    messages.textContent = gameStatus
                    if(gameStatus === "Player X wins"){
                        gameScore.setScore1();
                    } else if (gameStatus === "Player O wins"){
                        gameScore.setScore2();
                    }
                    conclusion.gameEnd();
                }    
            }
            // if bot is on
            if(bot.status == "On" && gameScore.playerRound !== 9){
                console.log("bot status == On therefore moving")
                let botMove = bot.move(); // run function to get the arrayIndex
                console.log("after bot.move()");
                let botArrayIndex = bot.botArrayIndex;
                console.log("botArrayIndex: " + botArrayIndex)
                displayController.setBotBlock(botArrayIndex, "O"); // display move to DOM                
                gameBoard.playerMove(botArrayIndex, "O"); // sets move in game array
                
                gameScore.playerRound++; // advance to next round
                console.log(`gameFlow playerRound ${gameScore.playerRound}`)

                let gameStatus = gameConditions(); // check to see if win-lose-tie
                if(gameStatus){
                    let messages = document.querySelector('#gamemessages');
                    messages.textContent = gameStatus
                    if(gameStatus === "Player X wins"){
                        gameScore.setScore1();
                    } else if (gameStatus === "Player O wins"){
                        gameScore.setScore2();
                    }
                    conclusion.gameEnd();
                }    
            }
        });
    })
})();

const bot = ( ()=> {
    let status = "Off";
    let botArrayIndex = "";

    function move(){
        let randomIndex = Math.floor(Math.random()*gameBoard._board.length);
        console.log("before if statement randomIndex: " + randomIndex)
        if(gameBoard._board[randomIndex] == "X" || gameBoard._board[randomIndex] == "O"){
            return bot.move(); // recursion? https://stackoverflow.com/questions/19075461/generate-one-random-index-from-an-array-but-exclude-one-javascript
        } else {
            this.botArrayIndex = randomIndex;
            console.log("else statement botArrayIndex: " + botArrayIndex)
        }
        console.log(botArrayIndex)
    }

    return {status, move, botArrayIndex}
})();

// check win/lose/tie
const gameConditions = () => {  
    //// player X
    // rows
    if( (gameBoard._board[0] === "X" && gameBoard._board[1] === "X" && gameBoard._board[2] === "X") ||
        (gameBoard._board[3] === "X" && gameBoard._board[4] === "X" && gameBoard._board[5] === "X") ||
        (gameBoard._board[6] === "X" && gameBoard._board[7] === "X" && gameBoard._board[8] === "X") ) {
            return "Player X wins"
    } // columns 
    else if ( (gameBoard._board[0] === "X" && gameBoard._board[3] === "X" && gameBoard._board[6] === "X") ||
              (gameBoard._board[1] === "X" && gameBoard._board[4] === "X" && gameBoard._board[7] === "X") || 
              (gameBoard._board[2] === "X" && gameBoard._board[5] === "X" && gameBoard._board[8] === "X") ) {
                return "Player X wins"
              } // diagonals
              else if ( (gameBoard._board[0] === "X" && gameBoard._board[4] === "X" && gameBoard._board[8] === "X") || 
                        (gameBoard._board[6] === "X" && gameBoard._board[4] === "X" && gameBoard._board[2] === "X") ) {
                            return "Player X wins"
                        } 
    //// player O
    // rows
    if( (gameBoard._board[0] === "O" && gameBoard._board[1] === "O" && gameBoard._board[2] === "O") ||
        (gameBoard._board[3] === "O" && gameBoard._board[4] === "O" && gameBoard._board[5] === "O") ||
        (gameBoard._board[6] === "O" && gameBoard._board[7] === "O" && gameBoard._board[8] === "O") ) {
            return "Player O wins"
    } // columns 
    else if ( (gameBoard._board[0] === "O" && gameBoard._board[3] === "O" && gameBoard._board[6] === "O") ||
              (gameBoard._board[1] === "O" && gameBoard._board[4] === "O" && gameBoard._board[7] === "O") || 
              (gameBoard._board[2] === "O" && gameBoard._board[5] === "O" && gameBoard._board[8] === "O") ) {
                return "Player O wins"
              } // diagonals
              else if ( (gameBoard._board[0] === "O" && gameBoard._board[4] === "O" && gameBoard._board[8] === "O") || 
                        (gameBoard._board[6] === "O" && gameBoard._board[4] === "O" && gameBoard._board[2] === "O") ) {
                            return "Player O wins"
                        } 
    //// tie
    if (gameScore.playerRound == 9)
        return "It's a tie! Click on Restart."
};

const conclusion = ( ()=> {
    let buttonRestart = document.querySelector("#restart");
    let buttonReset = document.querySelector("#reset")
    
    buttonRestart.addEventListener('click', () => {
        restart(); 
    });

    buttonReset.addEventListener('click', reset);

    // reset everything including round count
    function reset() {
        window.location.reload(); // can't use this if we plan to keep score.
    };

    // try again. leave's scores alone.
    function restart(){    
        gameBoard.reset();
        gameBoard.boardStatus();
        gameScore.reset();
        displayController.clearDisplay();
    };

    function gameEnd () {
        console.log('The game is over')
        gameScore.playerRound = 9; // disables all click event listeners.
    };

    return{gameEnd};
})();

// Bot button and opponent name
const botButton = ( ()=> {
    let botBtn = document.querySelector("#botSwitch")

    function botButtonOn(){
        bot.status = "On";
        botBtn.style.color = "#d3d3d3"
        console.log("Bot is now ON")
        
        let botName = document.querySelector('.player-o');
        botName.textContent = "HAL 9000"
        botName.style.color = "red"
        botName.style.fontWeight = "600"

        botBtn.removeEventListener("click", botButtonOn);
    };
    botBtn.addEventListener("click", botButtonOn);    
})();