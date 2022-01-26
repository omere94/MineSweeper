'use strict';

//render board
function renderBoard(board, selector) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `hidden cell-${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this, 
                ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//Random number include the max num
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var milliSec = 0;
var sec = 0;
var minute = 0;

function timer() {
    milliSec++;
    if (milliSec === 10) {
        milliSec = 0;
        sec++;
        gGame.secsPassed++;
    }
    if (sec === 60) {
        sec = 0
        minute++
    }
    var str;
    if (sec < 10) {
        str = `0${minute}:0${sec}.${milliSec}`;
    } else str = `0${minute}:${sec}.${milliSec}`;
    var elTimerDiv = document.querySelector('.timer span');
    elTimerDiv.innerText = str;
}