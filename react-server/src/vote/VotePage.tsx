import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import EntryCard from "../card/EntryCard";
import { useTournamentContext } from "../context/TournamentContext";
import Entry from "../model/Entry";
import { TournamentMatch } from "../model/Tournament";
import { submitVotes } from "../service/TournamentService";
import "./vote.css";

export default function VotePage() {
    const navigate = useNavigate();
    const {tournament, userVotes, setUserVotes, loadData} = useTournamentContext();
    const [saving, setSaving] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);

    const currentRound = tournament?.getVotableRound();

    const matches = useMemo(() => {
        // Empty if no permission, userVotes null if forbidden
        if(!userVotes) {
            return [];
        }
        // Setup matches
        let matches = currentRound?.matches ?? [];
        matches =  matches.map(match => match.copy());
        matches.forEach(match => {
            if(userVotes.has(match.entry1.id)) {
                match.entryWinner = match.entry1;
            } else if(userVotes.has(match.entry2.id)) {
                match.entryWinner = match.entry2;
            }
        });
        return matches;
    }, [currentRound, userVotes]);

    useEffect(() => setPageIndex(currentRound?.description ? 0 : 1), [currentRound]);

    const onVote = (match: TournamentMatch, entry: Entry) => {
        setUserVotes(userVotes => {
            const newVotedEntries = new Set(userVotes);
            if(newVotedEntries.has(entry.id)) {
                newVotedEntries.delete(entry.id);
            } else {
                newVotedEntries.delete(match.entry1.id);
                newVotedEntries.delete(match.entry2.id);
                newVotedEntries.add(entry.id);
            }
            return newVotedEntries;
        });
    }

    const onSubmit = () => {
        if(tournament && userVotes) {
            setSaving(true);
            submitVotes(tournament.id, [...userVotes])
                .then(response => {
                    setSaving(false);
                    if (response.roundEnded) {
                        loadData();
                    }
                    navigate(`/tournament?id=${tournament.id}`);
                });
            console.log("Submitted vote.");
        } else {
            console.log("Submitting vote failed.");
        }
    }

    const minPageIndex = currentRound?.description ? 0 : 1;
    const maxPageIndex = matches.length + 1;
    const matchIsVoted = (pageIndex > 0 && pageIndex < maxPageIndex && matches.length > 0) ? matches[pageIndex - 1].entryWinner !== undefined : true;

    if(!currentRound || !userVotes) {
        return <main className="vote-page">Forbidden.</main>;
    }

    let pageContent;
    if (pageIndex === 0) {
        pageContent = <DescriptionPage roundDescription={currentRound.description} />;
    } else if (pageIndex === maxPageIndex) {
        pageContent = <ReviewPage matches={matches} votedEntries={userVotes} onVote={onVote}/>;
    } else {
        pageContent = <SingleVotePage match={matches[pageIndex - 1]} votedEntries={userVotes} onVote={onVote} />;
    }

    return (
        <main className="vote-page">
            {pageContent}
            <div className="action-buttons">
                <Button
                    variant="danger"
                    onClick={() => setPageIndex(index => index - 1)}
                    disabled={pageIndex === minPageIndex}
                >PREV</Button>
                {pageIndex === maxPageIndex ? (
                    <Button
                        variant={matchIsVoted ? "danger" : "secondary"}
                        onClick={onSubmit}
                    >SUBMIT</Button>
                ) : (
                    <Button
                        variant={matchIsVoted ? "danger" : "secondary"}
                        onClick={() => setPageIndex(index => index + 1)}
                    >
                        {pageIndex === 0 ? "BEGIN" : matchIsVoted ? "NEXT" : "SKIP"}
                    </Button>
                )}
            </div>
        </main>
    );
}

interface DescriptionPageProps {
    roundDescription: string;
}

function DescriptionPage({roundDescription}: DescriptionPageProps) {
    return (
        <div className="match-container">
            <div className="round-description">
                <p>{roundDescription}</p>
            </div>
        </div>
    );
}

interface SingleVotePageProps {
    match: TournamentMatch;
    votedEntries: Set<number>;
    onVote: (match: TournamentMatch, entry: Entry) => void;
}

function SingleVotePage(props: SingleVotePageProps) {
    const isDesktop = useMediaQuery({ minWidth: 600 });
    return isDesktop ? <DesktopSingleVotePage {...props}/> : <MobileSingleVotePage {...props}/>;
}

function DesktopSingleVotePage({match, votedEntries, onVote}: SingleVotePageProps) {
    return (
        <div className="match-container">
            <div className="match-descriptions">
                <p>{match.entry1Description}</p>
                <p>{match.entry2Description}</p>
            </div>
            <div key={match.id} className="match">
                <EntryCard
                    entry={match.entry1}
                    votedFor={votedEntries.has(match.entry1.id)}
                    onClick={() => onVote(match, match.entry1)}
                />
                <div className="match-connector">
                    <hr/>
                    <p>VS</p>
                    <hr/>
                </div>
                <EntryCard
                    entry={match.entry2}
                    votedFor={votedEntries.has(match.entry2.id)}
                    onClick={() => onVote(match, match.entry2)}
                />
            </div>
            <div className="filler"/>
        </div>
    );
}

function MobileSingleVotePage({match, votedEntries, onVote}: SingleVotePageProps) {
    return (
        <div className="match-container">
            {match.entry1Description && <p>{match.entry1Description}</p>}
            <div key={match.id} className="match">
                <EntryCard
                    entry={match.entry1}
                    votedFor={votedEntries.has(match.entry1.id)}
                    onClick={() => onVote(match, match.entry1)}
                />
                <div className="match-connector">
                    <hr/>
                    <p>VS</p>
                    <hr/>
                </div>
                <EntryCard
                    entry={match.entry2}
                    votedFor={votedEntries.has(match.entry2.id)}
                    onClick={() => onVote(match, match.entry2)}
                />
            </div>
            {match.entry2Description && <p>{match.entry2Description}</p>}
        </div>
    );
}

interface ReviewPageProps {
    matches: TournamentMatch[];
    votedEntries: Set<number>;
    onVote: (match: TournamentMatch, entry: Entry) => void;
}

function ReviewPage({matches, votedEntries, onVote}: ReviewPageProps) {
    return (
        <div className="review-container">
            <h2>Review your Vote{matches.length === 1 ? "" : "s"}</h2>
            {matches.map(match => (
                <div key={match.id} className="match">
                    <EntryCard
                        entry={match.entry1}
                        votedFor={votedEntries.has(match.entry1.id)}
                        onClick={() => onVote(match, match.entry1)}
                    />
                    <div className="match-connector">
                        <hr/>
                        <p>VS</p>
                        <hr/>
                    </div>
                    <EntryCard
                        entry={match.entry2}
                        votedFor={votedEntries.has(match.entry2.id)}
                        onClick={() => onVote(match, match.entry2)}
                    />
                </div>
            ))}
        </div>
    );
}