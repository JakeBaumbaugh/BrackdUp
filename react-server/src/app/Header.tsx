import { Tooltip } from "@mui/material";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../context/ProfileContext";
import { useTournamentContext } from "../context/TournamentContext";
import MadnessLogo from "../images/icon.png";
import SpotifyLogo from "../images/spotify_logo.svg";
import { login, logout } from "../service/ProfileService";

export default function Header() {
    const navigate = useNavigate();
    const [tournament] = useTournamentContext();
    const {profile: [profile, setProfile], forceLogin: [forceLogin]} = useProfileContext();

    const onLogin = (codeResponse: CodeResponse) => {
        console.log(codeResponse);
        login(codeResponse.code)
            .then(profile => setProfile(profile))
            .catch(() => setProfile(null));
    };

    const onLogout = () => {
        logout()
            .then(() => setProfile(null))
            .catch(() => console.log("Failed to log out."));
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: onLogin
    });

    // Force login popup without user interact
    useEffect(() => {
        if(forceLogin && !profile) {
            googleLogin();
        }
    }, [profile, forceLogin]);

    const activeRound = tournament?.getActiveRound();

    return (
        <header className={tournament ? "with-tournament" : ""}>
            <h1 className="clickable darken-hover" onClick={() => navigate("/")}>
                <img src={MadnessLogo} alt="Music Madness" className="rotate-hover"/>
                Music Madness
            </h1>
            {tournament && (
                <div className="tournament-info">
                    <h2 className="clickable darken-hover" onClick={() => navigate(`/tournament?id=${tournament.id}`)}>
                        {tournament.name}
                    </h2>
                    {tournament.spotifyPlaylist && (
                        <a href={tournament.spotifyPlaylist} target="_blank">
                            <img src={SpotifyLogo} alt="Spotify Button" className="clickable darken-hover rotate-hover"/>
                        </a>
                    )}
                    {activeRound && (
                        <button 
                            className="red-button darken-hover"
                            onClick={() => navigate(`/tournament/vote?id=${tournament.id}`)}
                            disabled={!activeRound.isDateInRange(new Date())}
                        >VOTE</button>
                    )}
                    {profile?.canEditTournament(tournament) && (
                        <MdSettings
                            className="clickable darken-hover rotate-hover"
                            onClick={() => navigate(`tournament/settings?id=${tournament.id}`)}
                        />
                    )}
                </div>
            )}
            <div className="profile-wrapper">
                { profile ? (
                    <Tooltip title="Logout" placement="left" arrow>
                        <img
                            src={profile.pictureLink}
                            className="clickable darken-hover rotate-hover"
                            onClick={onLogout}
                        />
                    </Tooltip>
                ) : (
                    <div
                        className="login-button clickable darken-hover rotate-hover"
                        onClick={() => googleLogin()}
                    >
                        <FcGoogle/>
                    </div>
                )}
            </div>
        </header>
    );
}