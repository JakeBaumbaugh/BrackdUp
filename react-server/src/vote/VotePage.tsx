import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SongCard from "../songcard/SongCard";
import { useTournamentContext } from "../context/TournamentContext";
import { getTournament, submitVote } from "../service/TournamentService";
import "./vote.css";
import Song from "../model/Song";
import { TournamentMatch } from "../model/Tournament";
import { useProfileContext } from "../context/ProfileContext";

export default function VotePage() {
    const [searchParams] = useSearchParams();
    const [tournament, setTournament] = useTournamentContext();
    const [profile] = useProfileContext();
    const [votedSongs, setVotedSongs] = useState<Set<Song>>(new Set([]));
    const [saving, setSaving] = useState(false);
    
    const matches = useMemo(() => {
        const round = tournament?.getCurrentRound();
        let matches = round?.matches || [];
        matches =  matches.map(match => match.copy());
        matches.forEach(match => {
            if(votedSongs.has(match.song1)) {
                match.songWinner = match.song1;
            } else if(votedSongs.has(match.song2)) {
                match.songWinner = match.song2;
            }
        });
        return matches;
    }, [tournament]);
    
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
            if(newVotedSongs.has(song)) {
                newVotedSongs.delete(song);
            } else {
                newVotedSongs.delete(match.song1);
                newVotedSongs.delete(match.song2);
                newVotedSongs.add(song);
            }
            return newVotedSongs;
        });
    }

    const submit = () => {
        if(profile?.jwt && tournament) {
            const songIds = [...votedSongs].map(song => song.id);
            setSaving(true);
            submitVote(profile.jwt, tournament.id, songIds)
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
                            votedFor={votedSongs.has(match.song1)}
                            onClick={() => vote(match, match.song1)}
                        />
                        <div className="match-connector">
                            <hr/>
                            <p>VS</p>
                            <hr/>
                        </div>
                        <SongCard
                            song={match.song2}
                            votedFor={votedSongs.has(match.song2)}
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