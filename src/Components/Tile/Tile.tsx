import './Tile.css';

const validSquare = (xAxis: number, yAxis: number): boolean => {
    return (xAxis >= 3 && xAxis <= 10) || (yAxis >= 3 && yAxis <= 10);
}

interface Props {
    image?: string;
    xAxis: number;
    yAxis: number;
}

export default function Tile({ image, xAxis, yAxis }: Props) {
    if (validSquare(xAxis, yAxis))
        return (xAxis + yAxis) % 2 === 0 ?
            <div className="tile black-tile">
                {image && <div className={"chess-piece"} style={{backgroundImage: `url(${image})`}}></div>}
            </div>
            : <div className="tile white-tile">
                {image && <div className={"chess-piece"} style={{backgroundImage: `url(${image})`}}></div>}
            </div>;
    else
        return <div className="tile out-of-bounds"></div>;
}