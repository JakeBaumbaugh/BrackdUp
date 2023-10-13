import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TournamentSummary from "../model/TournamentSummary";
import { getTournaments } from "../service/TournamentService";
import SpotifyLogo from "../images/spotify_logo.svg";
import "./list.css";
import CountdownTimer from "./CountdownTimer";
import { useTournamentContext } from "../context/TournamentContext";

export default function ListPage() {
    const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
    const [_, setTournament] = useTournamentContext();
    const navigate = useNavigate();

    useEffect(() => {
        setTournament(null);
        getTournaments().then(tournaments => {
            const expiredTournaments: TournamentSummary[] = [];
            const activeTourmaments: TournamentSummary[] = [];
            const futureTournaments: TournamentSummary[] = [];
            tournaments.forEach(t => t.songWinner ? expiredTournaments.push(t) : t.votingEndDate ? activeTourmaments.push(t) : futureTournaments.push(t));
            expiredTournaments.sort((t1, t2) => t2.startDate.valueOf() - t1.startDate.valueOf());
            activeTourmaments.sort((t1, t2) => t2.votingEndDate!.valueOf() - t1.votingEndDate!.valueOf());
            futureTournaments.sort((t1, t2) => t2.startDate.valueOf() - t1.startDate.valueOf());
            setTournaments([...activeTourmaments, ...futureTournaments, ...expiredTournaments]);
        });
    }, []);

    const redirect = (id: number) => {
        navigate(`/tournament?id=${id}`);
    };

    return (
        <main className="list-page">
            {tournaments.map(t => (
                <div className="tournament-card" key={t.id}>
                    <div className="tournament-card-content" onClick={() => redirect(t.id)}>
                        <h2>{t.name}</h2>
                        { t.songWinner ? (
                            // Expired tournament
                            <p>Winner: {t.songWinner.title}</p>
                        ) :  t.votingEndDate ? (
                            // Active tournament
                            <CountdownTimer endDate={t.votingEndDate}/>
                        ) : (
                            <p>Tournament begins: {t.startDate.toLocaleDateString()}</p>
                        )}
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
                                    <button className="red-button">VOTE</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </main>
    );
}