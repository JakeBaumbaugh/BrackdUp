import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTournamentContext } from "./TournamentContext";
import { useLoadingScreenContext } from "./LoadingScreenContext";
import { getTournament, getVotes } from "../service/TournamentService";
import { useProfileContext } from "./ProfileContext";

const refreshDelayMs = 1000 * 15; // 15 seconds

export default function TournamentManager() {
    const [searchParams] = useSearchParams();
    const {tournament, setTournament, setUserVotes} = useTournamentContext();
    const [, setLoading] = useLoadingScreenContext();
    const {profile: [profile]} = useProfileContext();

    const currentRound = tournament?.getVotableRound();

    const retrieveTournamentData = (id: number): Promise<unknown> => {
        const tournamentPromise = getTournament(id)
            .then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            })
            .catch(() => setTournament(null));
        const votesPromise = currentRound ? getVotes(tournament!.id)
            .then(songIds => setUserVotes(songIds ? new Set(songIds) : null))
            .catch(() => setUserVotes(null)) : Promise.resolve();
        return Promise.all([tournamentPromise, votesPromise])
    };
    
    useEffect(() => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if(Number.isNaN(id)) {
            return;
        }
        // Start loading
        if(tournament?.id !== id || currentRound) {
            setLoading(true);
        }
        // Stop loading when all promises are resolved
        retrieveTournamentData(id)
            .then(() => setLoading(false));
        // Refresh when new round has begun
        const currentOrNextRound = tournament?.getCurrentOrNextRound();
        if(currentOrNextRound) {
            const targetDate = currentOrNextRound.status === "ACTIVE" ? currentOrNextRound.endDate : currentOrNextRound.startDate;
            const timeoutTriggerEpoch = targetDate.valueOf() + refreshDelayMs;
            const timeoutId = setTimeout(() => {retrieveTournamentData(id);}, timeoutTriggerEpoch - Date.now());
            return () => clearTimeout(timeoutId);
        }
    }, [searchParams.get("id"), currentRound?.id, profile]);

    return <></>;
}