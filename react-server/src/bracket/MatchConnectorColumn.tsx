import { useMemo } from "react";
import { BracketEntry } from "../model/Entry";

interface MatchConnectorColumnProps {
    leftColumn: (BracketEntry|null)[];
    rightColumn: (BracketEntry|null)[];
}

export default function MatchConnectorColumn({leftColumn, rightColumn}: Readonly<MatchConnectorColumnProps>) {
    const left = leftColumn.length;
    const right = rightColumn.length;
    const greater = Math.max(left, right);
    const height = `${100/greater}%`;

    // Pass match ID to match connector for panning to match by ID
    const connectorFn = (id?: string) => (left === right) ? <StraightConnector/> : <MatchConnector ltr={left > right} height={height} id={id}/>
    const idArray = useMemo(() => {
        const srcColumn = leftColumn.length > rightColumn.length ? leftColumn : rightColumn;
        return srcColumn
            .filter((_, index) => index % 2 === 0)
            .map(entry => entry ? `match-connector-${entry.matchId}` : undefined);
    }, [leftColumn, rightColumn]);

    return <div className="column">
        { idArray.map(connectorFn) }
    </div>
}

interface MatchConnectorProps {
    ltr: boolean;
    height: string;
    id?: string;
}

function MatchConnector({ltr, height, id}: Readonly<MatchConnectorProps>) {
    return <div className="match-connector" style={{height: height}} id={id}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1={ltr ? "0" : "100"} y1="0" x2="50" y2="0" vectorEffect="non-scaling-stroke"/>
            <line x1={ltr ? "0" : "100"} y1="100" x2="50" y2="100" vectorEffect="non-scaling-stroke"/>
            <line x1={ltr ? "100" : "0"} y1="50" x2="50" y2="50" vectorEffect="non-scaling-stroke"/>
            <line x1="50" y1="0" x2="50" y2="100" vectorEffect="non-scaling-stroke"/>
        </svg>
    </div>
}

function StraightConnector() {
    return <div className="match-connector">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" vectorEffect="non-scaling-stroke"/>
        </svg>
    </div>
}