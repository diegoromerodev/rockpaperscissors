//PSEUDOCODE
//-----------
//RANDOMLY PICK A MOVE
//create an array of available moves
const moves = ['Rock', 'Paper', 'Scissors'];
const movesUrl = [
    '<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/comet_2604-fe0f.png" alt="Rock icon">',
    '<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/memo_1f4dd.png" alt="Paper icon">',
    '<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/scissors_2702-fe0f.png" alt="Scissors icon">'
]

//variables for storing purposes
let lastpcIx;
let pIx;
let cIx;

function computerPlay() {
    //generate a random index
    let pcIx = Math.floor(Math.random() * 3)
    if (pcIx === lastpcIx) {
        //roll once more, to make a bit more unpredictable
        pcIx = Math.floor(Math.random() * 3)
    }
    lastpcIx = pcIx
    move = moves[pcIx]
    const pcBtn = document.querySelector(`button[data-move="${move.toLowerCase()}"]`)

    buttons.forEach(button => button.classList.remove('pc-last-selected'))
    pcBtn.classList.add('pc-last-selected')

    return move
}

//PLAY A SINGLE ROUND
function playRound(playerSelection, computerSelection) {
    let result;
    pIx = moves.indexOf(playerSelection[0].toUpperCase() + playerSelection.slice(1))
    cIx = moves.indexOf(computerSelection)

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

// CONNECT UI

//variables to store results
let playerScore = 0;
let computerScore = 0;
let roundNumber = 0;

//element storing variables
const roundsDiv = document.querySelector('.rounds')
const winnerParent = document.querySelector('#winner-container')
const winnerBox = document.querySelector('#winner-container .dialog-content')
const intro = document.querySelector('#first-move')

//select butttons
const buttons = document.querySelectorAll('.btn')
//add click events listener
buttons.forEach(button => button.addEventListener('click', makeMove))

//make move from button and save result, call result element creator
function makeMove(){
    const outcome = playRound(this.dataset.move, computerPlay())
    updateResults(outcome)

    //add a custom last selected class
    removeLastSelected()
    this.classList.add('last-selected')
    intro.classList.add('disable')
}

//function to update results and number of rounds
function updateResults(result){
    roundNumber++
    //logic to determine if we win or not
    if (result.includes('Win')){
        playerScore++
        resultBlock(result, 'win')
    } else if (result.includes('Lose')){
        computerScore++;
        resultBlock(result, 'loss')
    } else {
        resultBlock(result)
    }
    scoreBlock()
    if(playerScore >= 5 || computerScore >= 5) winnerFunction()
}

//function to update score UI
function scoreBlock(){
    const playerText = document.querySelector('.playerScore')
    const computerText = document.querySelector('.computerScore')

    playerText.textContent = 'YOU: ' + playerScore;
    computerText.textContent = 'PC: ' + computerScore;

    //conditional class to add a bit of styling to winning score
    if (playerScore > computerScore){
        computerText.classList.remove('winning')
        playerText.classList.add('winning')
    } else if (playerScore < computerScore) {
        playerText.classList.remove('winning')
        computerText.classList.add('winning')
    } else {
        //remove .winning in case of a tie
        computerText.classList.remove('winning')
        playerText.classList.remove('winning')
    }
}

//function that creates a result UI
function resultBlock(result, type) {

    //single round div with text and images
    const div = document.createElement('div')
    div.classList.add('single-round', type || 'tie')

    //round text div
    const textDiv = document.createElement('div')
    textDiv.classList.add('round-text')
    
    //heading for round number
    const roundN = document.createElement('h2')
    roundN.textContent = `ROUND #${roundNumber}`

    //show result as text
    const resultP = document.createElement('p')
    resultP.textContent = result

    textDiv.append(roundN, resultP)
    
    
    //OPTIONAL: image icons for each result

    //use global index variables to find images
    const pcIcon = movesUrl[cIx]
    const playerIcon = movesUrl[pIx]

    //create a formated html string
    const imgDiv = `
    <div class="round-images">
        ${playerIcon}
        <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/vs-button_1f19a.png" alt="Versus icon">
        ${pcIcon}
    </div>

    `
    
    div.append(textDiv)
    div.insertAdjacentHTML("beforeend", imgDiv)
    roundsDiv.prepend(div)
}

//function that displays winner block
function winnerFunction(){
    let winner = '';
    let tagline = '';

    //sets variables to change dialog text
    if(playerScore >= 5){
        winner = 'PLAYER WINS!';
        tagline = 'You were just lucky!'
        winnerBox.classList.add('player-wins')
    } else if(computerScore >= 5){
        winner = 'THE ROBOT WINS!';
        tagline = 'You can\'t beat me!';
        winnerBox.classList.remove('player-wins')
    }

    winnerBox.querySelector('h3').textContent = winner;
    winnerBox.querySelector('p').textContent = tagline;
    winnerBox.querySelector('a').addEventListener('click', newGame);

    //toggle the winner window
    toggleWindow()
}

//this function just hides and shows the winner dialog
function newGame(){
    toggleWindow()
    playerScore = 0;
    computerScore = 0;
    roundNumber = 0;
    
    roundsDiv.innerHTML = '';
    
    //update scores with reset values
    scoreBlock();
    removeLastSelected()
    buttons.forEach(button => button.classList.remove('pc-last-selected'))
    intro.classList.remove('disable')
}

function toggleWindow(){
    winnerParent.classList.toggle('disable');
}

function removeLastSelected(){
    buttons.forEach(button => button.classList.remove('last-selected'))
}