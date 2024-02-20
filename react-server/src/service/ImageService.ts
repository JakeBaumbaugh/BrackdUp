import { BASE_URL, get } from "./ServiceUtil";

export function getImageList(): Promise<number[]> {
    return get("/image/list")
        .then(res => res.json())
        .catch(() => {
            console.error("Failed to retrieve image list.");
            return [];
        });
}

export function imageUrl(imageId: number) {
    return `${BASE_URL}/image?id=${imageId}`;
}

export function tournamentImageUrl(tournamentId: number) {
    return `${BASE_URL}/image/tournament?tournamentId=${tournamentId}`;
}