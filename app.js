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
        // you are reassigning the _board property to a new memory reference. However, the gameConditions is still referencing/pointing to the old array, hence it won't work on new rounds.
        //this._board = ["", "", "", "", "", "", "", "", ""];
        this._board.length = 0;
    }

    return {playerMove, boardStatus, _board, reset} // need _board for gameConditions 

})();

// controls what happens when player clicks on block and sends move to gameboard
const displayController = ( () => {
    // const block0 = document.querySelector("#block0");
    const setBlock = (e, symbol) => {
        e.target.textContent = symbol;
        e.target.classList.remove("empty");
        e.target.classList.add("taken");
        // The target event property returns the element that triggered the event.
    }

    const clearDisplay = () => {
        let blocks = document.querySelectorAll(".block");
        blocks.forEach((block) => { 
            block.classList.remove("taken");
            block.classList.add("empty");
            block.textContent = "";
            });
        let messages = document.querySelector('#gamemessages');
        messages.textContent = "Playing new round."
        messages.style.color = "red";
    };

    return {setBlock, clearDisplay};
})();

// -----> I guess the only global code??? 
//let playerRound = 0; // using since we arn't using array.length to determine game end.

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

    // const reset = () => {
    //     playerRound = 0;
    // }

    function reset(){
        this.playerRound = 0;
    }
    
    return {playerRound, setScore1, setScore2, reset}
})();

// checks who's turn it is, gameboard status, and winning conditions
const gameFlow = ( () => {    
    let symbol = "";
    //let playerRound = 0   // IIFE will immeidatley invoke and return the playerRound on startup, therefore always 0.
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
            //console.log(e);
            //if(gameBoard.board[arrayIndex] === ""){
            if(block.classList.contains('empty') && gameScore.playerRound !== 9){
                playerTurn();
                displayController.setBlock(e, symbol);
                gameBoard.playerMove(arrayIndex, symbol); 
                gameScore.playerRound++;
                console.log(`gameFlow playerRound ${gameScore.playerRound}`)
                let gameStatus = gameConditions();
                //console.log(gameStatus)
                if(gameStatus){
                    let messages = document.querySelector('#gamemessages');
                    messages.textContent = gameStatus
                    if(gameStatus === "Player X wins"){
                        gameScore.setScore1();
                    } else if (gameStatus === "Player O wins"){
                        gameScore.setScore2();
                    }
                    gameEnd();
                }
            }
        });
    })
    
    // // why do I not need to declare/find html element first???? 
    // gamemessages.addEventListener("click", (e) => {
    //     if(block0.classList.contains('empty')){
    //         playerTurn(e);
    //         displayController.setBlock(e, symbol);
    //         //gameBoard.board[0] = symbol;
    //         playerRound++;
    //     };
    // });

    //return {playerRound};
})();

// check win/lose/tie
const gameConditions = () => {
    //console.log(`gameConditions ${playerRound}`)
    //// tie
    if (gameScore.playerRound == 9)
        return "It's a tie! Click on Restart."
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
};

function gameEnd () {
    console.log('The game is over')
    gameScore.playerRound = 9;
}

// reset everything including round count
function reset() {
    window.location.reload(); // can't use this if we plan to keep score.
}

// try again. leave's scores alone.
function restart(){    
    gameBoard.reset();
    gameBoard.boardStatus();
    gameScore.reset();
    displayController.clearDisplay();
}

///// factories
const player = (symbol, typeOfPlayer) => {
    let wins = 0;
    let playerType = typeOfPlayer;
    const winGame = () => {
        wins++;
        console.log(`${symbol} wins game. Games won: ${wins}`);
    }
    return { symbol, winGame }

};

const playerFirst = player("x", "human");
const playerSecond = player("o", "human");
const playerBot = player("o", "bot");





// Notes:  https://youtu.be/aHrvi2zTlaU?t=898
// also Function Factory as shown below (not to be confused w/ factory function) https://youtu.be/0aKZvNNf8BA?t=487
// function myFunc(color) {
//     return function(){
//         document.body.style.color = color;
//     }
// }

let buttonRestart = document.querySelector("#restart");
let buttonReset = document.querySelector("#reset")
//butt.addEventListener('click', myFunc("red"));
buttonRestart.addEventListener('click', () => {
    //document.body.style.color = 'red';
    restart(); 
})

buttonReset.addEventListener('click', reset);