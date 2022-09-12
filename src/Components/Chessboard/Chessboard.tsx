import './Chessboard.css';
import Tile from "../Tile/Tile";
import {useRef, useState} from "react";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
const horizontalAxis = verticalAxis.slice(0, verticalAxis.length);

interface Piece {
    image: string;
    x: number;
    y: number;
}

//********************************* SETTING UP INITIAL STATE *********************************//
const START = 3;
const initialisePieces: Piece[] = [];
const numberToPiece = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"];
for (let i = 0; i < 2; i++) {
    const position = i === 0 ? 0 : 13;
    const pawnPosition = i === 0 ? 1 : 12;

    const colorVertical = i === 0 ? "Green" : "Red";
    for (let j = START; j < numberToPiece.length + START; j++) {
        initialisePieces.push({ image: `./assets/images/pieces/${colorVertical}${numberToPiece[j - START]}.png`, x: j, y: position });
        initialisePieces.push({ image: `./assets/images/pieces/${colorVertical}Pawn.png`, x: j, y: pawnPosition });
    }

    const colorHorizontal = i === 0 ? "Gold" : "Purple";
    for (let j = START; j < numberToPiece.length + START; j++) {
        initialisePieces.push({ image: `./assets/images/pieces/${colorHorizontal}${numberToPiece[j - START]}.png`, x: position, y: j });
        initialisePieces.push({ image: `./assets/images/pieces/${colorHorizontal}Pawn.png`, x: pawnPosition, y: j });
    }
}

//fix Gold and Red King + Queen
const initialBoardState: Piece[] = initialisePieces.map(p => {
    const colorsToFix = ["Gold", "Red"];
    for (let i = 0; i < colorsToFix.length; i++) {
        if (p.image === `./assets/images/pieces/${colorsToFix[i]}King.png`)
            return { image: `./assets/images/pieces/${colorsToFix[i]}Queen.png`, x: p.x, y: p.y };
        else if (p.image === `./assets/images/pieces/${colorsToFix[i]}Queen.png`)
            return { image: `./assets/images/pieces/${colorsToFix[i]}King.png`, x: p.x, y: p.y };
    }
    return p;
});

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
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
            element.style.backgroundSize = "auto calc(100vh / 14)"

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
            setPieces(value => {
                const pieces = value.map(p => {
                    if (p.x === gridX && p.y === gridY) {
                        p.x = x;
                        p.y = y;
                    }
                    return p;
                });
                return pieces;
            });
            activePiece.style.backgroundSize = "auto calc(80vh / 14)";
            setActivePiece(null);
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