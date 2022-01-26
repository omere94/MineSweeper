'use strict';

//builds a matrix
function createMat(rows, cols) {
    var mat = []
    for (var i = 0; i < rows; i++) {
        var row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

//Gets matrix and selector name to render the table in it.
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '">' + cell + '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

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

//gets an array and shuffles it
function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomIntInclusive(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

//return a random color name
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//random number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomPos(mat) {
    return {
        i: getRandomInt(0, mat.length),
        j: getRandomInt(0, mat[0].length)
    };
}

function getPos(i, j) {
    return {
        i: i,
        j: j
    };
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