'use strict';


const MINE = '💣';
const MARK = '🚩';
const EMOJI = '😀';
const EMOJI_LOSE = '😡';
const EMOJI_WIN = '😆';
const LIVES = '💓';
const HINT = '💡';

var gBoard = [];
var gTimerInterval = null;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markCount: 0,
    secsPass: 0
}

function initGame() {
    gBoard = buildBoard(gLevel.SIZE);
    findMines(gBoard, gLevel.MINES);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board')
    console.table(gBoard)
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board;
}

function setMinesNegsCount(i, j) {

    var negsCount = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine === false) {
                if (i + 1 < gLevel.SIZE) {
                    if (gBoard[i + 1][j].isMine === true) negsCount++;
                }
                if (j + 1 < gLevel.SIZE) {
                    if (gBoard[i][j + 1].isMine === true) negsCount++;
                }
                if (i - 1 >= 0) {
                    if (gBoard[i - 1][j].isMine === true) negsCount++;
                }
                if (j - 1 >= 0) {
                    if (gBoard[i][j - 1].isMine === true) negsCount++;
                }
            }
            gBoard[i][j].minesAroundCount = negsCount;
            negsCount = 0;
        }
    }
}

function findMines(board) {
    var lastLocation = {
        i: null,
        j: null
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        var newI = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        var newJ = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        if (lastLocation.i === newI && lastLocation.j === newJ)
            newI = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        board[newI][newJ].isMine = true;
        lastLocation.i = newI;
        lastLocation.j = newJ;
    }
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false) {
        gGame.isOn = true;
        gTimerInterval = setInterval(timer, 100);
    }
    var cell = gBoard[i][j];
    if (cell.isShown === true || cell.isMarked === true) return;
    if (cell.isMine === true) {
        elCell.classList.remove('hidden')
        elCell.innerHTML = MINE;
        gGame.isOn = false;
        
        clearInterval(gTimerInterval);
        return;
    }
    var content = cell.minesAroundCount;
    if (content === 0) content = '';
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.remove('hidden')
    elCell.innerHTML = content;
    checkGameOver();

    var cell = gBoard[i][j];
    if (cell.isShown || cell.isMarked) return;
    if (cell.isMine && lives === 1) {
        elCell.classList.remove('hidden')
        elCell.innerHTML = MINE;
        findMines();

        gGame.isOn = false;
        gameOver = true;
        clearInterval(gTimerInterval);

        elEmojiDiv.innerHTML = EMOJI_LOSE;
        elLivesDiv.innerText = LIVES;
        return;
    }
}

function cellMarked(elCell, i, j) {
    if (gGame.isOn === false) {
        gGame.isOn = true;
        gTimerInterval = setInterval(timer, 100);
    }
    if (!elCell.classList.contains('hidden')) return;
    var cell = gBoard[i][j]
    if (cell.isMarked === false) {
        gGame.markCount++;
        cell.isMarked = true;
        elCell.innerHTML = MARK;
    } else if (cell.isMarked === true) {
        gGame.markCount--;
        cell.isMarked = false;
        elCell.innerHTML = '';
    }
}

function checkGameOver() {
    var cellsCount = gLevel.SIZE ** 2;
    var noMines = cellsCount - gLevel.MINES;
    if (gGame.shownCount === noMines && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false;
        gameOver = true;
        clearInterval(gTimerInterval);
        elEmojiDiv.innerHTML = EMOJI_WIN;
        return true;
    }
    return false;
}

function expandShown(gBoard, elCell, cellI, cellJ) {
    var currCell;
    checkGameOver();
    
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i > gBoard.length - 1) continue;
            if (j < 0 || j > gBoard[0].length - 1) continue;

            currCell = document.querySelector('#cell-' + i + '-' + j);
            if (currCell.gBoard[i][j]) continue;
            else if (gBoard[i][j].isMine) continue;
            else if (gBoard[i][j].isOn) continue;

            else {
                if (gBoard[i][j].minesAroundCount > 0) {
                    currCell.innerHTML = gBoard[i][j].negs;
                    currCell.style.backgroundColor = 'rgba(13, 68, 119, 0.63)';
                    gBoard[i][j].isOn = true;
                    gGame.shownCount++;
                    checkGameOver();

                } else {
                    gGame.shownCount++;
                    if (!elCell.children[0]) {
                        elCell.style.backgroundColor = 'rgba(13, 68, 119, 0.63)';
                    }
                    currCell.style.backgroundColor = 'rgba(13, 68, 119, 0.63)';
                    gBoard[i][j].ison = true;

                    expandShown(gBoard, currCell, i, j);
                }
            }
        }
    }
}

function gameLevel(level) {
    switch (level) {
        case 1:
            gLevel = {
                SIZE: 4,
                MINES: 2
            };
            initGame();
            break;
        case 2:
            gLevel = {
                SIZE: 8,
                MINES: 12
            };
            initGame();
            break;
        case 3:
            gLevel = {
                SIZE: 12,
                MINES: 30
            };
            initGame();
            break;
    }
}

