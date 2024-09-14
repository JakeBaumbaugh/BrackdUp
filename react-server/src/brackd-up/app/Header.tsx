import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLoadingScreenContext } from "../../context/LoadingScreenContext";
import { useProfileContext } from "../../context/ProfileContext";
import BrackdUpLogo from "../../images/logo-512.png";
import LoginCard from "../card/LoginCard";
import ProfileButton from "../../app/ProfileButton";
import "./header.css";

export default function Header() {
    const [loading] = useLoadingScreenContext();
    const {forceLogin: [forceLogin]} = useProfileContext();
    
    const className = loading || forceLogin ? "loading" : "";

    const headerCirclesIndices = useMemo(() => [...Array(4).keys()], []);

    return (
        <header className={className}>
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
            <div className="header-content">
                <Link to="/">
                    <h1>
                        <img src={BrackdUpLogo} alt="BrackdUp"/>
                        <span>Brackd</span>
                        <span>Up</span>
                    </h1>
                </Link>
                <ProfileButton/>
            </div>
            {forceLogin && <LoginCard/>}
        </header>
    );
}