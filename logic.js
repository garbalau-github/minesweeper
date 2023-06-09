export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
};

export function createBoard(boardSize, numberOfMines) {
    const board = [];

    const minePositions = getMinePositions(boardSize, numberOfMines);

    for (let x = 0; x < boardSize; x++) {
        const row = [];
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some((somePosition) =>
                    positionMatch(somePosition, { x, y })
                ),
                // * Getters and Setters
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            };
            row.push(tile);
        }
        board.push(row);
    }

    return board;
}

export function markTile(tile) {
    if (
        tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status !== TILE_STATUSES.MARKED
    ) {
        return;
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else {
        tile.status = TILE_STATUSES.MARKED;
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nerbyTiles(board, tile);
    const mines = adjacentTiles.filter((tile) => tile.mine);
    if (mines.length === 0) {
        // * Recursive Call (to reveal all adjacent tiles)
        adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
        tile.element.textContent = mines.length;
    }
}

export function checkWin(board) {
    // * Check if all tiles that are not mines are revealed
    return board.every((row) => {
        return row.every((tile) => {
            return (
                tile.status === TILE_STATUSES.NUMBER ||
                (tile.mine &&
                    (tile.status === TILE_STATUSES.HIDDEN ||
                        tile.status === TILE_STATUSES.MARKED))
            );
        });
    });
}

export function checkLoose(board) {
    // * Check if any tile has status MINE
    return board.some((row) => {
        return row.some((tile) => {
            return tile.status === TILE_STATUSES.MINE;
        });
    });
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = [];

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        };

        if (!positions.some((pos) => positionMatch(pos, position))) {
            positions.push(position);
        }
    }

    return positions;
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y;
}

function randomNumber(boardSize) {
    return Math.floor(Math.random() * boardSize);
}

function nerbyTiles(board, tile) {
    const tiles = [];
    const { x, y } = tile;

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const nerbyTile = board[x + xOffset]?.[y + yOffset];
            if (nerbyTile) {
                tiles.push(nerbyTile);
            }
        }
    }

    return tiles;
}
