import { Fragment, useEffect, useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import EntryCard from "../card/EntryCard";
import { BracketEntry } from "../model/Entry";
import { Tournament, TournamentMatch } from "../model/Tournament";
import MatchConnectorColumn from "./MatchConnectorColumn";
import { useTournamentContext } from "../context/TournamentContext";
import { submitVote } from "../service/TournamentService";

export interface MatchFocus {
    match: TournamentMatch|undefined;
}

interface BracketProps {
    tournament: Tournament;
    voteMode?: boolean;
    matchFocus?: MatchFocus;
    jumpMatchFocus?: (jumpCount: number) => void;
}

export default function Bracket({tournament, voteMode, matchFocus, jumpMatchFocus}: Readonly<BracketProps>) {
    const {loadData} = useTournamentContext();

    const matches = useMemo(() => {
        const matches: (TournamentMatch|null)[][] = tournament.levels.map(level => level.rounds.flatMap(round => {
            const isActive = tournament.getVotableRound()?.id === round.id;
            round.matches.forEach(match => {
                match.entry1.activeRound = isActive;
                match.entry2.activeRound = isActive;
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

    const entries: (BracketEntry|null)[][] = useMemo(() => {
        const entries = matches.map((level, levelIndex) =>
            level.flatMap((match, matchIndex) => {
                if(match) {
                    const entry1 = {...match.entry1} as BracketEntry;
                    const entry2 = {...match.entry2} as BracketEntry;
                    entry1.matchId = match.id;
                    entry2.matchId = match.id;
                    if(levelIndex > 0) {
                        const match1Index = matchIndex * 2;
                        const match2Index = matchIndex * 2 + 1;
                        const prevLevel = matches[levelIndex - 1];
                        entry1.parent1VoteCount = prevLevel[match1Index]?.entry1VoteCount;
                        entry1.parent2VoteCount = prevLevel[match1Index]?.entry2VoteCount;
                        entry2.parent1VoteCount = prevLevel[match2Index]?.entry1VoteCount;
                        entry2.parent2VoteCount = prevLevel[match2Index]?.entry2VoteCount;
                    }
                    entry1.receivedVoteCount = match.entry1VoteCount;
                    entry2.receivedVoteCount = match.entry2VoteCount;
                    const totalVoteCount = (match.entry1VoteCount ?? 0) + (match.entry2VoteCount ?? 0);
                    entry1.totalVoteCount = totalVoteCount;
                    entry2.totalVoteCount = totalVoteCount;
                    // Clear activeRound boolean on original entry object
                    match.entry1.activeRound = undefined;
                    match.entry2.activeRound = undefined;
                    return [entry1, entry2];
                } else {
                    return [null, null];
                }
            })
        );
        const lastMatch = matches.at(-1)![0];
        const entryWinner = lastMatch?.entryWinner as BracketEntry ?? null;
        if(entryWinner) {
            entryWinner.parent1VoteCount = lastMatch!.entry1VoteCount;
            entryWinner.parent2VoteCount = lastMatch!.entry2VoteCount;
        }
        entries.push([entryWinner]);
        return entries;
    }, [matches]);

    const entryColumns = useMemo(() => {
        const leftEntries: (BracketEntry|null)[][] = [];
        const rightEntries: (BracketEntry|null)[][] = [];
        entries.forEach(level => {
            if(level.length > 1) {
                const halfLength = level.length / 2;
                leftEntries.push(level.slice(0, halfLength));
                rightEntries.push(level.slice(halfLength));
            }
        });
        const finalEntry = entries.at(-1)![0];
        return [...leftEntries, [finalEntry], ...(rightEntries.toReversed())];
    }, [entries]);

    const voteForEntry = (entryId: number) => {
        submitVote(tournament.id, entryId)
            .then(() => {
                loadData();
                // only jump if voted on selected match
                if (matchFocus?.match?.entry1.id == entryId || matchFocus?.match?.entry2.id == entryId) {
                    jumpMatchFocus?.(1);
                }
            })
            .catch(e => console.error("Failed to submit vote. TODO: Handle error.", e));
    };

    return entryColumns ? (
        <TransformWrapper minScale={0.5} maxScale={2} centerOnInit>
            {({zoomToElement}) => <BracketContent
                entryColumns={entryColumns} 
                voteMode={!!voteMode}
                voteForEntry={voteForEntry}
                matchFocus={matchFocus}
                zoomToElement={zoomToElement}
            />}
        </TransformWrapper>
    ) : <></>;
}

interface BracketContentProps {
    entryColumns: (BracketEntry|null)[][];
    voteMode: boolean;
    voteForEntry: (entryId: number) => void;
    matchFocus?: MatchFocus;
    zoomToElement?: (node: string, scale?: number) => void;
}

function BracketContent({entryColumns, voteMode, voteForEntry, matchFocus, zoomToElement}: Readonly<BracketContentProps>) {
    const {userVotes} = useTournamentContext();

    useEffect(() => {
        if (matchFocus?.match && zoomToElement) {
            zoomToElement(`match-connector-${matchFocus.match.id}`);
        }
    }, [matchFocus, zoomToElement]);

    return <TransformComponent>
        <div className="bracket">
            {entryColumns.map((entries, columnIndex) => <Fragment key={`column-${columnIndex}`}>
                {columnIndex > 0 && <MatchConnectorColumn leftColumn={entryColumns[columnIndex-1]} rightColumn={entries}/>}
                <div className={columnIndex < entryColumns.length / 2 ? "column left-column" : "column right-column"}>
                    {entries.map((entry, index) =>
                        <EntryCard
                            entry={entry}
                            final={columnIndex == (entryColumns.length - 1) / 2}
                            key={`${columnIndex}-${index}`}
                            onClick={(voteMode && entry?.activeRound) ? () => voteForEntry(entry.id) : undefined}
                            votedFor={voteMode && entry?.activeRound && userVotes?.has(entry.id)}
                        />
                    )}
                </div>
            </Fragment>)}
        </div>
    </TransformComponent>
}