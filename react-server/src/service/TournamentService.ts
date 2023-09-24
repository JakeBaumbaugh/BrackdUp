import { Tournament } from "../model/Tournament";
import TournamentSummary from "../model/TournamentSummary";

const baseUrl = "http://24.145.26.202:3001";

export function getTournament(id: number): Promise<Tournament|undefined> {
    return get("/tournament?id=" + id)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res))
        .catch(() => {
            console.log("Failed to load data for tournament", id);
            return undefined;
        });
}

export function getTournaments(): Promise<TournamentSummary[]> {
    return get("/tournaments")
        .then(res => res.json())
        .then(res => res.map(TournamentSummary.fromJson))
        .catch(() => {
            console.log("Failed to retrieve tournaments");
            return [];
        });
}

function get(url: string): Promise<Response> {
    const fullUrl = baseUrl + url;
    return fetch(fullUrl, {
        method: "GET",
        headers: {
            "Authorization": "Basic xxxxxxxxxxxxxxx=",
            "Accept": "application/json",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
        }
    });
}