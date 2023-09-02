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
    for(let len = 2; len <= entries/2; len *= 2) {
        cols.push(len);
    }

    return (
        <div className="bracket">
            {cols.map(len => <>
                <div className="column">
                    {Array.from(Array(len).keys()).map(() => <>
                        <div className="card"/>
                    </>)}
                </div>
            </>)}
        </div>
    );
}