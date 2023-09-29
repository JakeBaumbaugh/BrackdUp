import Song from "../model/Song";

interface SongCardProps {
    song: Song|null;
    final?: boolean;
}

export default function SongCard({song, final}: SongCardProps) {
    let cardClass = "song-card";
    if (final) {
        cardClass += " final";
    }
    if(song?.activeRound) {
        cardClass += " active";
    }

    return <>
        <div className={cardClass}>
            <div>{song?.title}</div>
            <div>{song?.artist}</div>
        </div>
    </>;
}