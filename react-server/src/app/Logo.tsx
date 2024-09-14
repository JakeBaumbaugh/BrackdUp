export default function LogoSvg() {
    const strokeWidth = 48;
    const circleEdgeDist = 78;
    const circleRadius = 48;

    return <svg stroke="currentColor" fill="none" strokeWidth={strokeWidth} viewBox="0 0 512 512">
        {/* Left Circle */}
        <ellipse cx={circleEdgeDist} cy="256" rx={circleRadius} ry={circleRadius}/>
        {/* Top Circle */}
        <ellipse cx={512-circleEdgeDist} cy={circleEdgeDist} rx={circleRadius} ry={circleRadius}/>
        {/* Bottom Circle */}
        <ellipse cx={512-circleEdgeDist} cy={512-circleEdgeDist} rx={circleRadius} ry={circleRadius}/>
        {/* Vertical Line */}
        <line x1="256" y1={circleEdgeDist} x2="256" y2={512-circleEdgeDist} strokeLinecap="square"/>
        {/* Left Horizontal Line */}
        <line x1={circleEdgeDist+circleRadius} y1="256" x2="256" y2="256"/>
        {/* Top Horizontal Line */}
        <line x1="256" y1={circleEdgeDist} x2={512-circleEdgeDist-circleRadius} y2={circleEdgeDist}/>
        {/* Bottom Horizontal Line */}
        <line x1="256" y1={512-circleEdgeDist} x2={512-circleEdgeDist-circleRadius} y2={512-circleEdgeDist}/>
    </svg>
}