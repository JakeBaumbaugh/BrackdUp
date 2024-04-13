import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tournament } from "../model/Tournament";
import { getTournament, getVotes } from "../service/TournamentService";
import { useLoadingScreenContext } from "./LoadingScreenContext";
import { useProfileContext } from "./ProfileContext";
import { TournamentContext } from "./TournamentContext";

const refreshDelayMs = 1000 * 15; // 15 seconds

export default function TournamentManager({children}: PropsWithChildren) {
    const [tournament, setTournament] = useState<Tournament|null>();
    const [userVotes, setUserVotes] = useState<Set<number>|null>(null);
    const [searchParams] = useSearchParams();
    const [, setLoading] = useLoadingScreenContext();
    const {profile: [profile]} = useProfileContext();
    const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout|null>(null);

    const currentRound = tournament?.getVotableRound();

    const retrieveTournamentData = (id: number): Promise<unknown> => {
        const tournamentPromise = getTournament(id)
            .then(tournament => {
                console.log("Retrieved tournament:", tournament);
                setTournament(tournament);
            })
            .catch(() => setTournament(null));
        const votesPromise = currentRound ? getVotes(tournament!.id)
            .then(entryIds => setUserVotes(entryIds ? new Set(entryIds) : null))
            .catch(() => setUserVotes(null)) : Promise.resolve();
        return Promise.all([tournamentPromise, votesPromise])
    };

    const clearData = () => {
        setTournament(undefined);
        setUserVotes(null);
    };

    const loadData = () => {
        const id = Number.parseInt(searchParams.get("id") ?? "");
        if (Number.isNaN(id)) {
            clearData();
            return;
        }
        // Start loading
        if (tournament?.id !== id || currentRound) {
            setLoading(true);
        }
        // Stop loading when all promises are resolved
        retrieveTournamentData(id)
            .then(() => setLoading(false));
        // Refresh when new round has begun
        if (tournament?.mode === "SCHEDULED") {
            const currentOrNextRound = tournament?.getCurrentOrNextRound();
            if (currentOrNextRound) {
                const targetDate = currentOrNextRound.status === "ACTIVE" ? currentOrNextRound.endDate : currentOrNextRound.startDate;
                const timeoutTriggerEpoch = targetDate!.valueOf() + refreshDelayMs;
                const timeoutId = setTimeout(() => {retrieveTournamentData(id);}, timeoutTriggerEpoch - Date.now());
                setRefreshTimeout(timeoutId);
            }
        }
    };
    
    useEffect(() => {
        setRefreshTimeout(refreshTimeout => {
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
            return null;
        });
        loadData();
    }, [searchParams.get("id"), currentRound?.id, profile]);

    const tournamentContextState = useMemo(() => (
        {tournament, loadData, clearData, userVotes, setUserVotes}
    ), [tournament, loadData, clearData, userVotes, setUserVotes]);

    return (
        <TournamentContext.Provider value={tournamentContextState}>
            {children}
        </TournamentContext.Provider>
    );
}