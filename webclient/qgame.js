import {QInteractive} from './qinteractive.js';
import {QPiece, QColor, QDensity, QHeight, QShape} from './qpiece.js';
import {QBoard} from './qboard.js';
import {QSquare} from './qsquare.js';

const GameState = { SELECT_PIECE: 0, SELECT_SQUARE: 1, GAME_OVER: 2 }

export class QGame {

    constructor(squareSize = 5)  {
        this.squareSize = squareSize;
        this.onClickDelegate = this.processClick;

        this.state = GameState.SELECT_PIECE;

        this.pieces = [];
        this.board = null;
        
        this.initBoard();
        this.initPieces();

        this.selectedPiece = null;
    }

    reset() {
        this.pieces.forEach(p => p.remove());
        this.pieces = [];

        this.board.remove();
        this.board = null;

        this.initBoard();
        this.initPieces();

        this.selectedPiece = null;
        this.state = GameState.SELECT_PIECE;
    }

    processClick(qi) {
        if (this.state == GameState.SELECT_PIECE) {
            if (qi.type == "piece") {
                if (qi.played == false) {
                    this.selectedPiece = qi;
                    this.state = GameState.SELECT_SQUARE;
                }
            }
        }
        else if (this.state == GameState.SELECT_SQUARE) {
            if (qi.type == "square") {
                if (qi.occupant == null) {
                    qi.occupant = this.selectedPiece;
                    this.selectedPiece.played = true;
                    this.selectedPiece.setPosition(qi.getModelX(), qi.getModelY());
                    this.selectedPiece = null;
                    if (this.board.checkGameOver()) {
                        this.state = GameState.GAME_OVER;
                    }
                    else {
                        this.state = GameState.SELECT_PIECE;
                    }
                }
            }
            else if (qi.type == "piece") {
                if (this.selectedPiece.id == qi.id) {
                    this.selectedPiece = null;
                    this.state = GameState.SELECT_PIECE;
                }
            }
        }
    }

    initPieces() {
        QPiece.clickCallback = (qi) => this.onClickDelegate(qi);
        var pRadius = this.squareSize * 3.5;
        var pCount = 0;
        var pStep = 5;
        for (var h in QHeight) {
            for (var s in QShape) {
                for (var d in QDensity) {
                    for (var c in QColor) {
                        var x = pRadius*Math.cos(2*Math.PI*pCount*pStep/16);
                        var y = pRadius*Math.sin(2*Math.PI*pCount*pStep/16);
                        var qp = new QPiece(QHeight[h], QShape[s], QDensity[d], QColor[c], x, y);
                        this.pieces.push(qp);
                        pCount += 1;
                    }
                }
            }
        }
    }

    initBoard() {
        QSquare.clickCallback = (qi) => this.onClickDelegate(qi);
        this.board = new QBoard(this.squareSize);
    }
}
