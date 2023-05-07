import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLoose,
} from './logic.js';

// * DOM Elements
const boardElement = document.querySelector('.board');
const messageText = document.querySelector('.subtext');
const minesLeftText = document.querySelector('[data-mine-count]');

// * UI
const BORDER_SIZE = 10;
const NUMBER_OF_MINES = 15;

const board = createBoard(BORDER_SIZE, NUMBER_OF_MINES);
minesLeftText.textContent = NUMBER_OF_MINES;
boardElement.style.setProperty('--size', BORDER_SIZE);

board.forEach((row) => {
    row.forEach((tile) => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd();
        });

        tile.element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        const filterMarked = row.filter(
            (tile) => tile.status === TILE_STATUSES.MARKED
        );
        return count + filterMarked.length;
    }, 0);
    const minesLeft = NUMBER_OF_MINES - markedTilesCount;
    minesLeftText.textContent = minesLeft;
}

function checkGameEnd() {
    const win = checkWin(board);
    const loose = checkLoose(board);

    if (win || loose) {
        // * Remove Event Listeners
        boardElement.addEventListener(
            'click',
            (event) => {
                event.stopImmediatePropagation();
            },
            { capture: true }
        );
        boardElement.addEventListener(
            'contextmenu',
            (event) => {
                event.stopImmediatePropagation();
            },
            { capture: true }
        );
    }
    if (win) {
        messageText.textContent = 'You Win';
    }
    if (loose) {
        messageText.textContent = 'You Lost';
        board.forEach((row) => {
            row.forEach((tile) => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile);
                }
                if (tile.mine) {
                    revealTile(board, tile);
                }
            });
        });
    }
}
