///// modules (something you only need one of)

// array inputs displayed to DOM game board
// 3. Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage
const gameBoard = ( () => {

    const board = ["", "", "",
                   "", "", "",
                   "", "", ""];

    return {board}

})();

// controls what happens when player clicks on block and sends move to gameboard
const displayController = ( () => {
    const block0 = document.querySelector("#block0");
    const block1 = document.querySelector("#block1");
    const block2 = document.querySelector("#block2");
    const block3 = document.querySelector("#block3");
    const block4 = document.querySelector("#block4");
    const block5 = document.querySelector("#block5");
    const block6 = document.querySelector("#block6");
    const block7 = document.querySelector("#block7");
    const block8 = document.querySelector("#block8");

    const setBlock = (e, symbol) => {
        e.target.textContent = symbol;
        e.target.classList.remove("empty");
        e.target.classList.add("taken");
        // The target event property returns the element that triggered the event.
    }

    return {setBlock};

})();

// checks who's turn it is, gameboard status, and winning conditions
const gameFlow = ( () => {    
    let symbol = "";
    let playerRound = 0;
    const playerTurn = (e) => {
            if(playerRound == 0 || playerRound % 2 == 0){
                // it's player 1's turn
                symbol = "X";
            } else {
                symbol = "O";
            };
            //displayController.setBlock(e, symbol);
        }

    block0.addEventListener("click", (e) => {
        if(block0.classList.contains('empty')){
            playerTurn(e);
            displayController.setBlock(e, symbol);
            gameBoard.board[0] = symbol;
            playerRound++;
        };
    });
    block1.addEventListener("click", (e) => {
        if(block1.classList.contains('empty')){
            playerTurn(e);
            displayController.setBlock(e, symbol);
            gameBoard.board[1] = symbol;
            playerRound++;
        };
    });  
    

    // let blocks = document.querySelectorAll(".block");
    // let arrayIndex = 0;
    // blocks.forEach((block) => {
    //     block.addEventListener("click", (e) => {
    //         if(block.classList.contains('empty')){
    //             playerTurn(e);
    //             displayController.setBlock(e, symbol);
    //             gameBoard.board[arrayIndex] = symbol;
    //             playerRound++;
    //             arrayIndex++;  //wrong. this only assigns on click.
    //         }
    //     });
    // })


    
})();

// check win/lose/tie
const gameConditions = ( () => {

})();


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