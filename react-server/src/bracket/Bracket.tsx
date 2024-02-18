import { useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import SongCard from "../card/SongCard";
import { BracketSong } from "../model/Song";
import { Tournament, TournamentMatch } from "../model/Tournament";
import MatchConnectorColumn from "./MatchConnectorColumn";

interface BracketProps {
    tournament: Tournament;
}

export default function Bracket({tournament}: BracketProps) {
    const matches = useMemo(() => {
        const matches: (TournamentMatch|null)[][] = tournament.levels.map(level => level.rounds.flatMap(round => {
            const isActive = tournament.getVotableRound()?.id === round.id;
            round.matches.forEach(match => {
                match.song1.activeRound = isActive;
                match.song2.activeRound = isActive;
            });
            return round.matches;
        }));
        // Fill null matches for unfinished levels
        let expectedMatchCount = matches[0].length / 2;
        for(let levelIndex = 1; levelIndex < matches.length; levelIndex++) {
            const level = matches[levelIndex];
            if(level.length !== expectedMatchCount) {
                const extraNulls = Array(expectedMatchCount - level.length).fill(null);
                level.push(...extraNulls);
            }
            expectedMatchCount /= 2;
        }
        return matches;
    }, [tournament]);

    const songs: (BracketSong|null)[][] = useMemo(() => {
        const songs = matches.map((level, levelIndex) =>
            level.flatMap((match, matchIndex) => {
                if(match) {
                    const song1 = {...match.song1} as BracketSong;
                    const song2 = {...match.song2} as BracketSong;
                    if(levelIndex > 0) {
                        const match1Index = matchIndex * 2;
                        const match2Index = matchIndex * 2 + 1;
                        const prevLevel = matches[levelIndex - 1];
                        song1.parent1VoteCount = prevLevel[match1Index]?.song1VoteCount;
                        song1.parent2VoteCount = prevLevel[match1Index]?.song2VoteCount;
                        song2.parent1VoteCount = prevLevel[match2Index]?.song1VoteCount;
                        song2.parent2VoteCount = prevLevel[match2Index]?.song2VoteCount;
                    }
                    song1.receivedVoteCount = match.song1VoteCount;
                    song2.receivedVoteCount = match.song2VoteCount;
                    const totalVoteCount = (match.song1VoteCount ?? 0) + (match.song2VoteCount ?? 0);
                    song1.totalVoteCount = totalVoteCount;
                    song2.totalVoteCount = totalVoteCount;
                    // Clear activeRound boolean on original song object
                    match.song1.activeRound = undefined;
                    match.song2.activeRound = undefined;
                    return [song1, song2];
                } else {
                    return [null, null];
                }
            })
        );
        const lastMatch = matches.at(-1)![0];
        const songWinner = lastMatch?.songWinner as BracketSong ?? null;
        if(songWinner) {
            songWinner.parent1VoteCount = lastMatch!.song1VoteCount;
            songWinner.parent2VoteCount = lastMatch!.song2VoteCount;
        }
        songs.push([songWinner]);
        return songs;
    }, [matches]);

    const songColumns = useMemo(() => {
        const leftSongs: (BracketSong|null)[][] = [];
        const rightSongs: (BracketSong|null)[][] = [];
        songs.forEach(level => {
            if(level.length > 1) {
                const halfLength = level.length / 2;
                leftSongs.push(level.slice(0, halfLength));
                rightSongs.push(level.slice(halfLength));
            }
        });
        const finalSong = songs.at(-1)![0];
        return [...leftSongs, [finalSong], ...(rightSongs.toReversed())];
    }, [songs]);

    return songColumns ? (
        <TransformWrapper minScale={0.5} maxScale={2}>
            <TransformComponent>
                <div className="bracket">
                    {songColumns.map((songs, index) => <>
                        {index > 0 && <MatchConnectorColumn left={songColumns[index-1].length} right={songs.length}/>}
                        <div className={index < songColumns.length / 2 ? "column left-column" : "column right-column"}>
                            {songs.map(song =>
                                <SongCard
                                    song={song}
                                    final={index == (songColumns.length - 1) / 2}
                                    // key={`${song?.title}-${song?.artist}`}
                                />
                            )}
                        </div>
                    </>)}
                </div>
            </TransformComponent>
        </TransformWrapper>
    ) : <></>;
}