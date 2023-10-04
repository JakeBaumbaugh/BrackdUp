import { useSearchParams } from "react-router-dom";
import { useTournamentContext } from "../context/TournamentContext";
import "./vote.css";
import { useEffect, useMemo } from "react";
import { getTournament } from "../service/TournamentService";
import SongCard from "../bracket/SongCard";

export default function VotePage() {
    const [searchParams] = useSearchParams();
    const [tournament, setTournament] = useTournamentContext();
    
    const matches = useMemo(() => {
        const round = tournament?.getCurrentRound();
        return round?.matches || [];
    }, [tournament]);
    
    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(tournament?.id !== id) {
            getTournament(id).then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            }).catch(() => setTournament(null));
        }
    }, [searchParams.get("id")]);

    return (
        <main className="vote-page">
            <div className="match-container">
                { matches.map(match => (
                    <div key={match.id} className="match">
                        <SongCard song={match.song1} />
                        <hr/>
                        <p>VS</p>
                        <hr/>
                        <SongCard song={match.song2} />
                    </div>
                ))}
                {/* { matches.map(match => (
                    <div key={match.id} className="match">
                        <SongCard song={match.song1} />
                        <hr/>
                        <p>VS</p>
                        <hr/>
                        <SongCard song={match.song2} />
                    </div>
                ))} */}
            </div>
        </main>
    );
}