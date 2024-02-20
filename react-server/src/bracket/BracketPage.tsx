import { useTournamentContext } from "../context/TournamentContext";
import { tournamentImageUrl } from "../service/ImageService";
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
            <div className="background">
                <img className="background-image" src={tournamentImageUrl(tournament.id)} alt=" "/>
            </div>
            <Bracket tournament={tournament}/>
            <VoteModal tournament={tournament}/>
        </main>
    );
}