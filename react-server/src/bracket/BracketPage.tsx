import { useTournamentContext } from "../context/TournamentContext";
import Bracket from "./Bracket";
import VoteModal from "./VoteModal";
import "./bracket.css";

export default function BracketPage() {
    const {tournament} = useTournamentContext();

    if(!tournament) {
        return (
            <main className="bracket-page">
                <h2>{tournament === null ? "Tournament not found." : "Loading..."}</h2>
            </main>
        );
    }

    return (
        <main className="bracket-page">
            <Bracket tournament={tournament}/>
            <VoteModal tournament={tournament}/>
        </main>
    );
}