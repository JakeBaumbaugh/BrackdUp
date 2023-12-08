import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SongCard from "../card/SongCard";
import { useTournamentContext } from "../context/TournamentContext";
import TournamentManager from "../context/TournamentManager";
import Song from "../model/Song";
import { TournamentMatch } from "../model/Tournament";
import { submitVote } from "../service/TournamentService";
import "./vote.css";

export default function VotePage() {
    const navigate = useNavigate();
    const {tournament, userVotes, setUserVotes} = useTournamentContext();
    const [saving, setSaving] = useState(false);

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

    const vote = (match: TournamentMatch, song: Song) => {
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

    const submit = () => {
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

    if(userVotes === null) {
        return (
            <main className="vote-page">
                Forbidden.
            </main>);
    }

    return (
        <main className="vote-page">
            <div className="match-container">
                { matches.map(match => (
                    <div key={match.id} className="match">
                        <SongCard
                            song={match.song1}
                            votedFor={userVotes.has(match.song1.id)}
                            onClick={() => vote(match, match.song1)}
                        />
                        <div className="match-connector">
                            <hr/>
                            <p>VS</p>
                            <hr/>
                        </div>
                        <SongCard
                            song={match.song2}
                            votedFor={userVotes.has(match.song2.id)}
                            onClick={() => vote(match, match.song2)}
                        />
                    </div>
                ))}
                <Button
                    variant="danger"
                    onClick={submit}
                    disabled={saving}
                >SUBMIT</Button>
            </div>
        </main>
    );
}