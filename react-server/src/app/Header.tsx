import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useTournamentContext } from "../context/TournamentContext";
import SpotifyLogo from "../images/spotify_logo.svg";
import { login } from "../service/UserService";

export default function Header() {
    const navigate = useNavigate();
    const [tournament] = useTournamentContext();

    const onLoginSuccess = (credentialResponse: CredentialResponse) => {
        if(credentialResponse.credential) {
            login(credentialResponse.credential);
            // if login success, save JWT into context
        }
    };

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
                    {tournament.getCurrentRound() && (
                        <button className="vote-button">VOTE</button>
                    )}
                </div>
            </>}
            <div className="profile-wrapper">
                <GoogleLogin
                    onSuccess={onLoginSuccess}
                    onError={() => console.log("Google Login failed.")}
                />
            </div>
        </header>
    );
}