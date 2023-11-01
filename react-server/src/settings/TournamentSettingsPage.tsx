import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTournamentContext } from "../context/TournamentContext";
import TournamentVoter from "../model/TournamentVoter";
import { deleteTournament, getTournament, getTournamentSettings, saveTournamentSettings } from "../service/TournamentService";
import "./settings.css";
import VoterCard from "../card/VoterCard";
import TournamentSettings from "../model/TournamentSettings";

export default function TournamentSettingsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useTournamentContext();
    const [settings, setSettings] = useState<TournamentSettings|null>();
    const [voterInput, setVoterInput] = useState("");

    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(tournament?.id !== id) {
            getTournament(id).then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            }).catch(() => setTournament(null));
        }
    }, [searchParams.get("id")]);

    useEffect(() => {
        if(tournament?.id) {
            getTournamentSettings(tournament.id)
                .then(settings => setSettings(settings));
        }
    }, [tournament?.id]);

    const addVoter = () => {
        const email = voterInput.trim();
        if(email && settings && !settings.hasVoter(email)) {
            const voter = new TournamentVoter(tournament!.id, email);
            setSettings(settings => settings?.addVoter(voter));
            setVoterInput("");
        }
    };

    const removeVoter = (voter: TournamentVoter) => setSettings(settings => settings?.removeVoter(voter))

    const onDelete = () => {
        // TODO: Modal confirmation
        if(tournament) {
            deleteTournament(tournament.id)
                .then(() => navigate("/"));
            // TODO: Display error if tournament delete failed
        }
    };

    const onSave = () => {
        if(settings) {
            saveTournamentSettings(settings)
                .then(() => navigate("/"));
        }
    };

    return (
        <main className="settings-page">
            {(tournament && settings) ? <>
                <div className="voter-settings">
                    <h3>Voters</h3>
                    <input
                        type="text"
                        value={voterInput}
                        onChange={e => setVoterInput(e.target.value)}
                        placeholder="Enter voter email address..."
                    />
                    <button type="button" onClick={addVoter}>+</button>
                    <div className="voter-list">
                        {settings.voters.map(voter => (
                            <VoterCard
                                key={voter.email}
                                voter={voter}
                                onClick={() => removeVoter(voter)}
                                deletable
                            />
                        ))}
                    </div>
                </div>
                <div className="button-row">
                    <button onClick={onSave}>SAVE</button>
                    <button onClick={onDelete}>DELETE</button>
                </div>
            </> : <p>Tournament not found.</p>}
        </main>
    );
}