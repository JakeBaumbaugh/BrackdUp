import { useEffect } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineAdminPanelSettings, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../context/ProfileContext";
import { useTournamentContext } from "../context/TournamentContext";
import MadnessLogo from "../images/icon.png";
import SpotifyLogo from "../images/spotify_logo.svg";
import { login, logout } from "../service/ProfileService";
import ProfileButton from "./ProfileButton";

export default function Header() {
    const navigate = useNavigate();
    const {tournament} = useTournamentContext();
    const {profile: [profile]} = useProfileContext();

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
                        <Button
                            variant="danger"
                            onClick={() => navigate(`/tournament/vote?id=${tournament.id}`)}
                            disabled={!activeRound.isDateInRange(new Date())}
                        >VOTE</Button>
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
                {profile?.isAdmin() && (
                    <MdOutlineAdminPanelSettings
                        className="clickable darken-hover rotate-hover"
                        onClick={() => navigate('/admin')}
                    />
                )}
                <ProfileButton />
            </div>
        </header>
    );
}
