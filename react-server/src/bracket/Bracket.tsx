import SongCard from "./SongCard";
import "./bracket.css";

interface BracketProps {
    entries: number;
}

export default function Bracket({entries}: BracketProps) {
    if(!Number.isInteger(Math.log2(entries))) {
        return <></>
    }

    let cols = [];
    
    for(let len = entries/2; len >= 1; len /= 2) {
        cols.push(len);
    }

    return (
        <div className="bracket">
            {cols.map(len => <>
                <div className="column">
                    {Array.from(Array(len).keys()).map(() => <>
                        <SongCard title="All I Want for Christmas is You" artist="Mariah Carey"/>
                    </>)}
                </div>
            </>)}
            <div className="column">
                <SongCard final title="All I Want for Christmas is You" artist="Mariah Carey"/>
            </div>
            {cols.reverse().map(len => <>
                <div className="column">
                    {Array.from(Array(len).keys()).map(() => <>
                        <SongCard title="All I Want for Christmas is You" artist="Mariah Carey"/>
                    </>)}
                </div>
            </>)}
        </div>
    );
}