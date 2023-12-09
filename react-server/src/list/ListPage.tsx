import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TournamentSummary from "../model/TournamentSummary";
import { getTournaments } from "../service/TournamentService";
import SpotifyLogo from "../images/spotify_logo.svg";
import "./list.css";
import CountdownTimer from "./CountdownTimer";
import { useTournamentContext } from "../context/TournamentContext";
import { ClipLoader } from "react-spinners";
import { useProfileContext } from "../context/ProfileContext";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";
import { Button } from "react-bootstrap";

export default function ListPage() {
    const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
    const {setTournament} = useTournamentContext();
    const {profile: [profile]} = useProfileContext();
    const [, setLoading] = useLoadingScreenContext();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setTournament(null);
        getTournamentSummaries();
    }, []);

    const getTournamentSummaries = () =>
        getTournaments().then(tournaments => {
            const expiredTournaments: TournamentSummary[] = [];
            const activeTourmaments: TournamentSummary[] = [];
            const futureTournaments: TournamentSummary[] = [];
            tournaments.forEach(t => t.songWinner ? expiredTournaments.push(t) : t.votingEndDate ? activeTourmaments.push(t) : futureTournaments.push(t));
            expiredTournaments.sort((t1, t2) => t2.endDate!.valueOf() - t1.endDate!.valueOf());
            activeTourmaments.sort((t1, t2) => t1.votingEndDate!.valueOf() - t2.votingEndDate!.valueOf());
            futureTournaments.sort((t1, t2) => t2.startDate.valueOf() - t1.startDate.valueOf());
            setTournaments([...activeTourmaments, ...futureTournaments, ...expiredTournaments]);
        }).then(() => setLoading(false));

    const redirect = (id: number) => {
        navigate(`/tournament?id=${id}`);
    };

    return (
        <main className="list-page">
            {tournaments.map(t => (
                <div className="tournament-card" key={t.id}>
                    <div className="tournament-card-content" onClick={() => redirect(t.id)}>
                        <h2>{t.name}</h2>
                        <TournamentCardContent summary={t} refreshSummary={() => getTournamentSummaries()}/>
                    </div>
                    { (t.spotifyPlaylist || t.votingEndDate) && (
                        <div className="button-row">
                            { t.spotifyPlaylist && (
                                <a href={t.spotifyPlaylist} target="_blank">
                                    <img src={SpotifyLogo} alt="Spotify Logo"/>
                                </a>
                            )}
                            { t.votingEndDate && (
                                <div onClick={() => navigate(`/tournament/vote?id=${t.id}`)}>
                                    <Button variant="danger">VOTE</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {profile?.role === "ADMIN" && (
                <div className="tournament-card create-tournament-card" onClick={() => navigate("/tournament/new")}>
                    <p>+</p>
                </div>
            )}
        </main>
    );
}

interface TournamentCardProps {
    summary: TournamentSummary;
    refreshSummary: () => Promise<any>;
}

function TournamentCardContent({summary, refreshSummary}: TournamentCardProps) {
    const [loading, setLoading] = useState(false);
    const date = new Date();

    // Tournament over
    if(summary.songWinner) {
        return <p>Winner: {summary.songWinner.title}</p>
    }

    // Tournament yet to begin
    if(date < summary.startDate) {
        return <p>Tournament begins: {summary.startDate.toLocaleDateString()}</p>
    }

    // Tournament in progress

    // Round end processing
    if(loading) {
        return <ClipLoader/>
    }

    const onComplete = () => {
        setLoading(true);
        setTimeout(() => {
            refreshSummary().then(() => setLoading(false));
        }, 15000);
    };

    if(summary.votingEndDate) {
        return <CountdownTimer endDate={summary.votingEndDate} onComplete={onComplete}/>
    } else {
        return <CountdownTimer endDate={summary.votingStartDate!} onComplete={onComplete} voteDescription="starts"/>
    }
}