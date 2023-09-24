import { Tournament } from "../model/Tournament";

export function getTournament(id: number): Promise<Tournament|undefined> {
    return get("http://24.145.26.202:3001/tournament?id=" + id)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res))
        .catch(() => {
            console.log("Failed to load data for tournament", id);
            return undefined;
        });
}

function get(url: string): Promise<Response> {
    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Basic xxxxxxxxxxxxxxx=",
            "Accept": "application/json",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
        }
    });
}