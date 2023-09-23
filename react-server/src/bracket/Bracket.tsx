import { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import { getTournament } from "../service/TournamentService";
import SongCard from "./SongCard";
import "./bracket.css";

interface BracketProps {
    entries: number;
}

export default function Bracket({entries}: BracketProps) {
    const [tournament, setTournament] = useState<Tournament>();
    const [songColumns, setSongColumns] = useState<(Song|undefined)[][]>();

    useEffect(() => {
        getTournament(1).then(tournament => {
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
        <TransformWrapper>
            <TransformComponent>
                <div className="bracket">
                    {songColumns.map((songs, index) => <>
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