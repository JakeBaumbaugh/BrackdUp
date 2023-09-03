interface SongCardProps {
    title: string;
    artist: string;
    final?: boolean;
}

export default function SongCard({title, artist, final}: SongCardProps) {
    return <>
        <div className={final ? "song-card final" :"song-card"}>
            <div>{title}</div>
            <div>{artist}</div>
        </div>
    </>;
}