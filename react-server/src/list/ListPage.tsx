import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TournamentSummary from "../model/TournamentSummary";
import { getTournaments } from "../service/TournamentService";
import "./list.css";

export default function ListPage() {
    const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
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
                <div className="tournament-card" key={t.id} onClick={() => redirect(t.id)}>
                    <h2>{t.name}</h2>
                    { t.songWinner ? (
                        // Expired tournament
                        <p>Winner: {t.songWinner.title}</p>
                    ) :  t.votingEndDate ? (
                        // Active tournament
                        <p>Voting ends: {t.votingEndDate?.toLocaleDateString()}</p>
                    ) : (
                        <p>Tournament begins: {t.startDate.toLocaleDateString()}</p>
                    )}
                </div>
            ))}
        </main>
    );
}