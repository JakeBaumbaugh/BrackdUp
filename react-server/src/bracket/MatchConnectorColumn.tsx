interface MatchConnectorColumnProps {
    left: number;
    right: number;
}

export default function MatchConnectorColun({left, right}: MatchConnectorColumnProps) {
    const greater = Math.max(left, right);
    const lesser = Math.min(left, right);
    const height = `${100/greater}%`;

    const connector = left === right ? <StraightConnector/> : <MatchConnector ltr={left > right} height={height}/>

    return <div className="column">
        { Array(lesser).fill(connector) }
    </div>
}

interface MatchConnectorProps {
    ltr: boolean;
    height: string;
}

function MatchConnector({ltr, height}: MatchConnectorProps) {
    return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="match-connector" style={{height: height}}>
        <line x1={ltr ? "0" : "100"} y1="0" x2="50" y2="0" vectorEffect="non-scaling-stroke"/>
        <line x1={ltr ? "0" : "100"} y1="100" x2="50" y2="100" vectorEffect="non-scaling-stroke"/>
        <line x1={ltr ? "100" : "0"} y1="50" x2="50" y2="50" vectorEffect="non-scaling-stroke"/>
        <line x1="50" y1="0" x2="50" y2="100" vectorEffect="non-scaling-stroke"/>
    </svg>
}

function StraightConnector() {
    return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="match-connector">
        <line x1="0" y1="50" x2="100" y2="50" vectorEffect="non-scaling-stroke"/>
    </svg>
}