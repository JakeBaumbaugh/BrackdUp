import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SongCard from "../songcard/SongCard";
import { useTournamentContext } from "../context/TournamentContext";
import { getTournament, getVotes, submitVote } from "../service/TournamentService";
import "./vote.css";
import Song from "../model/Song";
import { TournamentMatch } from "../model/Tournament";
import { useProfileContext } from "../context/ProfileContext";

export default function VotePage() {
    const [searchParams] = useSearchParams();
    const [tournament, setTournament] = useTournamentContext();
    const {profile: [profile]} = useProfileContext();
    const [votedSongs, setVotedSongs] = useState<Set<number>>(new Set([]));
    const [saving, setSaving] = useState(false);

    const currentRound = tournament?.getVotableRound();
    
    const matches = useMemo(() => {
        // Setup votedSongs
        if(profile?.jwt && tournament?.id) {
            getVotes(profile?.jwt, tournament?.id)
                .then(songIds => setVotedSongs(new Set(songIds)));
        }
        // Setup matches
        let matches = currentRound?.matches || [];
        matches =  matches.map(match => match.copy());
        matches.forEach(match => {
            if(votedSongs.has(match.song1.id)) {
                match.songWinner = match.song1;
            } else if(votedSongs.has(match.song2.id)) {
                match.songWinner = match.song2;
            }
        });
        return matches;
    }, [currentRound, profile?.id]);
    
    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(tournament?.id !== id) {
            getTournament(id).then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            }).catch(() => setTournament(null));
        }
    }, [searchParams.get("id")]);

    const vote = (match: TournamentMatch, song: Song) => {
        setVotedSongs(votedSongs => {
            const newVotedSongs = new Set(votedSongs);
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
        if(profile?.jwt && tournament) {
            setSaving(true);
            submitVote(profile.jwt, tournament.id, [...votedSongs])
                .then(() => setSaving(false));
            console.log("Submitted vote.");
        } else {
            console.log("Profile, JWT, or Tournament was not found.");
        }
    }

    return (
        <main className="vote-page">
            <div className="match-container">
                { matches.map(match => (
                    <div key={match.id} className="match">
                        <SongCard
                            song={match.song1}
                            votedFor={votedSongs.has(match.song1.id)}
                            onClick={() => vote(match, match.song1)}
                        />
                        <div className="match-connector">
                            <hr/>
                            <p>VS</p>
                            <hr/>
                        </div>
                        <SongCard
                            song={match.song2}
                            votedFor={votedSongs.has(match.song2.id)}
                            onClick={() => vote(match, match.song2)}
                        />
                    </div>
                ))}
                <button
                    onClick={submit}
                    className="red-button"
                    disabled={saving}
                >SUBMIT</button>
            </div>
        </main>
    );
}