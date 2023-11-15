import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Bracket from "./Bracket";
import "./bracket.css";
import { getTournament } from "../service/TournamentService";
import { useTournamentContext } from "../context/TournamentContext";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";

export default function BracketPage() {
    const [searchParams] = useSearchParams();
    const [tournament, setTournament] = useTournamentContext();
    const [, setLoading] = useLoadingScreenContext();
    
    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(tournament?.id !== id) {
            setLoading(true);
            getTournament(id).then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            }).catch(() =>
                setTournament(null)
            ).then(() =>
                setLoading(false)
            );
        }
    }, [searchParams.get("id")]);

    return tournament ? (
        <main className="bracket-page">
            <Bracket tournament={tournament}/>
        </main>
    ) :  tournament === null ? (
        <h2>Tournament not found.</h2>
    ) : ( // tournament == undefined
        <h2>Loading...</h2>
    );
}