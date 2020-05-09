const o = 'fa-circle-o';
const x = 'fa-times';
const title = document.querySelector('.title');
let currentPlayer = o;
let gameActive = false;
let mode = 0;
let board = ['','','','','','','','',''];
let aiPicked = true;
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
    if (!checkWinConditions() && board.every(box => box != '')){
        title.innerHTML = "REMIS";
        gameActive = false;
    }
    if (checkWinConditions()){
        title.innerHTML = checkWinConditions();
        return;
    };
    console.log(aiPicked);
    if(!aiPicked){
        aiPickBox();
    }
}

function aiPickBox(){
    let pickedBoxIndex = Math.floor(Math.random() * 9);
    if(board[pickedBoxIndex] !== ''){
        aiPickBox();
        return;
    }
    let pickedBox = document.querySelector("[data-box='"+pickedBoxIndex+"']");
    aiPicked = true;
    setTimeout(() => selectBox(pickedBox, pickedBoxIndex), 500);
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
        }
        if(combination.every(index => moves[x].indexOf(index) > -1)) {
            winner = 'Wygrywa: X';
            gameActive = false;
            drawLine(combination['0'],combination['2']);
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
btn.addEventListener('click', function() {
    gameActive = true;
    boxes.forEach(box => box.classList.remove('fa-circle-o','fa-times'));
    board = ['','','','','','','','',''];
    title.innerHTML = 'Wybiera: O';
    currentPlayer = o;
    document.querySelector('.winLine').style.zIndex = '1';
    let c = document.querySelector('.winLine');
    let ctx = c.getContext('2d');
    ctx.clearRect(0,0, c.width, c.height);
})

const vsPlayer = document.querySelector('.btn1');
const vsAI = document.querySelector('.btn2');

vsPlayer.addEventListener('click', function(){
    document.querySelector('.btn').style.visibility = 'visible';
    gameActive = true;
    mode = 0;
})

vsAI.addEventListener('click', function(){
    document.querySelector('.btn').style.visibility = 'visible';
    gameActive = true;
    mode = 1;
})