import { useEffect, useState } from "react";
import { useTournamentContext } from "../context/TournamentContext";
import { tournamentImageUrl } from "../service/ImageService";
import Bracket from "./Bracket";
import VoteModal from "./VoteModal";
import "./bracket.css";

export default function BracketPage() {
    const {tournament} = useTournamentContext();
    const [backgroundImageError, setBackgroundImageError] = useState(false);
    const backgroundImageClass = backgroundImageError ? "background-image missing" : "background-image";

    useEffect(() => {
        setBackgroundImageError(false);
    }, [tournament?.id]);

    if(!tournament) {
        return (
            <main className="bracket-page">
                <h2>{tournament === null ? "Tournament not found." : "Loading..."}</h2>
            </main>
        );
    }

    return (
        <main className="bracket-page">
            <div className="background">
                <img className={backgroundImageClass} src={tournamentImageUrl(tournament.id)} onError={() => setBackgroundImageError(true)}/>
            </div>
            <Bracket tournament={tournament}/>
            <VoteModal tournament={tournament}/>
        </main>
    );
}