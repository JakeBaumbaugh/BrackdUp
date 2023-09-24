import { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import { getTournament } from "../service/TournamentService";
import SongCard from "./SongCard";
import "./bracket.css";
import MatchConnectorColumn from "./MatchConnectorColumn";

interface BracketProps {
    entries: number;
}

export default function Bracket({entries}: BracketProps) {
    const [tournament, setTournament] = useState<Tournament>();
    const [songColumns, setSongColumns] = useState<(Song|null)[][]>();

    useEffect(() => {
        getTournament(1).then(tournament => {
            console.log("Retrieved tournament:", tournament);
            setTournament(tournament);
            setSongColumns(tournament.getSongColumns());
        });
    }, []);

    console.log(songColumns);

    if(!Number.isInteger(Math.log2(entries))) {
        return <></>
    }

    let cols = [];
    
    for(let len = entries/2; len >= 1; len /= 2) {
        cols.push(len);
    }

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