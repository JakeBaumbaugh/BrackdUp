import Song from "../model/Song";
import "./songcard.css";

interface SongCardProps {
    song: Song|null;
    final?: boolean;
    votedFor?: boolean;
    onClick?: () => void;
}

export default function SongCard({song, final, votedFor, onClick}: SongCardProps) {
    let cardClass = "song-card";
    if (final) {
        cardClass += " final";
    }
    if(song?.activeRound) {
        cardClass += " active";
    }
    if(votedFor) {
        cardClass += " selected";
    }
    if(onClick) {
        cardClass += " clickable";
    }

    return <>
        <div className={cardClass} onClick={onClick}>
            <div>{song?.title}</div>
            <div>{song?.artist}</div>
        </div>
    </>;
}