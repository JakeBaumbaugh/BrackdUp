import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../context/ProfileContext";
import { useTournamentContext } from "../context/TournamentContext";
import MadnessLogo from "../images/icon.png";
import SpotifyLogo from "../images/spotify_logo.svg";
import { login } from "../service/ProfileService";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";

export default function Header() {
    const navigate = useNavigate();
    const [tournament] = useTournamentContext();
    const {profile: [profile, setProfile], useOneTap: [useOneTap]} = useProfileContext();

    const onLoginSuccess = (credentialResponse: CredentialResponse) => {
        if(credentialResponse.credential) {
            login(credentialResponse.credential)
                .then(profile => setProfile(profile))
                .catch(() => setProfile(null));
        }
    };

    const activeRound = tournament?.getActiveRound();

    return (
        <header className={tournament ? "with-tournament" : ""}>
            <h1 onClick={() => navigate("/")}>
                <img src={MadnessLogo} alt="Music Madness"/>    
                Music Madness
            </h1>
            {tournament && (
                <div className="tournament-info">
                    <h2 onClick={() => navigate(`/tournament?id=${tournament.id}`)}>{tournament.name}</h2>
                    {tournament.spotifyPlaylist && (
                        <a href={tournament.spotifyPlaylist} target="_blank">
                            <img src={SpotifyLogo} alt="Spotify Button"/>
                        </a>
                    )}
                    {activeRound && (
                        <button 
                            className="red-button"
                            onClick={() => navigate(`/tournament/vote?id=${tournament.id}`)}
                            disabled={!activeRound.isDateInRange(new Date())}
                        >VOTE</button>
                    )}
                    {profile?.canEditTournament(tournament) && (
                        <MdSettings onClick={() => navigate(`tournament/settings?id=${tournament.id}`)}/>
                    )}
                </div>
            )}
            { !profile && (
                <div className="profile-wrapper">
                    <GoogleLogin
                        onSuccess={onLoginSuccess}
                        onError={() => console.log("Google Login failed.")}
                        type="icon"
                        shape="circle"
                        useOneTap={useOneTap}
                        cancel_on_tap_outside={false}
                    />
                </div>
            )}
        </header>
    );
}