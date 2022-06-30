// array inputs displayed to DOM game board
const gameBoard = ( () => {
    const _board = ["", "", "",
                   "", "", "",
                   "", "", ""];

    function playerMove (arrayIndex, symbol) {
        _board[arrayIndex] = symbol;
    };

    function boardStatus () {
        console.log(_board);
    }

    return {playerMove, boardStatus, _board} // need _board for gameConditions 

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
    return {setBlock};
})();

// -----> I guess the only global code??? 
let playerRound = 0; // using since we arn't using array.length to determine game end.

// checks who's turn it is, gameboard status, and winning conditions
const gameFlow = ( () => {    
    let symbol = "";
    //let playerRound = 0   // IIFE will immeidatley invoke and return the playerRound on startup, therefore always 0.
    const playerTurn = () => {
            if(playerRound == 0 || playerRound % 2 == 0){
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
            if(block.classList.contains('empty')){
                playerTurn();
                displayController.setBlock(e, symbol);
                gameBoard.playerMove(arrayIndex, symbol); 
                playerRound++;
                console.log(`gameFlow playerRound ${playerRound}`)
                let gameStatus = gameConditions();
                //console.log(gameStatus)
                if(gameStatus){
                    let messages = document.querySelector('#gamemessages');
                    messages.textContent = gameStatus
                    messages.style.color = "red";
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
    return {playerRound};
})();

// check win/lose/tie
const gameConditions = () => {
    //console.log(`gameConditions ${playerRound}`)
    //// tie
    if (playerRound == 9)
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
    }

function restart () {
    // being lazy and directly changing array
    //gameBoard._board = ["", "", "", "", "", "", "", "", ""]
    window.location.reload(); // can't use this if we plan to keep score.
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

let button = document.querySelector("button");
//butt.addEventListener('click', myFunc("red"));
button.addEventListener('click', () => {
    //document.body.style.color = 'red';
    restart(); 
})