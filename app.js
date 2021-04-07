//PSEUDOCODE
//-----------
//RANDOMLY PICK A MOVE
//create an array of available moves
const moves = ['rock', 'paper', 'scissors'];

function computerPlay() {
    //generate a random index
    const pcIx = Math.floor(Math.random() * 3)
    return moves[pcIx]
}

//PLAY A SINGLE ROUND
function playRound(playerSelection, computerSelection) {
    let result;
    const pIx = moves.indexOf(playerSelection.toLowerCase())
    const cIx = moves.indexOf(computerSelection)
    if (pIx === cIx) return "It's a tie";
    else if (pIx === 0) result = cIx === 1 ? "You Lose" : "You Win";
    else if (pIx === 1) result = cIx === 2 ? "You Lose" : "You Win";
    else if (pIx === 2) result = cIx === 0 ? "You Lose" : "You Win";
    const winMove = result.includes('Win')
                        ? `${moves[pIx]} beats ${moves[cIx]}` 
                        : `${moves[cIx]} beats ${moves[pIx]}`;
    return `${result}! ${winMove}`
}


//WRITE A GAME LOOP

//create game function
function game(loopCount = 5) {
    let playerScore = 0;
    let computerScore = 0;
    //call on loop, 5 times
    for (let i = 1; i <= loopCount; i++){
        //ask for user input
        const playerMove = prompt("Rock, Paper, Scissors?");
        //call playRound with computer guess
        const result = playRound(playerMove, computerPlay());
        //save score based on returned string
        if (result.includes("Win")) playerScore++;
        else if (result.includes('Lose')) computerScore++;
        console.log(`Round ${i}: ${result}.\n\nPlayer Score: ${playerScore}, Computer Score: ${computerScore}`)
    }
    if (playerScore === computerScore) return "This game was a tie!"
    return playerScore > computerScore ? "You WIN the game!" : "You LOST, better luck next time!";
}