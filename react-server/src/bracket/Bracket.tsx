import { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import { getTournament } from "../service/TournamentService";
import SongCard from "./SongCard";
import MatchConnectorColumn from "./MatchConnectorColumn";

interface BracketProps {
    id: number,
    setTournamentNotFound: () => void,
}

export default function Bracket({id, setTournamentNotFound}: BracketProps) {
    const [tournament, setTournament] = useState<Tournament>();
    const [songColumns, setSongColumns] = useState<(Song|null)[][]>();

    useEffect(() => {
        getTournament(id).then(tournament => {
            if(!tournament) {
                setTournamentNotFound();
            } else {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
                setSongColumns(tournament.getSongColumns());
            }
        });
    }, []);

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