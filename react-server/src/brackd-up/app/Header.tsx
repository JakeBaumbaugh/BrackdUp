import { useMemo } from "react";
import { useLoadingScreenContext } from "../../context/LoadingScreenContext";

export default function Header() {
    const [loading, setLoading] = useLoadingScreenContext();
    
    const className = loading ? "loading" : "";

    const headerCirclesIndices = useMemo(() => [...Array(4).keys()], []);

    return (
        <header className={className} onClick={() => setLoading(!loading)}>
            <div className="header-bkg">
                <div className="header-bkg-left"/>
                <div className="header-bkg-right"/>
                <div className="header-bkg-circles">
                    {headerCirclesIndices.map(index => (
                        <div style={{animationDelay: `-${index*5}s`}} key={index}/>
                    ))}
                </div>
            </div>
            <div className="header-highlight"/>
        </header>
    );
}