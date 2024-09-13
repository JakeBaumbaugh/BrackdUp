import { Link } from "react-router-dom";
import TournamentSummary from "../../model/TournamentSummary";
import "./tournamentcard.css";
import { PropsWithChildren } from "react";

interface TournamentCardProps {
    summary: TournamentSummary;
}

export default function TournamentCard({summary}: Readonly<TournamentCardProps>) {
    return (
        <CustomTournamentCard linkTo={`tournament?id=${summary.id}`}>
            <p>{summary.name}</p>
        </CustomTournamentCard>
    );
}

interface CustomTournamentCardProps {
    linkTo: string;
}

export function CustomTournamentCard({linkTo, children}: PropsWithChildren<CustomTournamentCardProps>) {
    return (
        <Link className="tournament-card" to={linkTo}>
            <div className="border-tl"/>
            <div className="border-br"/>
            <div className="tournament-card-content">
                {children}
            </div>
        </Link>
    );
}