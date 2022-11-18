// array inputs displayed to DOM game board
const gameBoard = ( () => {
    let _board = ["", "", "",
                   "", "", "",
                   "", "", ""];

    // 11/17/22  why am i using 'this' -not needed?
    function playerMove (arrayIndex, symbol) {
        _board[arrayIndex] = symbol;
    };

    function boardStatus() {
        console.log(this._board);
    }

    function reset() {
        // you are reassigning the _board property to a new memory reference. However, the gameConditions is still referencing/pointing to the old array, hence it won't work on new rounds.
        //this._board = ["", "", "", "", "", "", "", "", ""];
        //this._board.length = 0; // this will cause infinite w/ the bot since random index can be 0.
        this._board.splice(0, 9, "", "", "", "", "", "", "", "", "");
    }
    
    // the Revealing Pattern: https://youtu.be/8GDk8sj0YgQ?t=668
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

    const setBotBlock = (botArrayIndexDATA, symbol) => {
        console.log("setBotBlock's botArrayIndex: " + botArrayIndexDATA)
        let index = document.querySelector(`[data-array="${botArrayIndexDATA}"]`)
        console.log("Index: " + index);
        index.textContent = symbol;
        index.classList.remove("empty");
        index.classList.add("taken");
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

    // select all the squares and add eventlistener to all
    let blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => {
        block.addEventListener("click", (e) => {
            // create arrayIndex, and set it to the block'c unique dataset array number
            let arrayIndex = block.dataset.array;
            //console.log(e);
            //if(gameBoard.board[arrayIndex] === ""){

            // if block has 'empty' class, invoke playerTurn()
            if(block.classList.contains('empty') && gameScore.playerRound !== 9){
                playerTurn(); // whose turn and symbol is it? 
                displayController.setBlock(e, symbol); // mark X or O to screen               
                gameBoard.playerMove(arrayIndex, symbol); // mark change to board array 
                gameScore.playerRound++; // next round
                console.log(`gameFlow playerRound ${gameScore.playerRound}`)

                let gameStatus = gameConditions(); // check conditions before next round
                if(gameStatus){
                    let messages = document.querySelector('#gamemessages');
                    messages.textContent = gameStatus
                    if(gameStatus === "Player X wins"){
                        gameScore.setScore1();
                    } else if (gameStatus === "Player O wins"){
                        gameScore.setScore2();
                    }
                    gameEnd(); // game end. if not, then leave alone and wait for user/bot move. code for round has run it's length.
                }    
            }
            // if bot is on
            if(bot.status == "On" && gameScore.playerRound !== 9){
            //if(block.classList.contains('empty') && gameScore.playerRound !== 9){
                console.log("bot status == On therefore moving")
                // playerTurn(); // whose turn and symbol is it? 
                // console.log("bot symbol: " + symbol)
                //symbol = "O"
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

const bot = ( ()=> {
    let status = "Off";
    let botArrayIndex = "";
    

    function move(){
        // will need to change the array length 0 on restart later.
        // let boardCopy = gameBoard._board.map( (element) => {
        //     return element;
        // });
        // console.table("Copy of boardgame is: " + boardCopy);
        // console.log("boardCopy.length: " + boardCopy.length)

        //skill: random
        
        // while (gameBoard._board[i] !== "X" || gameBoard._board[i] !== "O") {
        //     let i = Math.floor(Math.random() * gameBoard._board.length)
        //     //console.log(x);
        //     console.log("module botArrayIndex: " + i)
        //     return this.botArrayIndex = i;
        // }

        let randomIndex = Math.floor(Math.random()*gameBoard._board.length);
        console.log("before if statement randomIndex: " + randomIndex)
        if(gameBoard._board[randomIndex] == "X" || gameBoard._board[randomIndex] == "O"){
            return bot.move(); // recursion? https://stackoverflow.com/questions/19075461/generate-one-random-index-from-an-array-but-exclude-one-javascript
        } else {
            this.botArrayIndex = randomIndex;
            console.log("else statement botArrayIndex: " + botArrayIndex)

            //return botArrayIndex;
        }
        console.log(botArrayIndex)
    }

    return {status, move, botArrayIndex}
})();

// check win/lose/tie
const gameConditions = () => {
    //console.log(`gameConditions ${playerRound}`)
    
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

function gameEnd () {
    console.log('The game is over')
    gameScore.playerRound = 9; // disables all click event listeners.
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
// const player = (symbol, typeOfPlayer) => {
//     let wins = 0;
//     let playerType = typeOfPlayer;
//     const winGame = () => {
//         wins++;
//         console.log(`${symbol} wins game. Games won: ${wins}`);
//     }
//     return { symbol, winGame }

// };

// const playerFirst = player("x", "human");
// const playerSecond = player("o", "human");
// const playerBot = player("o", "bot");





// Notes:  https://youtu.be/aHrvi2zTlaU?t=898
// also Function Factory as shown below (not to be confused w/ factory function) https://youtu.be/0aKZvNNf8BA?t=487
// function myFunc(color) {
//     return function(){
//         document.body.style.color = color;
//     }
// }   
// hmm his video is OnClick = xxx. In all your Index.html, it will have onclick=myFunc() as the required syntax.
// Whereas mine below is addEventListener.  if you did buttonReset....('click', reset()), page will load and reset infinitely.... both IFFE and nonIFFE.

let buttonRestart = document.querySelector("#restart");
let buttonReset = document.querySelector("#reset")
//butt.addEventListener('click', myFunc("red"));
buttonRestart.addEventListener('click', () => {
    //document.body.style.color = 'red';
    restart(); 
}) 

buttonReset.addEventListener('click', reset);

// let botSwitch = document.querySelector("#botSwitch3");
// botSwitch.addEventListener("click", () => {
//     bot.status = "On";
//     console.log("Bot is now ON")
//     let botName = document.querySelector('.player-o');
//     botName.textContent = "HAL 9000"
//     botName.style.color = "red"
//     botName.style.fontWeight = "600"
//     botSwitch.style.color = "#d3d3d3"
//     //botSwitch.removeEventListener("click", )
// });

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



/* recursion w/o returns

https://betterprogramming.pub/importance-of-the-return-keyword-in-recursive-javascript-functions-d12203c30d1a

https://stackoverflow.com/questions/47935979/why-does-a-recursive-function-call-need-to-return-a-value-to-calling-function

*/
