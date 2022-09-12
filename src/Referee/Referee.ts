import {Color, Piece, PieceType} from "../Components/Chessboard/Chessboard";
import {validSquare} from "../Components/Tile/Tile";

export default class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
         return !!boardState.find(p => p.x === x && p.y === y);

    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], color: Color): boolean {
        return !!boardState.find(p => p.x === x && p.y === y && p.color !== color);
    }

    tileIsEmptyOrOpponentPiece(x: number, y: number, boardState: Piece[], color: Color): boolean {
        const targetPiece = boardState.find(p => p.x === x && p.y === y);
        return !targetPiece || targetPiece.color !== color;
    }

    isValidMove(px: number,
                py: number,
                x: number,
                y: number,
                type: PieceType,
                color: Color,
                boardState: Piece[]
    ) {

        //pawn logic
        if (type === PieceType.PAWN) {
            const validNonAttack =
                ((color === Color.GREEN && (py === 1 && x === px && (y === py + 1 || y === py + 2 &&
                            !this.tileIsOccupied(x, y - 1, boardState) ) || x === px && (y === py + 1)))
                    &&  !this.tileIsOccupied(x, y, boardState))
                || ((color === Color.GOLD && (px === 1 && y === py && (x === px + 1 || x === px + 2 &&
                            !this.tileIsOccupied(x - 1, y, boardState) ) || y === py && (x === px + 1)))
                    &&  !this.tileIsOccupied(x, y, boardState))
                || ((color === Color.RED && (py === 12 && x === px && (y === py - 1 || y === py - 2 &&
                            !this.tileIsOccupied(x, y - 1, boardState) ) || x === px && (y === py - 1)))
                    &&  !this.tileIsOccupied(x, y, boardState))
                || ((color === Color.PURPLE && (px === 12 && y === py && (x === px - 1 || x === px - 2 &&
                            !this.tileIsOccupied(x - 1, y, boardState) ) || y === py && (x === px - 1)))
                    &&  !this.tileIsOccupied(x, y, boardState));

            let validAttack = this.tileIsOccupiedByOpponent(x, y, boardState, color);
            switch (color) {
                case Color.GREEN:
                    validAttack &&= y - py === 1 && Math.abs(x - px) === 1;
                    break;
                case Color.GOLD:
                    validAttack &&= x - px === 1 && Math.abs(y - py) === 1;
                    break;
                case Color.RED:
                    validAttack &&= py - y === 1 && Math.abs(x - px) === 1;
                    break;
                default:
                    validAttack &&= px - x === 1 && Math.abs(y - py) === 1;
                    break;
            }
            return validNonAttack || validAttack;
        }

        //rook logic
        else if (type === PieceType.ROOK) {
            if (!this.tileIsEmptyOrOpponentPiece(x, y, boardState, color)) return false;
            //ensure no jump occurred
            if (x < px && y === py) {
                for (let i = x + 1; i < px; i++)
                    if (this.tileIsOccupied(i, y, boardState)) return false;
                return true;
            } else if (x > px && y === py) {
                for (let i = px + 1; i < x; i++)
                    if (this.tileIsOccupied(i, y, boardState)) return false;
                return true;
            } else if (y < py && x === px) {
                for (let i = y + 1; i < py; i++)
                    if (this.tileIsOccupied(x, i, boardState)) return false;
                return true;
            } else if (y > py && x === px) {
                for (let i = py + 1; i < y; i++)
                    if (this.tileIsOccupied(x, i, boardState)) return false;
                return true;
            }
            return false;
        }

        //bishop logic
        else if (type === PieceType.BISHOP) {
            if ((x !== px || y !== py) && Math.abs(y - py) === Math.abs(x - px)) {
                const xDelta = (x - px) / Math.abs(x - px);
                const yDelta = (y - py) / Math.abs(y - py);
                for (let i = 1; i < Math.abs(x - px); i++)
                    if (this.tileIsOccupied(px + i * xDelta, py + i * yDelta, boardState)
                        || !validSquare(px + i * xDelta, py + i * yDelta)) {
                        return false;
                    }
                return this.tileIsEmptyOrOpponentPiece(x, y, boardState, color);
            }
        }

        //knight logic
        else if (type === PieceType.KNIGHT) {
            if (!this.tileIsEmptyOrOpponentPiece(x, y, boardState, color)) return false;
            return (Math.abs(x - px) === 1 && Math.abs(y - py) === 2)
                || (Math.abs(x - px) === 2 && Math.abs(y - py) === 1);
        }

        //queen logic
        else if (type === PieceType.QUEEN) {
            if (!this.tileIsEmptyOrOpponentPiece(x, y, boardState, color)) return false;
            if (x < px && y === py) {
                for (let i = x + 1; i < px; i++)
                    if (this.tileIsOccupied(i, y, boardState)) return false;
                return true;
            } else if (x > px && y === py) {
                for (let i = px + 1; i < x; i++)
                    if (this.tileIsOccupied(i, y, boardState)) return false;
                return true;
            } else if (y < py && x === px) {
                for (let i = y + 1; i < py; i++)
                    if (this.tileIsOccupied(x, i, boardState)) return false;
                return true;
            } else if (y > py && x === px) {
                for (let i = py + 1; i < y; i++)
                    if (this.tileIsOccupied(x, i, boardState)) return false;
                return true;
            } else if ((x !== px || y !== py) && Math.abs(y - py) === Math.abs(x - px)) {
                const xDelta = (x - px) / Math.abs(x - px);
                const yDelta = (y - py) / Math.abs(y - py);
                for (let i = 1; i < Math.abs(x - px); i++)
                    if (this.tileIsOccupied(px + i * xDelta, py + i * yDelta, boardState)
                        || !validSquare(px + i * xDelta, py + i * yDelta)) return false;
                return true;
            }
            return false;
        }

        else if (type === PieceType.KING) {
            if (!this.tileIsEmptyOrOpponentPiece(x, y, boardState, color)) return false;
            return Math.abs(x - px) <= 1 && Math.abs(y - py) <= 1
                    && (px !== x || py !== y);
        }

        return false;
    }
}