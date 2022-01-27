'use strict';


const MINE = '💣';
const MARK = '🚩';
const EMOJI = '😀';
const EMOJI_LOSE = '😡';
const EMOJI_WIN = '😎';

var gameOver = false;
var gBoard = [];
var gTimerInterval = null;
var gCellClicked = false;
var gLivesCounter = 3;
var gBtn;

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
    resetTimer();
    gCellClicked = false;
    gLivesCounter = 3;
    gGame = {
        isOn: false,
        shownCount: 0,
        markCount: 0,
        secsPass: 0
    }
    gameOver = false;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard, '.board')
    clearInterval(gTimerInterval);
    const btn = document.getElementById("emoji")
    btn.innerHTML = EMOJI;
    const livesHeader = document.getElementById("lives_header")
    livesHeader.innerText = gLivesCounter + " 💓 Lives left";
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

function findMines(board, i, j) {

    for (var k = 0; k < gLevel.MINES; k++) {
        var newI = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        var newJ = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        while (gBoard[newI][newJ].isMine || (i === newI && j === newJ)) {
            newI = getRandomIntInclusive(0, (gLevel.SIZE - 1));
            newJ = getRandomIntInclusive(0, (gLevel.SIZE - 1));
        }
        board[newI][newJ].isMine = true
    }
}

function cellClicked(elCell, i, j) {

    if (!gCellClicked) {
        gCellClicked = true
        gBtn = document.getElementById("emoji")
        gBtn.addEventListener("click", () => {
            initGame()
        })
        findMines(gBoard, i, j);
        setMinesNegsCount(gBoard);
    }


    if (gameOver)
        return;

    if (gGame.isOn === false) {

        gGame.isOn = true;
        gTimerInterval = setInterval(timer, 100);
    }
    var cell = gBoard[i][j];
    if (cell.isShown === true || cell.isMarked === true) return;
    if (cell.isMine === true) {
        gLivesCounter--;
        const livesHeader = document.getElementById("lives_header")
        livesHeader.innerText = gLivesCounter + " 💓 Lives left";
        if (gLivesCounter > 0) {
            alert('Sorry, you only have ' + gLivesCounter + ' attempts')
        } else {
            elCell.classList.remove('hidden')
            elCell.innerHTML = MINE;


            checkGameOver(true)
            clearInterval(gTimerInterval);
        }


        return;
    }

    if (i + 1 < gLevel.SIZE) {
        if (!gBoard[i + 1][j].isMine && gBoard[i + 1][j].minesAroundCount === 0) {
            if (!gBoard[i + 1][j].isShown) {
                renderCell(gBoard[i + 1][j].minesAroundCount, i + 1, j)
                gBoard[i + 1][j].isShown = true;
                gGame.shownCount++
            }

        }
    }
    if (j + 1 < gLevel.SIZE) {
        if (!gBoard[i][j + 1].isMine && gBoard[i][j + 1].minesAroundCount === 0) {
            if (!gBoard[i][j + 1].isShown) {
                renderCell(gBoard[i][j + 1].minesAroundCount, i, j + 1)
                gBoard[i][j + 1].isShown = true;
                gGame.shownCount++
            }

        }
    }
    if (i - 1 >= 0)
        if (!gBoard[i - 1][j].isMine && gBoard[i - 1][j].minesAroundCount === 0) {
            if (!gBoard[i - 1][j].isShown) {
                renderCell(gBoard[i - 1][j].minesAroundCount, i - 1, j)
                gBoard[i - 1][j].isShown = true;
                gGame.shownCount++
            }

        }
    if (j - 1 >= 0)
        if (!gBoard[i][j - 1].isMine && gBoard[i][j - 1].minesAroundCount === 0) {
            if (!gBoard[i][j - 1].isShown) {
                renderCell(gBoard[i][j - 1].minesAroundCount, i, j - 1)
                gBoard[i][j - 1].isShown = true;
                gGame.shownCount++
            }

        }


    var content = cell.minesAroundCount;
    if (content === 0) content = '';
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.remove('hidden')
    elCell.innerHTML = content;
    checkGameOver(false);

    var cell = gBoard[i][j];
    if (cell.isShown || cell.isMarked) return;
    if (cell.isMine && lives === 1) {
        elCell.classList.remove('hidden')
        elCell.innerHTML = MINE;


        gGame.isOn = false;
        gameOver = true;
        clearInterval(gTimerInterval);

        return;
    }
}

function cellMarked(elCell, i, j) {

    if (gameOver)
        return;

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
    checkGameOver(false);
}

function checkGameOver(touchMine) {

    var cellsCount = gLevel.SIZE ** 2;
    var noMines = cellsCount - gLevel.MINES;

    if (touchMine) {
        gGame.isOn = false;
        gameOver = true;
        clearInterval(gTimerInterval);
        const btn = document.getElementById("emoji")
        btn.innerHTML = EMOJI_LOSE;
        alert('You Lost!')
        return true;
    } else if (gGame.shownCount === noMines && gGame.markCount === gLevel.MINES) {
        gGame.isOn = false;
        gameOver = true;
        clearInterval(gTimerInterval);
        const btn = document.getElementById("emoji")
        btn.innerHTML = EMOJI_WIN;
        alert('You Win!')

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

function restart() {

    initGame();
}

