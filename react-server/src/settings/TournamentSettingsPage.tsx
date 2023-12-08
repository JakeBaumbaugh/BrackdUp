import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VoterCard from "../card/VoterCard";
import { useTournamentContext } from "../context/TournamentContext";
import TournamentSettings from "../model/TournamentSettings";
import TournamentVoter from "../model/TournamentVoter";
import { deleteTournament, getTournament, getTournamentSettings, saveTournamentSettings } from "../service/TournamentService";
import "./settings.css";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function TournamentSettingsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {tournament, setTournament} = useTournamentContext();
    const [, setLoading] = useLoadingScreenContext();
    const [settings, setSettings] = useState<TournamentSettings|null>();
    const [voterInput, setVoterInput] = useState("");

    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(tournament?.id !== id) {
            setLoading(true);
            getTournament(id).then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            }).catch(() => {
                setTournament(null);
                setLoading(false);
            });
        }
    }, [searchParams.get("id")]);

    useEffect(() => {
        if(tournament?.id) {
            setLoading(true);
            getTournamentSettings(tournament.id)
                .then(settings => setSettings(settings))
                .then(() => setLoading(false));
        }
    }, [tournament?.id]);

    const votersWithProfiles = useMemo(() => settings?.voters.filter(voter => voter.profile) ?? [], [settings]);

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
                {tournament.getVotableRound() && (
                    <div className="voting-status">
                        <h3>Current Round</h3>
                        <p>Has Voted:</p>
                        <div className="voter-profiles">
                            {votersWithProfiles?.filter(voter => voter.hasVoted).map(voter => (
                                <OverlayTrigger placement="right" key={voter.email} overlay={
                                    <Tooltip id={`${voter.email}-tooltip`}>{voter.profile!.getName()}</Tooltip>
                                }>
                                    <img src={voter.profile!.pictureLink}/>
                                </OverlayTrigger>
                            ))}
                        </div>
                        <p>Has Not Voted:</p>
                        <div className="voter-profiles">
                            {votersWithProfiles?.filter(voter => voter.hasVoted === false).map(voter => (
                                <OverlayTrigger placement="right" key={voter.email} overlay={
                                    <Tooltip id={`${voter.email}-tooltip`}>{voter.profile!.getName()}</Tooltip>
                                }>
                                    <img src={voter.profile!.pictureLink}/>
                                </OverlayTrigger>
                            ))}
                        </div>
                    </div>
                )}
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