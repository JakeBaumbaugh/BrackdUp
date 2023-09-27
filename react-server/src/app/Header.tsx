import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useTournamentContext } from "../context/TournamentContext";
import SpotifyLogo from "../images/spotify_logo.svg";

export default function Header() {
    const navigate = useNavigate();
    const [tournament] = useTournamentContext();

    return (
        <header>
            <h1 onClick={() => navigate("/")}>Music Madness</h1>
            {tournament && <>
                <div className="tournament-info">
                    <h2>{tournament.name}</h2>
                    {tournament.spotifyPlaylist && (
                        <a href={tournament.spotifyPlaylist} target="_blank">
                            <img src={SpotifyLogo} alt="Spotify Logo"/>
                        </a>
                    )}
                    <button className="vote-button">VOTE</button>
                </div>
            </>}
            <div className="profile-wrapper">
                <CgProfile/>
            </div>
        </header>
    );
}