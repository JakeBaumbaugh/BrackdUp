import Song from "../model/Song";

interface SongCardProps {
    song: Song|null;
    final?: boolean;
}

export default function SongCard({song, final}: SongCardProps) {
    return <>
        <div className={final ? "song-card final" :"song-card"}>
            <div>{song?.title}</div>
            <div>{song?.artist}</div>
        </div>
    </>;
}