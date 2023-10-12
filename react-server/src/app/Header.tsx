import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useTournamentContext } from "../context/TournamentContext";
import SpotifyLogo from "../images/spotify_logo.svg";
import { login } from "../service/UserService";
import { useProfileContext } from "../context/ProfileContext";

export default function Header() {
    const navigate = useNavigate();
    const [tournament] = useTournamentContext();
    const [profile, setProfile] = useProfileContext();

    const onLoginSuccess = (credentialResponse: CredentialResponse) => {
        if(credentialResponse.credential) {
            login(credentialResponse.credential)
                .then(profile => {
                    profile.jwt = credentialResponse.credential;
                    setProfile(profile);
                });
        }
    };

    return (
        <header className={tournament ? "with-tournament" : ""}>
            <h1 onClick={() => navigate("/")}>Music Madness</h1>
            {tournament && <>
                <div className="tournament-info">
                    <h2 onClick={() => navigate(`/tournament?id=${tournament.id}`)}>{tournament.name}</h2>
                    {tournament.spotifyPlaylist && (
                        <a href={tournament.spotifyPlaylist} target="_blank">
                            <img src={SpotifyLogo} alt="Spotify Logo"/>
                        </a>
                    )}
                    {tournament.getCurrentRound() && (
                        <button className="vote-button" onClick={() => navigate(`/tournament/vote?id=${tournament.id}`)}>VOTE</button>
                    )}
                </div>
            </>}
            { !profile && (
                <div className="profile-wrapper">
                    <GoogleLogin
                        onSuccess={onLoginSuccess}
                        onError={() => console.log("Google Login failed.")}
                        type="icon"
                        shape="circle"
                    />
                </div>
            )}
        </header>
    );
}