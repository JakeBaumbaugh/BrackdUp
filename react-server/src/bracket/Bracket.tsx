import { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import { getTournament } from "../service/TournamentService";
import SongCard from "./SongCard";
import MatchConnectorColumn from "./MatchConnectorColumn";

interface BracketProps {
    tournament: Tournament;
}

export default function Bracket({tournament}: BracketProps) {
    const [songColumns, setSongColumns] = useState<(Song|null)[][]>();

    useEffect(() => {
        setSongColumns(tournament.getSongColumns());
    }, [tournament]);

    return songColumns ? (
        <TransformWrapper maxScale={2}>
            <TransformComponent>
                <div className="bracket">
                    {songColumns.map((songs, index) => <>
                        {index > 0 && <MatchConnectorColumn left={songColumns[index-1].length} right={songs.length}/>}
                        <div className="column">
                            {songs.map(song => <>
                                <SongCard song={song} final={index == (songColumns.length - 1) / 2}/>
                            </>)}
                        </div>
                    </>)}
                </div>
            </TransformComponent>
        </TransformWrapper>
    ) : <></>;
}