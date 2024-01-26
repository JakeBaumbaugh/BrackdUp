import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import SongCard from "../card/SongCard";
import { useTournamentContext } from "../context/TournamentContext";
import Song from "../model/Song";
import { TournamentMatch } from "../model/Tournament";
import { submitVote } from "../service/TournamentService";
import "./vote.css";

export default function VotePage() {
    const navigate = useNavigate();
    const {tournament, userVotes, setUserVotes} = useTournamentContext();
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
            if(userVotes.has(match.song1.id)) {
                match.songWinner = match.song1;
            } else if(userVotes.has(match.song2.id)) {
                match.songWinner = match.song2;
            }
        });
        return matches;
    }, [currentRound, userVotes]);

    useEffect(() => setPageIndex(currentRound?.description ? 0 : 1), [currentRound]);

    const onVote = (match: TournamentMatch, song: Song) => {
        setUserVotes(userVotes => {
            const newVotedSongs = new Set(userVotes);
            if(newVotedSongs.has(song.id)) {
                newVotedSongs.delete(song.id);
            } else {
                newVotedSongs.delete(match.song1.id);
                newVotedSongs.delete(match.song2.id);
                newVotedSongs.add(song.id);
            }
            return newVotedSongs;
        });
    }

    const onSubmit = () => {
        if(tournament && userVotes) {
            setSaving(true);
            submitVote(tournament.id, [...userVotes])
                .then(() => {
                    setSaving(false);
                    navigate(`/tournament?id=${tournament.id}`);
                });
            console.log("Submitted vote.");
        } else {
            console.log("Submitting vote failed.");
        }
    }

    const minPageIndex = currentRound?.description ? 0 : 1;
    const maxPageIndex = matches.length + 1;
    const matchIsVoted = (pageIndex > 0 && pageIndex < maxPageIndex && matches.length > 0) ? matches[pageIndex - 1].songWinner !== undefined : true;

    if(!currentRound || !userVotes) {
        return <main className="vote-page">Forbidden.</main>;
    }

    let pageContent;
    if (pageIndex === 0) {
        pageContent = <DescriptionPage roundDescription={currentRound.description} />;
    } else if (pageIndex === maxPageIndex) {
        pageContent = <ReviewPage matches={matches} votedSongs={userVotes} onVote={onVote}/>;
    } else {
        pageContent = <SingleVotePage match={matches[pageIndex - 1]} votedSongs={userVotes} onVote={onVote} />;
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
    votedSongs: Set<number>;
    onVote: (match: TournamentMatch, song: Song) => void;
}

function SingleVotePage(props: SingleVotePageProps) {
    const isDesktop = useMediaQuery({ minWidth: 600 });
    return isDesktop ? <DesktopSingleVotePage {...props}/> : <MobileSingleVotePage {...props}/>;
}

function DesktopSingleVotePage({match, votedSongs, onVote}: SingleVotePageProps) {
    return (
        <div className="match-container">
            <div className="match-descriptions">
                <p>{match.song1Description}</p>
                <p>{match.song2Description}</p>
            </div>
            <div key={match.id} className="match">
                <SongCard
                    song={match.song1}
                    votedFor={votedSongs.has(match.song1.id)}
                    onClick={() => onVote(match, match.song1)}
                />
                <div className="match-connector">
                    <hr/>
                    <p>VS</p>
                    <hr/>
                </div>
                <SongCard
                    song={match.song2}
                    votedFor={votedSongs.has(match.song2.id)}
                    onClick={() => onVote(match, match.song2)}
                />
            </div>
            <div className="filler"/>
        </div>
    );
}

function MobileSingleVotePage({match, votedSongs, onVote}: SingleVotePageProps) {
    return (
        <div className="match-container">
            {match.song1Description && <p>{match.song1Description}</p>}
            <div key={match.id} className="match">
                <SongCard
                    song={match.song1}
                    votedFor={votedSongs.has(match.song1.id)}
                    onClick={() => onVote(match, match.song1)}
                />
                <div className="match-connector">
                    <hr/>
                    <p>VS</p>
                    <hr/>
                </div>
                <SongCard
                    song={match.song2}
                    votedFor={votedSongs.has(match.song2.id)}
                    onClick={() => onVote(match, match.song2)}
                />
            </div>
            {match.song2Description && <p>{match.song2Description}</p>}
        </div>
    );
}

interface ReviewPageProps {
    matches: TournamentMatch[];
    votedSongs: Set<number>;
    onVote: (match: TournamentMatch, song: Song) => void;
}

function ReviewPage({matches, votedSongs, onVote}: ReviewPageProps) {
    return (
        <div className="review-container">
            <h2>Review your Vote{matches.length === 1 ? "" : "s"}</h2>
            {matches.map(match => (
                <div key={match.id} className="match">
                    <SongCard
                        song={match.song1}
                        votedFor={votedSongs.has(match.song1.id)}
                        onClick={() => onVote(match, match.song1)}
                    />
                    <div className="match-connector">
                        <hr/>
                        <p>VS</p>
                        <hr/>
                    </div>
                    <SongCard
                        song={match.song2}
                        votedFor={votedSongs.has(match.song2.id)}
                        onClick={() => onVote(match, match.song2)}
                    />
                </div>
            ))}
        </div>
    );
}