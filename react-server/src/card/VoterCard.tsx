import TournamentVoter from "../model/TournamentVoter";
import "./votercard.css";

interface VoterCardProps {
    voter: TournamentVoter;
    onClick?: () => void;
    deletable?: boolean;
}

export default function VoterCard({voter, onClick, deletable}: VoterCardProps) {
    let cardClass = "custom-card voter-card";
    if (onClick) {
        cardClass += " clickable";
    }
    if (deletable) {
        cardClass += " deletable";
    }
    return (
        <div className={cardClass} onClick={onClick}>
            <div>{voter.email}</div>
        </div>
    );
}