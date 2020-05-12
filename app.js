const o = 'fa-circle-o';
const x = 'fa-times';
const title = document.querySelector('.title');
let currentPlayer = o;
let gameActive = false;
let mode = 0;
let board = ['','','','','','','','',''];
let aiPicked = true;
let level = 1;
let choice = o;
const combinations = [
    [0,1,2], 
    [3,4,5], 
    [6,7,8],
    [0,3,6], 
    [1,4,7], 
    [2,5,8],
    [0,4,8], 
    [2,4,6]
];
const cords = [
    [53,53], [153, 53],[253, 53],
    [53,156], [153, 156], [253, 156],
    [53, 253], [156, 253], [253, 259]
];

const boxes = document.querySelectorAll('.box');
boxes.forEach(box => box.addEventListener('click', boxClick));

function boxClick(event){
    const clickedBox = event.target;
    const clickedBoxIndex = clickedBox.getAttribute('data-box');
    if (board[clickedBoxIndex] !== '' || !gameActive) return;
    if (mode === 1) aiPicked = false;
    selectBox(clickedBox, clickedBoxIndex);
}

function selectBox(clickedBox, clickedBoxIndex){
    board[clickedBoxIndex] = currentPlayer;
    clickedBox.classList.add(currentPlayer);
    currentPlayerChange();
    if (checkWinConditions()){
        title.innerHTML = checkWinConditions();
        return;
    };
    if(!aiPicked){
        gameActive = false;
        aiPickBox();
    }
}

function aiPickBox(){
    if(level == 1){
        let empty = getEmptySpaces(board);
        let pickedBoxIndex = empty[Math.floor(Math.random() * empty.length)];
        if(board[pickedBoxIndex] !== ''){
            aiPickBox();
            return;
        }
        let pickedBox = document.querySelector("[data-box='"+pickedBoxIndex+"']");
        aiPicked = true;
        setTimeout(() => {
            selectBox(pickedBox, pickedBoxIndex);
            gameActive = true;
        }, 300);
    }
    else if(level == 2){
        let p = Math.floor(Math.random()*100);
        if(p < 70){
            let id = miniMax(board, currentPlayer).id;
            let pickedBox = document.querySelector("[data-box='"+id+"']");
            aiPicked = true;
            setTimeout(() => {
                gameActive = true;
                selectBox(pickedBox, id);
            }, 300);
        }
        else{
            let empty = getEmptySpaces(board);
            let pickedBoxIndex = empty[Math.floor(Math.random() * empty.length)];
            if(board[pickedBoxIndex] !== ''){
                aiPickBox();
                return;
            }
            let pickedBox = document.querySelector("[data-box='"+pickedBoxIndex+"']");
            aiPicked = true;
            setTimeout(() => {
                selectBox(pickedBox, pickedBoxIndex);
                gameActive = true;
            }, 300);
        }
    }
    else if(level == 3){
        let id = miniMax(board, currentPlayer).id;
        let pickedBox = document.querySelector("[data-box='"+id+"']");
        aiPicked = true;
        setTimeout(() => {
           gameActive = true;
           selectBox(pickedBox, id);
        }, 300);
    }
}


function miniMax(board, player){
    if(checkWin() == 'Wygrywa: O')
        return { evaluation : -10 };
    else if(checkWin() == 'Wygrywa: X')
        return { evaluation : 10 };
    else if(checkWin() == 'REMIS')
        return { evaluation : 0 };
    
    let empty = getEmptySpaces(board);
    let moves = [];

    for(let i=0; i< empty.length; i++){

        let id = empty[i];
        let backup = board[id];
        
        board[id] = player;

        let move = {};
        move.id = id;

        if(player == x){
            move.evaluation = miniMax(board, o).evaluation;
        }
        else{
            move.evaluation = miniMax(board, x).evaluation;
        }

        board[id] = backup;

        moves.push(move);
    }

    let bestMove;

    if (player == x){
        let bestEvaluation = -Infinity;
        for(let i=0; i<moves.length; i++){
            if (moves[i].evaluation > bestEvaluation){
                bestEvaluation = moves[i].evaluation;
                bestMove = moves[i];
            }
        }
    }
    else{
        let bestEvaluation = +Infinity;
        for(let i=0; i<moves.length; i++){
            if (moves[i].evaluation < bestEvaluation){
                bestEvaluation = moves[i].evaluation;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}   


function getEmptySpaces(board){
    //bebobebo
    let empty = [];
    for(let i=0; i<board.length; i++){
        if(board[i] == ''){
            empty.push(i);
        }
    }
    return empty;
}

function currentPlayerChange(){
    currentPlayer = currentPlayer === o ? x : o;
    if(currentPlayer == o){
        title.innerHTML = "Wybiera: O";
    }
    else{
        title.innerHTML = "Wybiera: X";
    }
}

function checkWin(){
    let winner = '';
    let moves = {
        'fa-circle-o': [],
        'fa-times': []
    };
    board.forEach((field,index) => moves[field] ? moves[field].push(index) : null);
    combinations.forEach(combination => {
        if(combination.every(index => moves[o].indexOf(index) > -1)) {
            winner = 'Wygrywa: O';
        }
        if(combination.every(index => moves[x].indexOf(index) > -1)) {
            winner = 'Wygrywa: X';
        }
        if(board.every(box => box != '') && winner == ''){
            winner = "REMIS";
        }
    });
    return winner;
}

function checkWinConditions(){
    let winner = '';
    let moves = {
        'fa-circle-o': [],
        'fa-times': []
    };
    board.forEach((field,index) => moves[field] ? moves[field].push(index) : null);
    combinations.forEach(combination => {
        if(combination.every(index => moves[o].indexOf(index) > -1)) {
            winner = 'Wygrywa: O';
            gameActive = false;
            drawLine(combination['0'],combination['2']);
            document.querySelector('.btn').style.display = 'flex';
        }
        if(combination.every(index => moves[x].indexOf(index) > -1)) {
            winner = 'Wygrywa: X';
            gameActive = false;
            drawLine(combination['0'],combination['2']);
            document.querySelector('.btn').style.display = 'flex';
        }
        if(board.every(box => box != '') && winner == ''){
            winner = "REMIS";
            gameActive = false;
            document.querySelector('.btn').style.display = 'flex';
        }
    });
    return winner;
}


function drawLine(b,e) {
    let c = document.querySelector('.winLine');
    let ctx = c.getContext('2d');
    let amount = 0;
    let begin = cords[b];
    let end = cords[e];
    let x1 = begin['0'] - 30,
    y1 = begin['1'] - 3,
    x2 = end['0'] + 30,
    y2 = end['1'] - 3;
    if (b == '0' && e == '8'){
        y1 -= 27;
        y2 += 27;
    }
    else if(b == '6' && e == '8'){
        y1 += 6;
    }
    else if(b == '0' && e == '6'){
        x1 += 27;
        y1 -= 27;
        x2 -= 33;
        y2 += 33;
    }
    else if(b == '2' && e == '8'){
        x1 += 33;
        y1 -= 27;
        x2 -= 27;
        y2 += 27;
    }
    else if(b == '1' && e == '7'){
        x1 += 30;
        y1 -= 27;
        x2 -= 33;
        y2 += 27;
    }
    else if(b == '2' && e == '6'){
        x1 += 57;
        y1 -= 24;
        x2 -= 54;
        y2 += 27;
    }
    let endX = x2, endY = y2;
    document.querySelector('.winLine').style.zIndex = '4';
    const draw = setInterval(function() {
        amount += 0.05;
        endX = x1 + (x2-x1) * amount;
        endY = y1 + (y2-y1) * amount;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = 'white';
        ctx.moveTo(x1, y1);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        if (amount > 1){
            clearInterval(draw);
        }
    }, 30);
}

const btn = document.querySelector('.btn');
btn.addEventListener('click', restartGame);
function restartGame() {
    gameActive = true;
    boxes.forEach(box => box.classList.remove('fa-circle-o','fa-times'));
    board = ['','','','','','','','',''];
    if (choice == o){
        title.innerHTML = 'Wybiera: O';
    }
    else if (choice == x){
        title.innerHTML = 'Wybiera: X';
    }
    currentPlayer = choice;
    document.querySelector('.winLine').style.zIndex = '1';
    let c = document.querySelector('.winLine');
    let ctx = c.getContext('2d');
    ctx.clearRect(0,0, c.width, c.height);
    setTimeout(() => document.querySelector('.btn').style.display = 'none', 100);
};

const vsPlayer = document.querySelector('.btn1');
const vsAi = document.querySelector('.btn2');
const aiLevel = document.querySelector('.ailevel');
const changeChar = document.querySelector('.changeChar');
const xo = document.querySelector('.xo');

vsPlayer.addEventListener('click', function(){
    gameActive = true;
    mode = 0;
    vsAi.classList.remove('active');
    vsPlayer.classList.add('active');
    aiLevel.style.display = 'none';
})

vsAi.addEventListener('click', function(){
    gameActive = true;
    mode = 1;
    vsPlayer.classList.remove('active');
    vsAi.classList.add('active');
    aiLevel.style.display = 'flex';
})

aiLevel.addEventListener('click', function(){
    if (level == 1){
        aiLevel.innerHTML = 'Ai level: 2';
        level = 2;
    }
    else if (level == 2){
        aiLevel.innerHTML = 'Ai level: 3';
        level = 3;
    }
    else if (level == 3){
        aiLevel.innerHTML = 'Ai level: 1';
        level = 1;
    }
    restartGame();
})

changeChar.addEventListener('click', function(){
    changeChar.style.display = 'none';
    xo.style.display = 'flex';
    if(gameActive){
        restartGame();
    }
})

document.querySelector('.o').addEventListener('click', function(){
    changeChar.style.display = 'flex';
    xo.style.display = 'none';
    choice = o;
    currentPlayer = choice;
    title.innerHTML = 'Wybiera: O';
})

document.querySelector('.x').addEventListener('click', function(){
    changeChar.style.display = 'flex';
    xo.style.display = 'none';
    choice = x;
    currentPlayer = choice;
    title.innerHTML = 'Wybiera: X';
})
