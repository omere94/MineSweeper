'use strict';


const MINE = '💣';
const MARK = '🚩';
const EMOJI = '<img src="../img/emoji.png" />';
const EMOJI_LOSE = '<img src="../img/emoji lose.png" />'
const EMOJI_WIN = '<img src="../img/emoji win.png" />'

var gBoard = [];
var gTimerInterval = null;

var gLevel = {
    SIZE: 4,
    MINES: 2
};
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
    /*board[1][1] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false
    }
    board[3][2] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false
    }*/
    return board;
}

function setMinesNegsCount(i, j) {

    var negsCount = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if(gBoard[i][j].isMine === false) {
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
    };
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
        alert('Victory');
        return true;
    }
    return false;
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


//function expandShown(board, elCell, i, j)
