import Entry from "../model/Entry";
import { VoteResponseBody } from "../model/ResponseBodies";
import { Tournament } from "../model/Tournament";
import TournamentBuilder from "../model/TournamentBuilder";
import TournamentSettings from "../model/TournamentSettings";
import TournamentSummary from "../model/TournamentSummary";
import TournamentType from "../model/TournamentType";
import { delet, get, post } from "./ServiceUtil";

export function getTournament(id: number): Promise<Tournament|undefined> {
    return get(`/tournament?id=${id}`)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res))
        .catch(() => {
            console.error(`Failed to retrieve tournament ${id}`);
            return undefined;
        });
}

export function getTournaments(): Promise<TournamentSummary[]> {
    return get("/tournaments")
        .then(res => res.json())
        .then(res => res.map(TournamentSummary.fromJson))
        .catch(() => {
            console.log("Failed to retrieve tournaments.");
            return [];
        });
}

export function submitVote(tournamentId: number, entryIds: number[]): Promise<VoteResponseBody> {
    return post("/tournament/vote", {
        tournament: tournamentId,
        entries: entryIds
    })
        .then(res => res.json())
}

export function getVotes(tournamentId: number): Promise<number[]|null> {
    return get(`/tournament/vote?tournamentId=${tournamentId}`)
        .then(res => res.json())
        .catch(() => {
            console.log("Failed to retrieve votes.");
            return null;
        });
}

export function getTournamentSettings(tournamentId: number): Promise<TournamentSettings|null> {
    return get(`/tournament/settings?tournamentId=${tournamentId}`)
        .then(res => res.json())
        .then(res => TournamentSettings.fromJson(res))
        .catch(() => {
            console.log("Failed to retrieve voters.");
            return null;
        });
}

export function saveTournamentSettings(settings: TournamentSettings): Promise<Response> {
    return post("/tournament/settings", settings);
}

export function deleteTournament(tournamentId: number): Promise<Response> {
    return delet(`/tournament/delete?tournamentId=${tournamentId}`);
}

export function searchEntries(type: string, line1: string, line2: string): Promise<Entry[]> {
    return get(`/entry/search?type=${type}&line1=${line1}&line2=${line2}`)
        .then(res => res.json())
        .then(res => res as Entry[])
        .catch(() => {
            console.log("Failed to search entries.");
            return [];
        });
}

export function createTournament(builder: TournamentBuilder): Promise<Response> {
    // Set entries as final entryOrder before submit
    builder.entries = builder.entryOrder;
    // Clear fields unused by server
    builder.divisions = [];
    builder.seedingOrder = [];
    builder.tieredSeedingOrder = [];
    builder.entryOrder = [];
    return post("/tournament/create", builder);
}

export function getTournamentTypes(): Promise<TournamentType[]> {
    return get("/tournament/types")
        .then(res => res.json())
        .catch(() => {
            console.log("Failed to retrieve tournament types.");
            return [];
        });
}