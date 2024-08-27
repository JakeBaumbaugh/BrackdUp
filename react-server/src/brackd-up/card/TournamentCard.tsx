import { Link } from "react-router-dom";
import TournamentSummary from "../../model/TournamentSummary";
import "./tournamentcard.css";

interface TournamentCardProps {
    summary: TournamentSummary;
}

export default function TournamentCard({summary}: Readonly<TournamentCardProps>) {
    return (
        <Link className="tournament-card" to={`tournament?id=${summary.id}`}>
            <div className="border-tl"/>
            <div className="border-br"/>
            <div className="tournament-card-content">
                <p>{summary.name}</p>
            </div>
        </Link>
    );
}