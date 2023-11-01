import Song from "../model/Song";
import "./songcard.css";

interface SongCardProps {
    song: Song|null;
    final?: boolean;
    votedFor?: boolean;
    onClick?: () => void;
    deletable?: boolean;
    selectable?: boolean;
}

export default function SongCard({song, final, votedFor, onClick, deletable, selectable}: SongCardProps) {
    let cardClass = "card song-card";
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
    if(deletable) {
        cardClass += " deletable";
    }
    if(selectable) {
        cardClass += " selectable";
    }

    return <>
        <div className={cardClass} onClick={onClick}>
            <div>{song?.title}</div>
            <div>{song?.artist}</div>
        </div>
    </>;
}