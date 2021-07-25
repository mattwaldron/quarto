import { QSquare } from './qsquare.js';

export class QBoard {
    constructor() {
        this.squares = new Array(4);
        for (var r = 0; r < 4; r++) {
            this.squares[r] = new Array(4);
            for (var c = 0; c < 4; c++) {
                this.squares[r][c] = new QSquare(c, r);
            }
        }
    }

    checkForWin() {
        return false;
    }

    checkGameOver() {
        if (checkForWin()) {
            return true;
        }
        else {
            for (var r = 0; r < 3; r++) {
                this.squares[r] = new Array(4);
                for (var c; c < 3; c++) {
                    if (!this.squares[r][c].occupied) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}