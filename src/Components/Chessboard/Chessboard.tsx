import './Chessboard.css';
import Referee from  '../../Referee/Referee';
import Tile, {validSquare} from "../Tile/Tile";
import {useRef, useState} from "react";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
const horizontalAxis = verticalAxis.slice(0, verticalAxis.length);

export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType,
    color: Color
}

export enum PieceType {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING
}

export enum Color {
    GREEN,
    GOLD,
    RED,
    PURPLE
}

//********************************* SETTING UP INITIAL STATE *********************************//
const START = 3;
const initialisePieces: Piece[] = [];
const numberToPiece = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"];

const stringToPieceType: { [pieceName: string]: PieceType } = {};
stringToPieceType["Pawn"] = PieceType.PAWN;
stringToPieceType["Knight"] = PieceType.KNIGHT;
stringToPieceType["Bishop"] = PieceType.BISHOP;
stringToPieceType["Rook"] = PieceType.ROOK;
stringToPieceType["Queen"] = PieceType.QUEEN;
stringToPieceType["King"] = PieceType.KING;

const stringToColor: { [color: string]: Color } = {};
stringToColor["Green"] = Color.GREEN;
stringToColor["Red"] = Color.RED;
stringToColor["Gold"] = Color.GOLD;
stringToColor["Purple"] = Color.PURPLE;

for (let i = 0; i < 2; i++) {
    const position = i === 0 ? 0 : 13;
    const pawnPosition = i === 0 ? 1 : 12;

    const colorVertical = i === 0 ? "Green" : "Red";
    for (let j = START; j < numberToPiece.length + START; j++) {
        initialisePieces.push({ image: `./assets/images/pieces/${colorVertical}${numberToPiece[j - START]}.png`,
            x: j,
            y: position,
            type: stringToPieceType[numberToPiece[j - START]],
            color: stringToColor[colorVertical]
        });
        initialisePieces.push({ image: `./assets/images/pieces/${colorVertical}Pawn.png`,
            x: j,
            y: pawnPosition,
            type: PieceType.PAWN,
            color: stringToColor[colorVertical]
        });
    }

    const colorHorizontal = i === 0 ? "Gold" : "Purple";
    for (let j = START; j < numberToPiece.length + START; j++) {
        initialisePieces.push({ image: `./assets/images/pieces/${colorHorizontal}${numberToPiece[j - START]}.png`,
            x: position,
            y: j,
            type: stringToPieceType[numberToPiece[j - START]],
            color: stringToColor[colorHorizontal]
        });
        initialisePieces.push({ image: `./assets/images/pieces/${colorHorizontal}Pawn.png`,
            x: pawnPosition,
            y: j,
            type: PieceType.PAWN,
            color: stringToColor[colorHorizontal]
        });
    }
}

//fix Gold and Red King + Queen
const initialBoardState: Piece[] = initialisePieces.map(p => {
    const colorsToFix = ["Gold", "Red"];
    for (let i = 0; i < colorsToFix.length; i++) {
        if (p.image === `./assets/images/pieces/${colorsToFix[i]}King.png`)
            return { image: `./assets/images/pieces/${colorsToFix[i]}Queen.png`,
                x: p.x,
                y: p.y,
                type: PieceType.QUEEN,
                color: stringToColor[colorsToFix[i]]
        };
        else if (p.image === `./assets/images/pieces/${colorsToFix[i]}Queen.png`)
            return { image: `./assets/images/pieces/${colorsToFix[i]}King.png`,
                x: p.x,
                y: p.y,
                type: PieceType.KING,
                color: stringToColor[colorsToFix[i]]
        };
    }
    return p;
});

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLDivElement;
        const chessboard = chessboardRef.current;

        if (element.classList.contains("chess-piece") && chessboard) {
            const tileWidth = chessboard.offsetWidth / 14;
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / tileWidth));
            setGridY(Math.abs(Math.floor((e.clientY - chessboard.offsetTop) / tileWidth) - 13));
            const x = e.clientX - element.clientHeight / 2;
            const y = e.clientY - element.clientHeight / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.backgroundSize = "auto min(calc(80vh / 14), calc(80vw / 14))"
            element.style.zIndex = "1";

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - activePiece.clientHeight;
            const minY = chessboard.offsetTop - activePiece.clientHeight;
            const maxX = chessboard.offsetLeft + chessboard.offsetWidth;
            const maxY = chessboard.offsetTop + chessboard.offsetHeight;
            const x = e.clientX - activePiece.clientHeight / 2;
            const y = e.clientY - activePiece.clientHeight / 2;
            activePiece.style.position = "absolute";

            activePiece.style.left = x < minX || x > maxX ? (x < minX ? `${minX}px` : `${maxX}px`) :`${x}px`;
            activePiece.style.top = y < minY || y > maxY ? (y < minY ? `${minY}px` : `${maxY}px`) : `${y}px`;
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const tileWidth = chessboard.offsetWidth / 14;
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / tileWidth);
            const y = Math.abs(Math.floor((e.clientY - chessboard.offsetTop) / tileWidth) - 13);
            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
            const attackedPiece = pieces.find(p => p.x === x && p.y === y);

            if (currentPiece) {
                const validMove = referee
                        .isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.color, pieces) &&
                    validSquare(x, y);

                if (validMove) {
                    const newState = pieces.reduce((results, piece) => {
                        if (piece.x === gridX && piece.y === gridY) {
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        } else if (attackedPiece && (piece.x !== x || piece.y != y)) {
                            results.push(piece);
                        } else if (!attackedPiece) {
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[] );

                    setPieces(newState);
                } else {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
                activePiece.style.backgroundSize = "auto min(calc(80vh / 14), calc(80vw / 14))";
                activePiece.style.zIndex = "0";
                setActivePiece(null);
            }
        }
    }

    let board = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
            for (let i = 0; i < horizontalAxis.length; i++) {
                let image = undefined;

                pieces.forEach(p => {
                   if (p.x === i && p.y === j)
                       image = p.image;
                });

                board.push(<Tile key={`${i},${j}`} image={image} xAxis={i} yAxis={j} />);
        }
    }

    return (
        <div
        onMouseMove={e => movePiece(e)}
        onMouseDown={e => grabPiece(e)}
        onMouseUp={e => dropPiece(e)}
        id={"chessboard"}
        ref={chessboardRef}
        >
            {board}
        </div>
    );
}