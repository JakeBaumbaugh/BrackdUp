import { useSearchParams } from "react-router-dom";
import Bracket from "../bracket/Bracket";
import { useEffect, useState } from "react";

export default function BracketPage() {
    const [searchParams] = useSearchParams();
    const [numId, setNumId] = useState<number>(NaN);
    
    useEffect(() => {
        setNumId(Number.parseInt(searchParams.get("id") ?? ""));
    }, [searchParams.get("id")]);

    const setTournamentNotFound = () => setNumId(NaN);

    return !Number.isNaN(numId) ? (
        <main className="bracket-page">
            <Bracket id={numId} setTournamentNotFound={setTournamentNotFound}/>
        </main>
    ) : (
        <h2>Tournament not found.</h2>
    );
}